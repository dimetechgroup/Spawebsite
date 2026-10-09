<?php
/**
 * Contact form endpoint: POST /api/contact (public/.htaccess rewrites the clean
 * URL to this file).
 *
 * The rest of the site is static, so this is its only server code. It validates
 * the form, drops obvious bots, throttles each IP, and emails the message to the
 * sales inbox with Reply-To set to the visitor, so sales can answer in one click.
 *
 * Mail goes out through the server's own mail transport (PHP mail()). The SPF
 * record for myspa.co.ke authorises this server and cPanel DKIM-signs for the
 * domain, so SENDER must stay a @myspa.co.ke address or delivery suffers.
 *
 * Nothing in this file is secret, and it must stay that way: if PHP ever stopped
 * executing for this site, Apache would serve the file as plain text.
 *
 * Written for PHP 7.4+ with no extensions beyond the defaults, since the
 * version the host runs for this site is not pinned anywhere.
 */

declare(strict_types=1);

const RECIPIENT = 'sales@dimetechgroup.com';
const SENDER = 'no-reply@myspa.co.ke';
const SENDER_NAME = 'MySpa Website';

/** Messages accepted per IP per window. Generous for people, closed to loops. */
const MAX_PER_WINDOW = 5;
const WINDOW_SECONDS = 3600;

/** Hidden from people by the form, so only bots fill them in. */
const HONEYPOT_FIELDS = ['website', 'url', 'homepage'];

const MAX_FIELD_LENGTH = 255;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_BODY_BYTES = 65536;

function respond(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

/** Character count without relying on mbstring being installed. */
function length(string $text): int
{
    return (int) preg_match_all('/./su', $text);
}

/** Strips anything that could break out of a mail header. */
function headerSafe(string $text): string
{
    return trim((string) preg_replace('/[\x00-\x1F\x7F]+/', ' ', $text));
}

/**
 * RFC 2047 encoding for non-ASCII header text. Encoded words must stay under 75
 * characters, so the text is split on character boundaries; decoders join
 * adjacent encoded words back together.
 */
function encodeHeader(string $text): string
{
    $text = headerSafe($text);
    if (preg_match('/^[\x20-\x7E]*$/', $text) === 1) {
        return $text;
    }

    $words = [];
    $chunk = '';
    foreach (preg_split('//u', $text, -1, PREG_SPLIT_NO_EMPTY) as $char) {
        if (strlen($chunk . $char) > 45) {
            $words[] = $chunk;
            $chunk = '';
        }
        $chunk .= $char;
    }
    $words[] = $chunk;

    return implode(' ', array_map(static function (string $word): string {
        return '=?UTF-8?B?' . base64_encode($word) . '?=';
    }, $words));
}

/** "Display Name" <address>, quoted or encoded as the name requires. */
function mailbox(string $name, string $address): string
{
    $name = headerSafe($name);
    $display = preg_match('/^[\x20-\x7E]*$/', $name) === 1
        ? '"' . addcslashes($name, '"\\') . '"'
        : encodeHeader($name);

    return $display . ' <' . $address . '>';
}

// ── Per-IP throttle ─────────────────────────────────────────────────────────
// One small file per IP in the temp directory, holding the timestamps of its
// recent submissions. If the directory is not writable the throttle fails open:
// a real customer must never be turned away because of it.

function throttleFile(string $ip): string
{
    $dir = sys_get_temp_dir() . '/myspa-contact';
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }

    return $dir . '/' . hash('sha256', $ip);
}

/** @return int[] this IP's submission times still inside the window */
function recentSubmissions(string $file): array
{
    $lines = @file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
    $since = time() - WINDOW_SECONDS;

    return array_values(array_filter(array_map('intval', $lines), static function (int $time) use ($since): bool {
        return $time > $since;
    }));
}

function recordSubmission(string $file): void
{
    $times = recentSubmissions($file);
    $times[] = time();
    @file_put_contents($file, implode("\n", $times) . "\n", LOCK_EX);
}

// ── Request ─────────────────────────────────────────────────────────────────

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['message' => 'Method not allowed.']);
}

// JSON only. A cross-site HTML form cannot send this content type, and a
// cross-origin fetch that tries must first pass a CORS preflight this endpoint
// never answers, so browsers can only submit from pages on this site.
$contentType = (string) ($_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '');
if (stripos($contentType, 'application/json') === false) {
    respond(415, ['message' => 'Unsupported content type.']);
}

