<?php
/**
 * Contact form endpoint: POST /api/contact (public/.htaccess rewrites the clean
 * URL to this file).
 *
 * The rest of the site is static, so this is its only server code. It validates
 * the form, drops obvious bots, throttles each IP, and emails the message to the
 * sales inbox with Reply-To set to the visitor, so sales can answer in one click.
 * Once sales has the message, the visitor gets a short "thank you" confirmation.
 *
 * Mail goes out over SMTP using the MAIL_* settings in the .env file one level
 * above the web root (see ENV_FILE). That file holds the SMTP password, so it
 * lives outside the public folder, where Apache cannot serve it, and out of git.
 * SMTP mail is sent as the account it logs in with (MAIL_USERNAME): Gmail
 * rewrites any other From address to that one anyway.
 *
 * Without that .env, mail falls back to the server's own mail transport (PHP
 * mail()). The SPF record for myspa.co.ke authorises this server and cPanel
 * DKIM-signs for the domain, so SENDER must stay a @myspa.co.ke address or
 * delivery suffers.
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

/** The name the visitor sees on their confirmation. */
const CONFIRMATION_SENDER_NAME = 'MySpa';
const CONFIRMATION_SUBJECT = 'Thank you for contacting MySpa';

/**
 * SMTP settings, as MAIL_* lines. One level above the web root, so Apache never
 * serves it: the project root locally, the folder above public_html on the server.
 */
