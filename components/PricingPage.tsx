import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Check,
  ArrowRight,
  Clock,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { plans } from '@/data'
import { submitInquiry, fetchConfig } from '../api'

const G = '#2E8B35'
const AM = '#F5A800'
const Gr = (a: number) => `rgba(46,139,53,${a})`
const Am = (a: number) => `rgba(245,168,0,${a})`

const ANNUAL_DISCOUNT = 0.1

function formatPrice(n: number) {
  return n.toLocaleString('en-KE')
}

const DURATION_OPTIONS = [
  '1 month',
  '3 months',
  '6 months',
  '1 year',
  '2 years',
  'Custom'
]

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const navigate = useNavigate()

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company_name: '',
    plan: '',
    duration: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [dynamicPlans, setDynamicPlans] = useState(plans)

  useEffect(() => {
    fetchConfig()
      .then(data => {
        if (data?.pricing) {
          setDynamicPlans(prev => prev.map(p => data.pricing[p.id] ? { ...p, monthlyPrice: data.pricing[p.id] } : p))
        }
      })
      .catch(err => console.error(err))
  }, [])

  const openModal = (planName: string) => {
    setSelectedPlan(planName)
    setForm(prev => ({ ...prev, plan: planName }))
    setSuccess(false)
    setError(null)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setForm({ name: '', email: '', phone: '', company_name: '', plan: '', duration: '' })
    setSuccess(false)
    setError(null)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await submitInquiry(form)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getPrice = (monthlyPrice: number) => {
    if (billingCycle === 'yearly') {
      return formatPrice(Math.round(monthlyPrice * 12 * (1 - ANNUAL_DISCOUNT)))
    }
    return formatPrice(monthlyPrice)
  }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: '#fff', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .pricing-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .pricing-card:hover { transform: translateY(-6px); }
        .plan-btn {
          width: 100%; padding: 14px 24px; border-radius: 12px; border: none;
          font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 12px;
          letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer;
          transition: all 0.18s; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .plan-btn:hover { filter: brightness(0.88); transform: translateY(-1px); }
        .cta-primary {
          background: #2E8B35; color: #fff; border: none;
          padding: 16px 36px; border-radius: 12px; cursor: pointer;
          font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 13px;
          letter-spacing: 0.08em; text-transform: uppercase;
          transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 8px 32px rgba(46,139,53,0.35);
        }
        .cta-primary:hover { background: #256b2b; transform: translateY(-2px); box-shadow: 0 14px 40px rgba(46,139,53,0.45); }
        .toggle-track {
          position: relative; width: 52px; height: 28px;
          border-radius: 99px; cursor: pointer; transition: background 0.22s; flex-shrink: 0;
        }
        .toggle-thumb {
          position: absolute; top: 4px; left: 4px; width: 20px; height: 20px;
          border-radius: 50%; background: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.18);
          transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
        }
        .toggle-thumb.on { transform: translateX(24px); }
        .price-val { transition: opacity 0.18s, transform 0.18s; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.6s ease both; }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .modal-card { animation: modalIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both; }
        .modal-input {
          width: 100%; background: #F8FAFC; border: 1.5px solid #f1f5f9;
          border-radius: 12px; padding: 14px 18px; font-family: 'Poppins', sans-serif;
          font-size: 14px; font-weight: 500; color: #111827; outline: none;
          transition: all 0.2s;
        }
        .modal-input:focus { border-color: #2E8B35; background: #fff; box-shadow: 0 4px 12px rgba(46,139,53,0.1); }
        .modal-label {
          display: block; font-size: 11px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.12em;
          color: #64748b; margin-bottom: 8px;
        }
        .modal-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .modal-close-btn {
          position: absolute; top: 24px; right: 24px;
          background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 12px;
          width: 40px; height: 40px; display: flex;
          align-items: center; justify-content: center;
          cursor: pointer; color: #64748b; transition: all 0.2s;
        }
        .modal-close-btn:hover { background: #f1f5f9; color: #111827; }
        .modal-submit-btn {
          width: 100%; background: #2E8B35; color: #fff; border: none; border-radius: 14px;
          padding: 18px; font-family: 'Poppins', sans-serif; font-weight: 700;
          font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
          margin-top: 12px; transition: all 0.2s; box-shadow: 0 8px 24px rgba(46,139,53,0.25);
        }
        .modal-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px); box-shadow: 0 12px 32px rgba(46,139,53,0.35); background: #256b2b;
        }
        .modal-submit-btn:disabled {
          background: #94a3b8; cursor: not-allowed; box-shadow: none;
        }
        .modal-done-btn {
          margin-top: 36px; background: #2E8B35; color: #fff;
          border: none; border-radius: 12px; padding: 16px 40px;
          font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 14px;
          letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer;
          box-shadow: 0 8px 24px rgba(46,139,53,0.3); transition: all 0.2s;
        }
        .modal-done-btn:hover {
          transform: translateY(-2px); box-shadow: 0 12px 32px rgba(46,139,53,0.4); background: #256b2b;
        }
        @media (max-width: 900px) {
          .plans-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .modal-form-grid { grid-template-columns: 1fr; gap: 16px; }
          .modal-card { padding: 32px 24px !important; }
        }
      `}</style>

      {/* ── MODAL OVERLAY ── */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(2,4,6,0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
            overflowY: 'auto'
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div
            className='modal-card'
            style={{
              background: '#fff', borderRadius: '32px', width: '100%',
              maxWidth: '720px', padding: '56px', position: 'relative',
              boxShadow: '0 32px 80px rgba(0,0,0,0.25)', margin: 'auto'
            }}
          >
            {/* Close button */}
            <button className='modal-close-btn' onClick={closeModal}>
              <X size={20} />
            </button>

            {success ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: Gr(0.1), display: 'flex', alignItems: 'center',
                  justifyContent: 'center', margin: '0 auto 24px'
                }}>
                  <CheckCircle size={40} color={G} />
                </div>
                <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
                  Submission Received!
                </h3>
                <p style={{ fontSize: '15px', color: '#64748b', fontWeight: 500, lineHeight: 1.6, maxWidth: '400px', margin: '0 auto' }}>
                  Thanks for your interest in the <strong style={{ color: G }}>{selectedPlan}</strong> plan.
                  Our team will reach out within 2 hours to get you started.
                </p>
                <button className='modal-done-btn' onClick={closeModal}>
                  Done
                </button>
              </div>
            ) : (
              <>
                {/* Header */}
                <div style={{ marginBottom: '36px' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    background: Gr(0.08), border: `1px solid ${Gr(0.2)}`,
                    borderRadius: '99px', padding: '6px 16px', marginBottom: '16px'
                  }}>
                    <Check size={12} color={G} strokeWidth={3} />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: G, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      {selectedPlan} Plan
                    </span>
                  </div>
                  <h3 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', letterSpacing: '-0.03em', marginBottom: '8px' }}>
                    Get Started Today
                  </h3>
                  <p style={{ fontSize: '15px', color: '#64748b', fontWeight: 500, lineHeight: 1.6 }}>
                    Fill in your details below and our team will be in touch within 2 hours to help you set up.
                  </p>
                </div>

                {error && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    background: '#fff1f2', border: '1.5px solid #fecdd3',
                    borderRadius: '12px', padding: '16px 20px', marginBottom: '24px'
                  }}>
                    <AlertCircle size={18} color='#e11d48' />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#e11d48' }}>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className='modal-form-grid'>
                    <div>
                      <label className='modal-label'>Full Name</label>
                      <input
                        className='modal-input'
                        type='text'
                        name='name'
                        value={form.name}
                        onChange={handleChange}
                        placeholder='Jane Doe'
                        required
                      />
                    </div>
                    <div>
                      <label className='modal-label'>Email Address</label>
                      <input
                        className='modal-input'
                        type='email'
                        name='email'
                        value={form.email}
                        onChange={handleChange}
                        placeholder='jane@spa.com'
                        required
                      />
                    </div>
                  </div>

                  <div className='modal-form-grid'>
                    <div>
                      <label className='modal-label'>Phone Number</label>
                      <input
                        className='modal-input'
                        type='tel'
                        name='phone'
                        value={form.phone}
                        onChange={handleChange}
                        placeholder='+254 712 345 678'
                        required
                      />
                    </div>
                    <div>
                      <label className='modal-label'>Company Name</label>
                      <input
                        className='modal-input'
                        type='text'
                        name='company_name'
                        value={form.company_name}
                        onChange={handleChange}
                        placeholder='Azure Wellness Spa'
                        required
                      />
                    </div>
                  </div>

                  <div className='modal-form-grid'>
                    <div>
                      <label className='modal-label'>Interested Plan</label>
                      <select
                        className='modal-input'
                        name='plan'
                        value={form.plan}
                        onChange={handleChange}
                        required
                        style={{ cursor: 'pointer', appearance: 'none' }}
                      >
                        <option value=''>Select a plan...</option>
                        {plans.map(p => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className='modal-label'>Required Duration</label>
                      <select
                        className='modal-input'
                        name='duration'
                        value={form.duration}
                        onChange={handleChange}
                        required
                        style={{ cursor: 'pointer', appearance: 'none' }}
                      >
                        <option value=''>Select duration...</option>
                        {DURATION_OPTIONS.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button type='submit' disabled={loading} className='modal-submit-btn'>
                    {loading ? 'Submitting...' : 'Subscribe Now'} {!loading && <ArrowRight size={16} />}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section style={{ position: 'relative', background: '#ffffff', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.04) 1px,transparent 1px)',
          backgroundSize: '60px 60px', zIndex: 0
        }} />
        <div style={{ width: '100%', maxWidth: '1920px', margin: '0 auto', padding: '80px 5vw 60px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(36px, 4vw, 64px)', fontWeight: 800, lineHeight: 1.0, color: '#3a3939', letterSpacing: '-0.04em', margin: 0, fontFamily: '"Playfair Display", serif' }}>
            Pricing<br />
            <span style={{ color: G }}>For</span> <span style={{ color: AM }}>The</span><br />
            Modern Brand.
          </h1>
        </div>
      </section>

      {/* ── BILLING TOGGLE ── */}
      <div style={{ background: '#fff', padding: '40px 5vw 32px', maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: billingCycle === 'monthly' ? '#111827' : '#94a3b8', transition: 'color 0.18s', letterSpacing: '0.02em' }}>Monthly</span>
          <div className='toggle-track' style={{ background: billingCycle === 'yearly' ? G : '#d1d5db' }}
            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
            role='switch' aria-checked={billingCycle === 'yearly'}
          >
            <div className={`toggle-thumb${billingCycle === 'yearly' ? ' on' : ''}`} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: billingCycle === 'yearly' ? '#111827' : '#94a3b8', transition: 'color 0.18s', letterSpacing: '0.02em' }}>Annual</span>
          <span style={{ background: Gr(0.08), color: G, border: `1px solid ${Gr(0.2)}`, padding: '3px 10px', borderRadius: '99px', fontSize: '9px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Save 10%</span>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Annual commitment</span>
        </div>
      </div>

      {/* ── FREE TRIAL BANNER ── */}
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 5vw 32px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '18px',
          background: '#f8fafc', border: `1.5px solid ${Gr(0.15)}`,
          borderRadius: '16px', padding: '18px 24px',
          boxShadow: `0 8px 24px ${Gr(0.04)}`
        }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: '#fff', border: `1px solid ${Gr(0.1)}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, boxShadow: `0 4px 12px ${Gr(0.06)}`
          }}>
            <Clock size={22} color={G} strokeWidth={2.5} />
          </div>
          <div>
            <p style={{ fontSize: '16px', fontWeight: 500, color: '#475569', margin: 0, letterSpacing: '-0.01em', lineHeight: 1.4 }}>
              Enjoy a <strong style={{ color: '#111827', fontWeight: 800 }}>15-Day Free Trial</strong> on any plan for your first subscription.{' '}
              <span style={{ color: G, fontWeight: 700 }}>No credit card required.</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── PRICING CARDS ── */}
      <section style={{ padding: '0 5vw 96px', maxWidth: '1600px', margin: '0 auto' }}>
        <div className='plans-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', alignItems: 'stretch' }}>
          {dynamicPlans.map((plan, i) => {
            const isGreen = plan.theme === 'green'
            const isDark = plan.theme === 'dark'
            const displayPrice = getPrice(plan.monthlyPrice)
            return (
              <div key={plan.id} className='pricing-card fade-up'
                style={{
                  position: 'relative', display: 'flex', flexDirection: 'column',
                  padding: '40px 36px', borderRadius: '24px',
                  background: isDark ? '#111827' : isGreen ? Gr(0.05) : '#f8fafc',
                  border: isGreen ? `1.5px solid ${Gr(0.25)}` : isDark ? `1.5px solid ${Am(0.2)}` : '1.5px solid #f1f5f9',
                  boxShadow: isGreen ? `0 20px 60px ${Gr(0.1)}` : isDark ? '0 20px 60px rgba(0,0,0,0.2)' : '0 4px 24px rgba(0,0,0,0.04)',
                  animationDelay: `${i * 0.1}s`
                }}
              >
                {plan.popular && (
                  <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: isDark ? AM : G, color: isDark ? '#111827' : '#fff', padding: '6px 16px', borderRadius: '99px', fontSize: '9px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: isDark ? `0 8px 20px ${Am(0.4)}` : `0 8px 20px ${Gr(0.35)}` }}>
                    <Check size={9} strokeWidth={4} /> Industry Standard
                  </div>
                )}
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? Am(0.15) : isGreen ? Gr(0.12) : 'rgba(17,24,39,0.06)', marginBottom: '20px' }}>
                    <plan.icon size={20} color={isDark ? AM : isGreen ? G : '#111827'} />
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: isDark ? '#fff' : '#111827', marginBottom: '4px' }}>{plan.name}</h2>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: isDark ? 'rgba(255,255,255,0.7)' : '#94a3b8', marginBottom: '24px', lineHeight: 1.5 }}>{plan.tagline}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: isDark ? 'rgba(255,255,255,0.6)' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>KES</span>
                    <span className='price-val' style={{ fontSize: '42px', fontWeight: 900, letterSpacing: '-0.04em', color: isDark ? AM : isGreen ? G : '#111827', lineHeight: 1 }}>{displayPrice}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: isDark ? 'rgba(255,255,255,0.5)' : '#64748b' }}>{billingCycle === 'yearly' ? '/ yr' : '/ mo'}</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p style={{ fontSize: '11px', fontWeight: 600, color: isDark ? 'rgba(255,255,255,0.5)' : '#64748b', marginTop: '4px', letterSpacing: '0.02em' }}>
                      KES {formatPrice(Math.round(plan.monthlyPrice * (1 - ANNUAL_DISCOUNT)))} / mo · billed annually
                    </p>
                  )}
                </div>
                <div style={{ height: '1px', background: isDark ? 'rgba(255,255,255,0.07)' : '#f1f5f9', marginBottom: '24px' }} />
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '13px', flex: 1, marginBottom: '32px' }}>
                  {plan.features.map((f, fi) => (
                    <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '7px', background: isDark ? Am(0.15) : isGreen ? Gr(0.1) : 'rgba(17,24,39,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={12} strokeWidth={3} color={isDark ? AM : isGreen ? G : '#111827'} />
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: isDark ? 'rgba(255,255,255,0.75)' : '#475569' }}>{f}</span>
                    </li>
                  ))}
                </ul>
                {/* ── Plan button now opens modal ── */}
                <button
                  className='plan-btn'
                  style={{ background: isDark ? AM : isGreen ? G : '#111827', color: isDark ? '#111827' : '#fff' }}
                  onClick={() => openModal(plan.name)}
                >
                  {plan.buttonText} <ArrowRight size={13} />
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '140px 5vw' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img src='/images/cta2.jpeg' alt='Zen Spa Treatment' style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,4,6,0.45)' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
            <div style={{ width: '24px', height: '2px', background: G }} />
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.45em', textTransform: 'uppercase', color: G }}>Bespoke</span>
            <div style={{ width: '24px', height: '2px', background: G }} />
          </div>
          <h2 style={{ fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '20px' }}>
            Bespoke<br /><span style={{ color: G }}>Consultation</span><br />Available.
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.78, marginBottom: '48px', fontWeight: 400 }}>
            Don't fit into a standard box? Our enterprise strategists are ready to craft a unique configuration just for your brand's vision.
          </p>
          <button className='cta-primary' style={{ padding: '18px 48px', fontSize: '13px' }} onClick={() => navigate('/contact')}>
            Book a Strategy Session <ArrowRight size={15} />
          </button>
        </div>
      </section>
    </div>
  )
}

export default PricingPage