$data = json_decode((string) file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES), true);
if (!is_array($data)) {
    respond(400, ['message' => 'Invalid request.']);
}

$field = static function (string $key) use ($data): string {
    return is_string($data[$key] ?? null) ? trim($data[$key]) : '';
};

// The site is served by Apache directly, so REMOTE_ADDR is the visitor. If a
// proxy or CDN is ever put in front, this must read the forwarded address.
$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$throttle = throttleFile($ip);

if (count(recentSubmissions($throttle)) >= MAX_PER_WINDOW) {
    respond(429, ['message' => 'Too many messages sent. Please try again later.']);
}

foreach (HONEYPOT_FIELDS as $trap) {
    if ($field($trap) !== '') {
        // Counted, so a bot that trips the trap does not get free retries.
        recordSubmission($throttle);
        respond(422, ['message' => 'Invalid submission.']);
    }
}

$name = $field('name');
$email = $field('email');
$phone = $field('phone');
$subject = $field('subject');
$message = $field('message');

$errors = [];
if ($name === '') {
    $errors['name'] = 'Name is required.';
} elseif (length($name) > MAX_FIELD_LENGTH) {
    $errors['name'] = 'Name may not exceed ' . MAX_FIELD_LENGTH . ' characters.';
}
if ($email === '') {
    $errors['email'] = 'Email is required.';
} elseif (length($email) > MAX_FIELD_LENGTH || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    $errors['email'] = 'A valid email address is required.';
}
if ($phone === '') {
    $errors['phone'] = 'Phone number is required.';
} elseif (preg_match('/^\+?[0-9 ()-]{7,30}$/', $phone) !== 1) {
    $errors['phone'] = 'A valid phone number is required.';
}
if ($subject === '') {
    $errors['subject'] = 'Subject is required.';
} elseif (length($subject) > MAX_FIELD_LENGTH) {
    $errors['subject'] = 'Subject may not exceed ' . MAX_FIELD_LENGTH . ' characters.';
}
if ($message === '') {
    $errors['message'] = 'Message is required.';
} elseif (length($message) > MAX_MESSAGE_LENGTH) {
    $errors['message'] = 'Message may not exceed ' . MAX_MESSAGE_LENGTH . ' characters.';
}
if ($errors !== []) {
    // Shown to the visitor as-is, so name the first problem rather than a generic error.
    respond(422, ['message' => reset($errors), 'errors' => $errors]);
}

// Counted on success too, so the limit caps accepted messages, not only rejected ones.
recordSubmission($throttle);

// ── Email ───────────────────────────────────────────────────────────────────

$sentAt = (new DateTimeImmutable('now', new DateTimeZone('Africa/Nairobi')))->format('j M Y, H:i');
$body = implode("\r\n", [
    'New message from the contact form on myspa.co.ke.',
    'Reply to this email to answer ' . headerSafe($name) . ' directly.',
    '',
    'Name:    ' . headerSafe($name),
    'Email:   ' . $email,
    'Phone:   ' . $phone,
    'Subject: ' . headerSafe($subject),
    '',
    'Message:',
    '',
    str_replace(["\r\n", "\r", "\n"], "\r\n", $message),
    '',
    '--',
    'Sent ' . $sentAt . ' EAT from IP ' . $ip,
]);

$mailSubject = encodeHeader('Website enquiry from ' . $name . ': ' . $subject);
$headers = [
    'From' => mailbox(SENDER_NAME, SENDER),
    'Reply-To' => mailbox($name, $email),
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
    'Content-Transfer-Encoding' => 'quoted-printable',
];

// Local testing only (see vite.config.ts): log the email instead of sending it.
// Never set this on the server.
if (getenv('MYSPA_CONTACT_DRY_RUN') === '1') {
    error_log("[contact dry run]\nTo: " . RECIPIENT . "\nSubject: " . $mailSubject . "\n"
        . implode("\n", array_map(static function (string $key, string $value): string {
            return $key . ': ' . $value;
        }, array_keys($headers), $headers))
        . "\n\n" . $body);
    respond(200, ['message' => 'Message sent successfully.']);
}

// -f sets the envelope sender, which is the address SPF checks.
$sent = mail(RECIPIENT, $mailSubject, quoted_printable_encode($body), $headers, '-f' . SENDER);

if (!$sent) {
    error_log('contact.php: mail() failed for a message from ' . $email);
    respond(500, ['message' => 'We could not send your message. Please try again, or email ' . RECIPIENT . '.']);
}

respond(200, ['message' => 'Message sent successfully.']);
