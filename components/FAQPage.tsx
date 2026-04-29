import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  Zap,
  CreditCard,
  Sparkles,
  Gift,
  Users,
  ArrowRight,
  MessageCircle
} from 'lucide-react'
import { faqs, faqCategoryColors } from '@/data'

const categoryColors = {
  General: { bg: '#f0fdf4', color: '#207D40', border: '#bbf7d0' },
  'Getting Started': { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  Pricing: { bg: '#fefce8', color: '#d97706', border: '#fde68a' },
  Billing: { bg: '#fdf4ff', color: '#9333ea', border: '#e9d5ff' },
  Security: { bg: '#fff1f2', color: '#e11d48', border: '#fecdd3' },
  Features: { bg: '#f0fdf4', color: '#207D40', border: '#bbf7d0' },
  Operations: { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
  Growth: { bg: '#f0fdf4', color: '#207D40', border: '#bbf7d0' }
}

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const navigate = useNavigate()

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        background: '#fff',
        minHeight: '100vh'
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&display=swap');
        * { box-sizing: border-box; }

        .faq-row {
          cursor: pointer;
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.15s ease;
        }
        .faq-row:last-child { border-bottom: none; }
        .faq-row:hover { background: #fafafa; }
        .faq-row.active { background: #f9fff9; }

        .answer-grid {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.32s cubic-bezier(0.4,0,0.2,1);
        }
        .answer-grid.open { grid-template-rows: 1fr; }
        .answer-inner { overflow: hidden; }

        .chevron-icon {
          transition: transform 0.32s cubic-bezier(0.4,0,0.2,1);
        }
        .chevron-icon.open { transform: rotate(180deg); }

        .cat-tag {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 99px;
          border: 1px solid;
          line-height: 1.8;
          white-space: nowrap;
          margin-bottom: 6px;
        }

        .stat-pill {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 12px;
          padding: 12px 20px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #207D40;
          color: #fff;
          border: none;
          padding: 13px 28px;
          border-radius: 10px;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.18s, transform 0.15s;
          white-space: nowrap;
        }
        .cta-btn:hover { background: #185e30; transform: translateY(-1px); }

        .outline-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: #fff;
          border: 1.5px solid rgba(255,255,255,0.2);
          padding: 13px 28px;
          border-radius: 10px;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.18s;
        }
        .outline-btn:hover { border-color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.06); }

        .icon-box {
          width: 46px; height: 46px; flex-shrink: 0;
          border-radius: 13px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }

        .chevron-box {
          width: 36px; height: 36px; flex-shrink: 0;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }

        @media (max-width: 960px) {
          .page-grid { grid-template-columns: 1fr !important; }
          .sticky-sidebar { position: static !important; height: auto !important; }
          .sidebar-img { aspect-ratio: 16/7 !important; }
        }
      `}</style>

      <section
        style={{
          position: 'relative',
          background: '#070f0a',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src='https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1800&q=80&auto=format&fit=crop'
            alt='Luxury spa'
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.3
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(120deg, rgba(7,15,10,0.97) 0%, rgba(7,15,10,0.75) 55%, rgba(32,125,64,0.25) 100%)'
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)',
            backgroundSize: '64px 64px'
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            padding: '96px 7vw 80px',
            maxWidth: '100%'
          }}
        >
          <div style={{ maxWidth: '860px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '22px'
              }}
            >
              <div
                style={{ width: '28px', height: '2px', background: '#4ade80' }}
              />
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.45em',
                  textTransform: 'uppercase',
                  color: '#4ade80'
                }}
              >
                Knowledge Base
              </span>
            </div>
            <h1
              style={{
                fontSize: 'clamp(42px, 5.5vw, 74px)',
                fontWeight: 800,
                lineHeight: 1.04,
                color: '#fff',
                margin: '0 0 18px',
                letterSpacing: '-0.03em'
              }}
            >
              Frequently Asked
              <br />
              <span
                style={{
                  color: '#4ade80',
                  fontStyle: 'italic',
                  fontWeight: 700
                }}
              >
                Questions.
              </span>
            </h1>
            <p
              style={{
                fontSize: '15px',
                color: 'rgba(255,255,255,0.88)',
                lineHeight: 1.78,
                margin: '0 0 44px',
                maxWidth: '500px',
                fontWeight: 400
              }}
            >
              Everything you need to know about MySpa from getting started to
              scaling your wellness business.
            </p>
          </div>
        </div>
      </section>

      <div
        className='page-grid'
        style={{
          display: 'grid',
          gridTemplateColumns: '360px 1fr',
          alignItems: 'stretch'
        }}
      >
        {/* sidebar */}
        <aside
          style={{
            background: '#F5A800',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Sticky panel — takes up all space above the badge */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              height: '100vh',
              padding: '48px 36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '28px',
              overflow: 'hidden',
              flex: '0 0 auto'
            }}
          >
            <div
              className='sidebar-img'
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                aspectRatio: '4/3',
                position: 'relative',
                zIndex: 1
              }}
            >
              <img
                src='https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=700&q=80&auto=format&fit=crop'
                alt='Spa treatment room'
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  color: '#4ade80',
                  display: 'block',
                  marginBottom: '10px'
                }}
              >
                MySpa ERP
              </span>
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#fff',
                  margin: '0 0 12px',
                  lineHeight: 1.3,
                  letterSpacing: '-0.02em'
                }}
              >
                Your complete spa management solution.
              </h2>
              <p
                style={{
                  fontSize: '12px',
                  color: 'white',
                  lineHeight: 1.8,
                  margin: 0,
                  fontWeight: 400
                }}
              >
                Trusted by elite wellness brands worldwide to run leaner,
                smarter, and more profitably.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                position: 'relative',
                zIndex: 1
              }}
            >
              <button
                className='cta-btn'
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => navigate('/contact')}
              >
                Request a Demo <ArrowRight size={13} />
              </button>
              <button
                className='outline-btn'
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <MessageCircle size={13} /> Chat with Us
              </button>
            </div>
          </div>

          {/* Spacer pushes badge to bottom of section */}
          <div style={{ flex: 1 }} />

          {/* Trust badge — sits at the very bottom of the full-height aside */}
        </aside>

        {/* RIGHT — FAQ LIST */}
        <main
          style={{
            background: '#f8fafc',
            padding: '56px 4vw 80px 6vw',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <div style={{ width: '100%', maxWidth: '820px' }}>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#94a3b8',
                margin: '0 0 28px'
              }}
            >
              {faqs.length} questions answered
            </p>

            <div
              style={{
                borderRadius: '20px',
                border: '1px solid #e8eef4',
                overflow: 'hidden',
                background: '#fff',
                boxShadow: '0 2px 40px rgba(0,0,0,0.05)'
              }}
            >
              {faqs.map((faq, idx) => {
                const isOpen = openIndex === idx
                const tag =
                  categoryColors[faq.category as keyof typeof categoryColors] ||
                  categoryColors.General
                return (
                  <div
                    key={idx}
                    className={`faq-row ${isOpen ? 'active' : ''}`}
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '22px 28px',
                        gap: '16px'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '18px',
                          flex: 1,
                          minWidth: 0
                        }}
                      >
                        <div
                          className='icon-box'
                          style={{ background: isOpen ? '#207D40' : '#f1f5f9' }}
                        >
                          <faq.icon
                            size={20}
                            strokeWidth={2}
                            color={isOpen ? '#fff' : '#94a3b8'}
                          />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <span
                            className='cat-tag'
                            style={{
                              background: tag.bg,
                              color: tag.color,
                              borderColor: tag.border
                            }}
                          >
                            {faq.category}
                          </span>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: 600,
                              color: isOpen ? '#0f172a' : '#334155',
                              lineHeight: 1.45,
                              letterSpacing: '-0.01em'
                            }}
                          >
                            {faq.question}
                          </div>
                        </div>
                      </div>
                      <div
                        className='chevron-box'
                        style={{
                          background: isOpen ? 'rgba(32,125,64,0.1)' : '#f8fafc'
                        }}
                      >
                        <ChevronDown
                          size={20}
                          strokeWidth={2.5}
                          className={`chevron-icon ${isOpen ? 'open' : ''}`}
                          style={{ color: isOpen ? '#207D40' : '#cbd5e1' }}
                        />
                      </div>
                    </div>

                    <div className={`answer-grid ${isOpen ? 'open' : ''}`}>
                      <div className='answer-inner'>
                        <div
                          style={{
                            padding: '20px 28px 26px 92px',
                            borderTop: '1px solid #f1f5f9'
                          }}
                        >
                          <p
                            style={{
                              fontSize: '15px',
                              color: '#64748b',
                              lineHeight: 1.85,
                              margin: 0,
                              fontWeight: 400
                            }}
                          >
                            {faq.answer}
                          </p>
                          {faq.youtubeUrl && (
                            <button
                              onClick={e => {
                                e.stopPropagation()
                                window.open(
                                  faq.youtubeUrl,
                                  '_blank',
                                  'noopener,noreferrer'
                                )
                              }}
                              style={{
                                marginTop: '16px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: '#FF0000',
                                color: '#fff',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: 700,
                                fontFamily: "'Poppins', sans-serif",
                                letterSpacing: '0.04em',
                                cursor: 'pointer',
                                transition: 'background 0.18s, transform 0.15s'
                              }}
                              onMouseEnter={e => {
                                ;(
                                  e.currentTarget as HTMLButtonElement
                                ).style.background = '#cc0000'
                                ;(
                                  e.currentTarget as HTMLButtonElement
                                ).style.transform = 'translateY(-1px)'
                              }}
                              onMouseLeave={e => {
                                ;(
                                  e.currentTarget as HTMLButtonElement
                                ).style.background = '#FF0000'
                                ;(
                                  e.currentTarget as HTMLButtonElement
                                ).style.transform = 'translateY(0)'
                              }}
                            >
                              <svg
                                width='16'
                                height='16'
                                viewBox='0 0 24 24'
                                fill='currentColor'
                                aria-hidden='true'
                              >
                                <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
                              </svg>
                              Watch on YouTube
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bottom CTA */}
            <div
              style={{
                marginTop: '28px',
                background: 'linear-gradient(135deg, #070f0a 0%, #1a3d24 100%)',
                borderRadius: '20px',
                padding: '34px 40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px',
                flexWrap: 'wrap',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 70%)',
                  pointerEvents: 'none'
                }}
              />
              <div>
                <h3
                  style={{
                    margin: '0 0 5px',
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#fff',
                    letterSpacing: '-0.02em'
                  }}
                >
                  Still have questions?
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.4)',
                    fontWeight: 400
                  }}
                >
                  Our support team is online and ready to help.
                </p>
              </div>
              <button className='cta-btn'>
                <MessageCircle size={14} /> Chat with an Expert
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default FAQPage