const ENV_FILE = __DIR__ . '/../../.env';
const SMTP_TIMEOUT_SECONDS = 15;

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

    // Folded onto separate lines: a long non-Latin name could otherwise push the
    // header past SMTP's 998-character line limit and get the email rejected.
    return implode("\r\n ", array_map(static function (string $word): string {
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

/**
 * "Hi Jane," from the name field, but only when its first word looks like a
 * name. The confirmation goes to whatever address was typed into the form, so
 * it must never carry free text a spammer could fill with a link.
 */
function greeting(string $name): string
{
    return preg_match('/^([\p{L}\p{M}\'-]{1,40})(?:\s|$)/u', $name, $match) === 1
        ? 'Hi ' . $match[1] . ','
        : 'Hello,';
}

// ── Sending ─────────────────────────────────────────────────────────────────

/**
 * KEY=value pairs from a .env file, quotes optional, # comment lines skipped.
 * No ${VAR} expansion: only the literal MAIL_* values are needed.
 *
 * @return array<string, string>
 */
function readEnvFile(string $path): array
{
    $values = [];
    foreach (@file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        if (preg_match('/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/', $line, $match) !== 1) {
            continue;
        }
        $value = $match[2];
        if (strlen($value) >= 2 && ($value[0] === '"' || $value[0] === "'") && substr($value, -1) === $value[0]) {
            $value = substr($value, 1, -1);
        }
        $values[$match[1]] = $value;
    }

    return $values;
}

/**
 * The SMTP account from ENV_FILE, or null to send with mail() instead.
 *
 * @return array{host: string, port: int, username: string, password: string, encryption: string}|null
 */
function smtpConfig(): ?array
{
    static $loaded = false;
    static $config = null;
    if ($loaded) {
        return $config;
    }
    $loaded = true;

    $env = readEnvFile(ENV_FILE);
    if (strtolower($env['MAIL_MAILER'] ?? '') !== 'smtp') {
        return null;
    }
    foreach (['MAIL_HOST', 'MAIL_PORT', 'MAIL_USERNAME', 'MAIL_PASSWORD'] as $key) {
        if (($env[$key] ?? '') === '') {
            error_log('contact.php: ' . $key . ' is missing from ' . ENV_FILE . ', sending with mail() instead');
            return null;
        }
    }

    return $config = [
        'host' => $env['MAIL_HOST'],
        'port' => (int) $env['MAIL_PORT'],
        'username' => $env['MAIL_USERNAME'],
        'password' => $env['MAIL_PASSWORD'],
        'encryption' => strtolower($env['MAIL_ENCRYPTION'] ?? ''),
    ];
}

/**
 * Delivers one finished message over SMTP: only the commands a single
 * authenticated send needs. Throws RuntimeException with the server's reply.
 */
function smtpSend(array $smtp, string $to, string $message): void
{
    // Port 465 is TLS from the first byte; others (587) upgrade with STARTTLS.
    $implicitTls = $smtp['port'] === 465 || $smtp['encryption'] === 'ssl';
    $socket = @stream_socket_client(
        ($implicitTls ? 'ssl://' : 'tcp://') . $smtp['host'] . ':' . $smtp['port'],
        $errno,
        $errstr,
        SMTP_TIMEOUT_SECONDS
    );
    if ($socket === false) {
        throw new RuntimeException('could not connect to ' . $smtp['host'] . ': ' . $errstr);
    }
    stream_set_timeout($socket, SMTP_TIMEOUT_SECONDS);

    // Reads one reply (each line but the last has "-" after the code) and checks
    // its code. Errors name the step, never the command: AUTH carries the password.
    $expect = static function (int $code, string $step) use ($socket): void {
        $reply = '';
        do {
            $line = fgets($socket, 1024);
            if ($line === false) {
                throw new RuntimeException($step . ': connection closed or timed out');
            }
            $reply .= $line;
        } while (isset($line[3]) && $line[3] === '-');
        if ((int) substr($reply, 0, 3) !== $code) {
            throw new RuntimeException($step . ': ' . trim($reply));
        }
    };
    $command = static function (string $line, int $code, string $step) use ($socket, $expect): void {
        fwrite($socket, $line . "\r\n");
        $expect($code, $step);
    };

    try {
        $expect(220, 'greeting');
        $hello = 'EHLO ' . (gethostname() ?: 'localhost');
        $command($hello, 250, 'EHLO');
        if (!$implicitTls) {
            $command('STARTTLS', 220, 'STARTTLS');
            if (stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT) !== true) {
                throw new RuntimeException('STARTTLS: TLS handshake failed');
            }
            $command($hello, 250, 'EHLO');
        }
        $command('AUTH PLAIN ' . base64_encode("\0" . $smtp['username'] . "\0" . $smtp['password']), 235, 'AUTH');
        $command('MAIL FROM:<' . $smtp['username'] . '>', 250, 'MAIL FROM');
        $command('RCPT TO:<' . $to . '>', 250, 'RCPT TO');
        $command('DATA', 354, 'DATA');
        // A line holding only "." ends the message, so leading dots are doubled.
        $command(preg_replace('/^\./m', '..', $message) . "\r\n.", 250, 'message');
        fwrite($socket, "QUIT\r\n");
    } finally {
        fclose($socket);
    }
}

/**
 * Sends one plain-text email: over SMTP when ENV_FILE configures it, otherwise
 * with mail() from SENDER.
 *
 * Local testing only (see vite.config.ts): MYSPA_CONTACT_DRY_RUN=1 logs the
 * email instead of sending it. Never set this on the server.
 */
function sendMail(string $to, string $subject, string $body, string $fromName, array $headers): bool
{
    $smtp = smtpConfig();
    $from = $smtp['username'] ?? SENDER;
    $headers = ['From' => mailbox($fromName, $from)] + $headers + [
        'MIME-Version' => '1.0',
        'Content-Type' => 'text/plain; charset=UTF-8',
        'Content-Transfer-Encoding' => 'quoted-printable',
    ];
    $headerLines = static function (array $headers): string {
        return implode("\r\n", array_map(static function (string $key, string $value): string {
            return $key . ': ' . $value;
        }, array_keys($headers), $headers));
    };

    if (getenv('MYSPA_CONTACT_DRY_RUN') === '1') {
        error_log('[contact dry run via ' . ($smtp === null ? 'mail()' : 'SMTP ' . $smtp['host']) . "]\n"
            . 'To: ' . $to . "\nSubject: " . $subject . "\n" . $headerLines($headers) . "\n\n" . $body);
        return true;
    }

    if ($smtp === null) {
        // -f sets the envelope sender, which is the address SPF checks.
        return mail($to, $subject, quoted_printable_encode($body), $headers, '-f' . SENDER);
    }

    // mail() writes To, Subject and Date itself; over SMTP the message must carry them.
    $message = $headerLines([
        'Date' => date('r'),
        'To' => $to,
        'Subject' => $subject,
        'Message-ID' => '<' . bin2hex(random_bytes(16)) . '@' . substr((string) strrchr($from, '@'), 1) . '>',
    ] + $headers) . "\r\n\r\n" . quoted_printable_encode($body);

    try {
        smtpSend($smtp, $to, $message);
        return true;
    } catch (RuntimeException $e) {
        error_log('contact.php: SMTP ' . $e->getMessage());
        return false;
    }
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
// The message is optional: name, contact details and subject are enough to follow up.
if (length($message) > MAX_MESSAGE_LENGTH) {
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
    $message === '' ? '(No message provided)' : str_replace(["\r\n", "\r", "\n"], "\r\n", $message),
    '',
    '--',
    'Sent ' . $sentAt . ' EAT from IP ' . $ip,
]);

$sent = sendMail(RECIPIENT, encodeHeader('Website enquiry from ' . $name . ': ' . $subject), $body, SENDER_NAME, [
    'Reply-To' => mailbox($name, $email),
]);

if (!$sent) {
    error_log('contact.php: sending failed for a message from ' . $email);
    respond(500, ['message' => 'We could not send your message. Please try again, or email ' . RECIPIENT . '.']);
}

// ── Confirmation to the visitor ─────────────────────────────────────────────
// Fixed wording only: nothing from the subject or message is echoed back, so
// the form cannot be used to send someone else an email with a spammer's text.

$confirmation = implode("\r\n", [
    greeting($name),
    '',
    'Thank you for contacting MySpa. We have received your enquiry and a member',
    'of our team will get back to you shortly. We typically respond within 2 hours.',
    '',
    'If you have anything to add in the meantime, just reply to this email and it',
    'will reach our team.',
    '',
    'Warm regards,',
    'The MySpa Team',
    'https://myspa.co.ke',
    '',
    '--',
    'You are receiving this because this address was entered in the contact form',
    'on myspa.co.ke. If that was not you, you can safely ignore this email.',
]);

$confirmed = sendMail($email, encodeHeader(CONFIRMATION_SUBJECT), $confirmation, CONFIRMATION_SENDER_NAME, [
    // Replies go to sales rather than to the sending account.
    'Reply-To' => RECIPIENT,
    // RFC 3834: marks the email as automatic, so mail servers do not answer it
    // with out-of-office or vacation replies.
    'Auto-Submitted' => 'auto-generated',
    'X-Auto-Response-Suppress' => 'All',
]);

// Sales already has the enquiry, so a failed confirmation is logged, not reported:
// telling the visitor to resend would only produce a duplicate enquiry.
if (!$confirmed) {
    error_log('contact.php: confirmation failed for ' . $email);
}

respond(200, ['message' => 'Message sent successfully.']);
