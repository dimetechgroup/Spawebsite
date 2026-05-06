import React from 'react'
import { ArrowRight, Play, Clock, TrendingUp, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const perks = [
  { icon: Clock, text: 'Save 15+ hours per week' },
  { icon: TrendingUp, text: '+31% avg. revenue in 90 days' },
  { icon: Zap, text: 'Full setup in under 4 minutes' }
]

const CTASection: React.FC = () => {
  const navigate = useNavigate()
  return (
    <section className='py-24 bg-white relative overflow-hidden'>
      <div className='max-w-7xl mx-auto px-6 lg:px-10'>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
          }}
          className='relative rounded-[2.5rem] overflow-hidden'
          style={{
            background:
              'linear-gradient(135deg, #207D40 0%, #185e30 50%, #0f4020 100%)',
            boxShadow:
              '0 40px 100px rgba(32,125,64,0.25), 0 0 0 1px rgba(32,125,64,0.3)'
          }}
        >
          {/* ── Decorative blobs ── */}
          <div className='pointer-events-none absolute inset-0 overflow-hidden'>
            <div
              className='absolute -top-20 -right-20 w-[520px] h-[520px] rounded-full opacity-25'
              style={{
                background: 'radial-gradient(circle, #F7A300, transparent 65%)',
                filter: 'blur(70px)'
              }}
            />
            <div
              className='absolute -bottom-16 -left-16 w-[320px] h-[320px] rounded-full opacity-15'
              style={{
                background: 'radial-gradient(circle, #F7A300, transparent 65%)',
                filter: 'blur(60px)'
              }}
            />
            <svg className='absolute inset-0 w-full h-full opacity-[0.05]'>
              <defs>
                <pattern
                  id='cta-grid'
                  x='0'
                  y='0'
                  width='28'
                  height='28'
                  patternUnits='userSpaceOnUse'
                >
                  <circle cx='2' cy='2' r='1.4' fill='white' />
                </pattern>
              </defs>
              <rect width='100%' height='100%' fill='url(#cta-grid)' />
            </svg>
          </div>

          {/* ── Two-column grid ── */}
          <div className='relative z-10 grid lg:grid-cols-[1fr_420px] items-stretch'>
            {/* ── LEFT: copy ── */}
            <div className='p-10 md:p-14 lg:p-16 flex flex-col justify-center'>
              {/* Headline */}
              <h2
                className='text-4xl md:text-5xl lg:text-[3.2rem] font-bold leading-[1.08] tracking-[-0.025em] text-white mb-5'
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Transform Your <br />
                <span style={{ color: '#F7A300' }}>Business Today.</span>
              </h2>

              <p
                className='text-base leading-[1.75] mb-8 max-w-md'
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  fontFamily: '"DM Sans", sans-serif'
                }}
              >
                The ultimate ERP solution tailored for high-end wellness. Join
                250 + spa owners already saving time and growing revenue.
              </p>

              {/* Perks */}
              <div className='flex flex-col gap-3 mb-10'>
                {perks.map((perk, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.15 + i * 0.1,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1] as [
                        number,
                        number,
                        number,
                        number
                      ]
                    }}
                    className='flex items-center gap-3'
                  >
                    <div
                      className='w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0'
                      style={{
                        background: 'rgba(247,163,0,0.18)',
                        border: '1px solid rgba(247,163,0,0.3)'
                      }}
                    >
                      <perk.icon size={13} color='#F7A300' strokeWidth={1.8} />
                    </div>
                    <span
                      className='text-sm font-medium'
                      style={{
                        color: 'rgba(255,255,255,0.75)',
                        fontFamily: '"DM Sans", sans-serif'
                      }}
                    >
                      {perk.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  className='flex items-center gap-2 text-sm px-7 py-3.5 rounded-xl font-semibold'
                  onClick={() => navigate('/contact')}
                  style={{
                    background: '#F7A300',
                    color: '#207D40',
                    fontWeight: 700,
                    boxShadow: '0 10px 30px rgba(247,163,0,0.4)',
                    fontFamily: '"DM Sans", sans-serif'
                  }}
                >
                  <span
                    className='w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0'
                    style={{
                      background: 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <Play size={9} fill='white' color='white' />
                  </span>
                  Book a demo
                </motion.button>
              </div>
            </div>

            {/* ── RIGHT: image panel ── */}
            <div
              className='relative hidden lg:block min-h-[480px]'
              style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* Photo */}
              <img
                src='/images/cta3.jpeg'
                alt='MySpa Analytics Preview'
                className='absolute inset-0 w-full h-full object-cover'
              />

              {/* Floating booking badge — bottom */}
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5, ease: 'backOut' }}
                className='absolute bottom-8 left-6 right-6 p-4 rounded-2xl flex items-center gap-4'
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.2)'
                }}
              >
                <div className='flex -space-x-2'>
                  {['#A8C5A0', '#F7A300', '#207D40'].map((c, i) => (
                    <div
                      key={i}
                      className='w-8 h-8 rounded-full border-2 flex-shrink-0'
                      style={{
                        background: c,
                        borderColor: '#185e30',
                        zIndex: 3 - i
                      }}
                    />
                  ))}
                </div>
                <div>
                  <p
                    className='text-sm font-bold text-white leading-none'
                    style={{ fontFamily: '"DM Sans", sans-serif' }}
                  >
                    250+ Spa Owners
                  </p>
                  <p
                    className='text-[11px] font-semibold mt-1'
                    style={{
                      color: '#F7A300',
                      fontFamily: '"DM Sans", sans-serif'
                    }}
                  >
                    already scaling with MySpa
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTASection
