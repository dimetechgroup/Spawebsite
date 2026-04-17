import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Sparkles,
  ArrowUpRight,
  Zap,
  Smartphone,
  Shield,
  LayoutGrid,
  Receipt,
  Wallet,
  Play,
  Activity
} from 'lucide-react'
import {
  anchorFeatures,
  utilityFeatures,
  featuresPageMarqueeItems
} from '@/data'

const FeaturesPage: React.FC = () => {
  const navigate = useNavigate()
  const marqueeItems = [
    { text: 'REAL-TIME METRICS', icon: Activity },
    { text: 'MOBILE-FIRST UI', icon: Smartphone },
    { text: 'GDPR COMPLIANT', icon: Shield },
    { text: 'SETUP IN MINUTES', icon: Zap }
  ]
  const [showMore, setShowMore] = React.useState(false)
  const hiddenFeatures = anchorFeatures.filter(f => f.hidden)
  const [playing, setPlaying] = useState(false)

  return (
    <div className='bg-white selection:bg-[#207D40] selection:text-white'>
      {/* HERO SECTION */}
      <section className='relative pt-32 pb-20 lg:pt-48 lg:pb-28 overflow-hidden'>
        <div className='absolute top-0 right-0 w-1/3 h-full bg-[#F8FAFC] pointer-events-none skew-x-[-6deg] translate-x-12'></div>

        <div className='max-w-[1700px] mx-auto px-6 md:px-12 relative z-10'>
          <div className='flex flex-col lg:flex-row items-center justify-between gap-12 xl:gap-20'>
            <div className='lg:w-[55%] xl:w-7/12'>
              <div className='flex items-center gap-3 mb-8 overflow-hidden'>
                <span className='h-px w-10 bg-[#207D40]'></span>
                <span className='text-[11px] font-black uppercase tracking-[0.4em] text-[#207D40]'>
                  The Product Compendium
                </span>
              </div>

              <h1
                className='text-4xl md:text-5xl lg:text-6xl font-black text-[#111827] leading-[1.1] tracking-tighter mb-8'
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                All-in-One <br />
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#207D40] to-[#F7A300]'>
                  ERP Software
                </span>{' '}
                <br />
                Designed Exclusively for Spas.
              </h1>

              <p className='text-sm md:text-base text-gray-500 font-medium max-w-lg leading-relaxed mb-8'>
                My Spa Management System is a purpose-built Spa ERP that helps
                spa owners streamline operations, eliminate disconnected tools,
                and make smarter business decisions.
              </p>
            </div>

            <div className='lg:w-[50%] xl:w-[48%] relative'>
              <div className='relative'>
                <div className='relative rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white  group hover:rotate-0 transition-transform duration-1000 max-w-[700px] ml-auto'>
                  <img
                    src='/images/Dashboard.png'
                    alt='Artisan Spa Experience'
                    className='w-full h-full object-contain group-hover:scale-105 transition-transform duration-1000'
                  />

                  <div className='absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent'></div>
                </div>

                <div className='absolute -bottom-4 -left-6 z-20'>
                  <button
                    onClick={() => navigate('/contact')}
                    className='bg-[#207D40] text-white px-8 py-4 rounded-xl font-black text-base hover:bg-[#1a6333] transition-all flex items-center gap-2 group shadow-xl active:scale-95 border-2 border-white whitespace-nowrap'
                  >
                    Request a Demo
                    <ArrowUpRight
                      size={18}
                      className='group-hover:rotate-45 transition-transform'
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ─── CORE FOUNDATIONS BENTO ────────────────────────────────── */}
      <section
        style={{
          padding: '6rem 0 7rem',
          background: '#F7A300',
          borderRadius: '4rem 4rem 0 0',
          marginTop: '-1px'
        }}
      >
        <div
          style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 2.5rem' }}
        >
          <div style={{ marginBottom: '4rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '1.2rem'
              }}
            >
              <span
                style={{
                  display: 'block',
                  width: '32px',
                  height: '2px',
                  background: 'rgba(255,255,255,0.6)'
                }}
              />
              <span
                className='font-body'
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.38em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.75)'
                }}
              >
                Foundation
              </span>
            </div>
            <h2
              className='font-display'
              style={{
                fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                fontWeight: 900,
                color: 'white',
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
                marginBottom: '1rem'
              }}
            >
              Core Foundations
            </h2>
            <p
              className='font-body'
              style={{
                color: 'rgba(255,255,255,0.75)',
                fontSize: '0.95rem',
                maxWidth: '480px',
                lineHeight: 1.7
              }}
            >
              The pillars of your digital transformation, designed to handle the
              heavy lifting of management.
            </p>
          </div>

          {/* Bento Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gridAutoRows: '240px',
              gap: '14px'
            }}
          >
            {/* Dashboard - spans 8 cols, 2 rows */}
            <div
              className='bento-card'
              style={{
                gridColumn: 'span 8',
                gridRow: 'span 2',
                borderRadius: '2rem',
                overflow: 'hidden',
                position: 'relative',
                background: '#111',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow:
                  '0 12px 48px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06)'
              }}
            >
              <img
                src={anchorFeatures[0].img}
                alt={anchorFeatures[0].name}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.55
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 45%, transparent 100%)'
                }}
              />
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  height: '100%',
                  padding: '2.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end'
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '13px',
                    background: '#207D40',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.3rem',
                    boxShadow: '0 8px 24px rgba(32,125,64,0.5)'
                  }}
                >
                  <LayoutGrid size={20} color='white' />
                </div>
                <h3
                  className='font-display'
                  style={{
                    fontSize: '2rem',
                    fontWeight: 900,
                    color: 'white',
                    marginBottom: '0.65rem',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {anchorFeatures[0].name}
                </h3>
                <p
                  className='font-body'
                  style={{
                    color: 'rgba(229,233,239,0.95)',
                    fontSize: '0.85rem',
                    maxWidth: '520px',
                    lineHeight: 1.75
                  }}
                >
                  {anchorFeatures[0].desc}
                </p>
              </div>
            </div>

            {/* CRM */}
            <div
              className='bento-card'
              style={{
                gridColumn: 'span 4',
                borderRadius: '2rem',
                overflow: 'hidden',
                position: 'relative',
                background: '#111',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow:
                  '0 12px 48px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06)'
              }}
            >
              <img
                src={anchorFeatures[1].img}
                alt={anchorFeatures[1].name}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.5
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)'
                }}
              />
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  height: '100%',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end'
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '11px',
                    background: '#F7A300',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    boxShadow: '0 6px 18px rgba(247,163,0,0.45)'
                  }}
                >
                  <Users size={17} color='white' />
                </div>
                <h3
                  className='font-display'
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    color: 'white',
                    marginBottom: '0.45rem',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {anchorFeatures[1].name}
                </h3>
                <p
                  className='font-body'
                  style={{
                    color: 'rgba(229,233,239,0.95)',
                    fontSize: '0.78rem',
                    lineHeight: 1.7
                  }}
                >
                  {anchorFeatures[1].desc}
                </p>
              </div>
            </div>

            {/* Orders */}
            <div
              className='bento-card'
              style={{
                gridColumn: 'span 4',
                borderRadius: '2rem',
                overflow: 'hidden',
                position: 'relative',
                background: '#111',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow:
                  '0 12px 48px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06)'
              }}
            >
              <img
                src={anchorFeatures[2].img}
                alt={anchorFeatures[2].name}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.5
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)'
                }}
              />
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  height: '100%',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end'
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '11px',
                    background: '#207D40',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    boxShadow: '0 6px 18px rgba(32,125,64,0.45)'
                  }}
                >
                  <Receipt size={17} color='white' />
                </div>
                <h3
                  className='font-display'
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    color: 'white',
                    marginBottom: '0.45rem',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {anchorFeatures[2].name}
                </h3>
                <p
                  className='font-body'
                  style={{
                    color: 'rgba(229,233,239,0.95)',
                    fontSize: '0.78rem',
                    lineHeight: 1.7
                  }}
                >
                  {anchorFeatures[2].desc}
                </p>
              </div>
            </div>

            {/* Accounting */}
            <div
              className='bento-card'
              style={{
                gridColumn: 'span 8',
                borderRadius: '2rem',
                overflow: 'hidden',
                position: 'relative',
                background: '#111',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow:
                  '0 12px 48px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06)'
              }}
            >
              <img
                src={anchorFeatures[3].img}
                alt={anchorFeatures[3].name}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.6
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)'
                }}
              />
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  height: '100%',
                  padding: '2.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end'
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '13px',
                    background: '#F7A300',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.3rem',
                    boxShadow: '0 8px 24px rgba(247,163,0,0.5)'
                  }}
                >
                  <Wallet size={20} color='white' />
                </div>
                <h3
                  className='font-display'
                  style={{
                    fontSize: '2rem',
                    fontWeight: 900,
                    color: 'white',
                    marginBottom: '0.65rem',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {anchorFeatures[3].name}
                </h3>
                <p
                  className='font-body'
                  style={{
                    color: 'rgba(229,233,239,0.95)',
                    fontSize: '0.85rem',
                    maxWidth: '600px',
                    lineHeight: 1.75
                  }}
                >
                  {anchorFeatures[3].desc}
                </p>
              </div>
            </div>

            {/* CTA Card */}
            <div
              style={{
                gridColumn: 'span 4',
                borderRadius: '2rem',
                background:
                  'linear-gradient(150deg, #207D40 0%, #1a5e30 50%, #0f3d1e 100%)',
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow:
                  '0 12px 48px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.08)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Layered glows for depth */}
              <div
                style={{
                  position: 'absolute',
                  top: '-30px',
                  right: '-30px',
                  width: '140px',
                  height: '140px',
                  background:
                    'radial-gradient(circle, rgba(247,163,0,0.22) 0%, transparent 70%)',
                  borderRadius: '50%',
                  pointerEvents: 'none'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  left: '-20px',
                  width: '100px',
                  height: '100px',
                  background:
                    'radial-gradient(circle, rgba(247,163,0,0.12) 0%, transparent 70%)',
                  borderRadius: '50%',
                  pointerEvents: 'none'
                }}
              />
              <Sparkles
                size={30}
                color='#F7A300'
                style={{
                  marginBottom: '1.3rem',
                  filter: 'drop-shadow(0 4px 12px rgba(247,163,0,0.4))'
                }}
              />
              <h3
                className='font-display'
                style={{
                  fontSize: '1.55rem',
                  fontWeight: 900,
                  color: 'white',
                  marginBottom: '0.65rem',
                  letterSpacing: '-0.01em'
                }}
              >
                Wait, there's more.
              </h3>
              <p
                className='font-body'
                style={{
                  color: 'rgba(255,255,255,0.88)',
                  fontSize: '0.8rem',
                  lineHeight: 1.7,
                  marginBottom: '2rem'
                }}
              >
                Discover our full utility suite designed for high-precision
                operations.
              </p>

              <button
                onClick={() => setShowMore(prev => !prev)}
                style={{
                  background: 'white',
                  color: '#F7A300',
                  border: 'none',
                  padding: '0.7rem 2rem',
                  borderRadius: '50px',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.25)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow =
                    '0 12px 32px rgba(0,0,0,0.3)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow =
                    '0 6px 24px rgba(0,0,0,0.25)'
                }}
              >
                {showMore ? 'Hide the List ↑' : 'See the List ↓'}
              </button>
            </div>
          </div>
          {/* Revealed hidden features */}
          {showMore && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '14px',
                marginTop: '14px',
                animation: 'fadeSlideIn 0.4s ease forwards'
              }}
            >
              {hiddenFeatures.map((feature, i) => (
                <div
                  key={i}
                  className='bento-card'
                  style={{
                    borderRadius: '2rem',
                    overflow: 'hidden',
                    position: 'relative',
                    background: '#111',
                    height: '240px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow:
                      '0 12px 48px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06)'
                  }}
                >
                  <img
                    src={feature.img}
                    alt={feature.name}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.5
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)'
                    }}
                  />
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      height: '100%',
                      padding: '2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '11px',
                        background: i % 2 === 0 ? '#207D40' : '#F7A300',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                        boxShadow:
                          i % 2 === 0
                            ? '0 6px 18px rgba(32,125,64,0.45)'
                            : '0 6px 18px rgba(247,163,0,0.45)'
                      }}
                    >
                      <feature.icon size={17} color='white' />
                    </div>
                    <h3
                      className='font-display'
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        color: 'white',
                        marginBottom: '0.45rem',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {feature.name}
                    </h3>
                    <p
                      className='font-body'
                      style={{
                        color: 'rgba(229,233,239,0.95)',
                        fontSize: '0.78rem',
                        lineHeight: 1.7
                      }}
                    >
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* EXPLAINER VIDEO SECTION */};
      <section className='py-24 bg-black relative overflow-hidden'>
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#F7A300]/5 blur-[120px] rounded-full pointer-events-none'></div>

        <div className='container mx-auto px-4 md:px-8 relative z-10'>
          <div className='text-center mb-16 max-w-4xl mx-auto'>
            <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-[#F7A300] text-[10px] font-black uppercase tracking-[0.4em] mb-8'>
              <Activity size={10} className='animate-pulse' /> Integration
              Showcase
            </div>
            <h2 className='text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter mb-4 leading-tight'>
              One Unified <br /> Ecosystem.
            </h2>
            <p className='text-sm text-gray-400 font-medium max-w-xl mx-auto leading-relaxed'>
              Witness how our modular architecture integrates seamlessly to
              create a frictionless management experience for your entire staff.
            </p>
          </div>

          <div className='relative max-w-4xl mx-auto group'>
            <div
              className='relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 aspect-video bg-gray-900 cursor-pointer'
              onClick={() => setPlaying(true)}
            >
              {playing ? (
                <video
                  src='/images/demo.mp4'
                  className='w-full h-full object-cover'
                  autoPlay
                  controls
                  playsInline
                />
              ) : (
                <>
                  <img
                    src='https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop'
                    alt='System Integration Demo'
                    className='w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent' />
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='w-16 h-16 rounded-full bg-white/10 backdrop-blur-2xl border border-white/30 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#F7A300] group-hover:border-[#F7A300] transition-all duration-500 shadow-2xl'>
                      <Play size={24} fill='currentColor' className='ml-1' />
                    </div>
                  </div>
                </>
              )}
            </div>

            {playing && (
              <div className='flex justify-center mt-8'>
                <button
                  onClick={() => navigate('/contact')}
                  className='flex items-center gap-2.5 bg-[#207D40] hover:bg-[#1a6333] text-white text-sm font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg'
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  Book Your Demo
                  <ArrowUpRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* UTILITY SUITE SECTION */}
      <section className='py-24'>
        <div className='container mx-auto px-4 md:px-8 max-w-[1600px]'>
          <div className='flex flex-col lg:flex-row gap-16'>
            {/* Heading, Subheading & Cards */}
            <div className='lg:w-full flex flex-col gap-8'>
              {/* Heading & Subheading */}
              <div className='text-center lg:sticky lg:top-40 h-fit'>
                <div className='flex justify-center items-center gap-3 mb-4'>
                  <div className='w-2 h-2 rounded-full bg-[#F7A300]'></div>
                  <h2 className='text-[11px] font-black uppercase tracking-[0.4em] text-[#111827]'>
                    Utility Suite
                  </h2>
                </div>

                <h3 className='text-3xl md:text-4xl font-black text-[#111827] tracking-tighter mb-6 leading-tight'>
                  Precision Tools for Every Touchpoint.
                </h3>

                <p className='text-gray-500 font-medium text-sm leading-relaxed mb-8'>
                  While the foundations hold the structure, these tools provide
                  the daily refinement that sets elite spas apart.
                </p>
              </div>

              {/* Cards in rows */}
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {utilityFeatures.map((f, i) => (
                  <div
                    key={i}
                    className='bg-white p-10 group hover:bg-orange-50 transition-colors rounded-2xl shadow-lg flex flex-col items-center text-center'
                  >
                    <div className='w-10 h-10 mb-6 text-[#207D40] group-hover:text-[#F7A300] transition-colors'>
                      <f.icon size={24} strokeWidth={1.5} />
                    </div>

                    <h4 className='text-xl font-black text-[#111827] mb-2 tracking-tight'>
                      {f.name}
                    </h4>

                    <p className='text-gray-500 font-medium leading-relaxed text-[12px]'>
                      {f.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* MARQUEE BANNER */}
      <div className='relative w-full overflow-hidden bg-gradient-to-r from-[#207D40] via-[#5d8d32] to-[#F7A300] py-6 flex items-center shadow-lg border-y border-white/10'>
        <div className='flex whitespace-nowrap animate-marquee items-center'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className='flex items-center'>
              {featuresPageMarqueeItems.map((item, idx) => (
                <div key={idx} className='flex items-center mx-12'>
                  <span className='text-white/40 text-2xl mr-12 font-light'>
                    /
                  </span>
                  <div className='flex items-center gap-4'>
                    <item.icon size={20} className='text-white' />
                    <span className='text-white font-black text-[13px] tracking-[0.25em]'>
                      {item.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* FINAL CTA */}
      <section
        className='py-32 lg:py-48 relative overflow-hidden text-center bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage: `url('/images/wmremove-transformed (22).jpeg')`
        }}
      >
        {/* Optional dark overlay for better text readability */}
        <div className='absolute inset-0 bg-black/30 z-0'></div>

        <div className='container mx-auto px-4 md:px-8 relative z-10 text-center'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-tight mb-8'>
              The Future of <br />
              <span className='italic font-serif font-light text-[#F7A300]'>
                Wellness
              </span>{' '}
              Is Here.
            </h2>
            <p className='text-base md:text-lg text-gray-100 font-medium max-w-xl mx-auto mb-12 leading-relaxed'>
              Step into a new era of management. Reclaim your focus, empower
              your staff, and delight every guest.
            </p>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-5'>
              <button
                onClick={() => navigate('/contact')}
                className='bg-[#F7A300] text-white px-10 py-4 rounded-xl font-black text-base hover:bg-orange-600 transition-all shadow-xl active:scale-95'
              >
                Start Your Transformation
              </button>
            </div>
          </div>
        </div>
      </section>
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: inline-flex; animation: marquee 30s linear infinite; }
        .font-serif { font-family: 'Times New Roman', serif; }
        @keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
      `}</style>
    </div>
  )
}

export default FeaturesPage
