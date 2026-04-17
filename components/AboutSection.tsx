import React, { useState } from 'react'
import {
  CheckCircle2,
  Award,
  Users,
  Trophy,
  LayoutGrid,
  BarChart3,
  Receipt,
  Wallet,
  Gift,
  Users2,
  Box,
  Sparkles
} from 'lucide-react'
import { motion } from 'framer-motion'
import { modules } from '@/data'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
    }
  }
}

const AboutSection: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <section
      className='py-28 overflow-hidden'
      style={{ background: '#FDFAF6' }}
    >
      <div className='max-w-[90rem] mx-auto px-6 lg:px-10'>
        {' '}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
          }}
          className='flex flex-col lg:flex-row items-end justify-between gap-8 mb-16'
        >
          <div className='lg:w-3/5'>
            <div
              className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] mb-6'
              style={{
                borderColor: 'rgba(46,139,53,0.3)',
                background: 'rgba(46,139,53,0.07)',
                color: '#2E8B35',
                fontFamily: '"DM Sans", sans-serif'
              }}
            >
              <Trophy size={9} /> Enterprise Spa ERP
            </div>

            <h2
              className='text-4xl md:text-5xl lg:text-[3.2rem] font-bold leading-[1.1] tracking-[-0.025em] text-[#0d1f0d]'
              style={{ fontFamily: '"Playfair Display",serif' }}
            >
              The highest-rated spa{' '}
              <em
                className='not-italic'
                style={{
                  background:
                    'linear-gradient(100deg, #2E8B35 10%, #F5A800 85%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                software
              </em>{' '}
              in the industry.
            </h2>
          </div>

          <div className='lg:w-2/5 lg:pb-2'>
            <p
              className='text-[#5a6e5a] text-base leading-relaxed'
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              Welcome to MySpa your ultimate solution for revolutionizing how
              you manage and grow your wellness business, from a single location
              to a global franchise.
            </p>
          </div>
        </motion.div>
        {/* ── Main card ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
          }}
          className='grid lg:grid-cols-2 rounded-[2.5rem] overflow-hidden'
          style={{
            boxShadow:
              '0 40px 80px rgba(13,31,13,0.12), 0 0 0 1px rgba(13,31,13,0.06)'
          }}
        >
          {/* ── Left: image panel ── */}
          <div
            className='relative min-h-[420px] lg:min-h-full'
            style={{ background: '#0d1f0d' }}
          >
            <img
              src='https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop'
              alt='MySpa Platform'
              className='absolute inset-0 w-full h-full object-cover'
            />

            {/* Top badge */}
            <div className='absolute top-8 left-8'>
              <div
                className='flex items-center gap-2 px-4 py-2 rounded-full text-white text-[10px] font-bold uppercase tracking-[0.18em]'
                style={{
                  background: 'rgba(46,139,53,0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(46,139,53,0.4)',
                  fontFamily: '"DM Sans", sans-serif',
                  boxShadow: '0 4px 16px rgba(46,139,53,0.3)'
                }}
              >
                <LayoutGrid size={11} /> Modular Infrastructure
              </div>
            </div>

            {/* Stat cards */}
            <div className='absolute bottom-10 left-8 right-8 grid grid-cols-2 gap-3'>
              {[
                {
                  icon: Award,
                  value: '#1 Rated',
                  label: 'Global SaaS 2024',
                  color: '#F5A800'
                },
                {
                  icon: CheckCircle2,
                  value: '99.9%',
                  label: 'Uptime Record',
                  color: '#2E8B35'
                }
              ].map((stat, i) => (
                <div
                  key={i}
                  className='p-4 rounded-2xl'
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.12)'
                  }}
                >
                  <stat.icon
                    size={18}
                    style={{ color: stat.color, marginBottom: 8 }}
                  />
                  <div
                    className='text-2xl font-bold text-white leading-none'
                    style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className='text-[10px] font-bold uppercase tracking-[0.15em] mt-1.5 opacity-50 text-white'
                    style={{ fontFamily: '"DM Sans", sans-serif' }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: modules panel ── */}
          <div
            className='p-10 md:p-12 lg:p-14 flex flex-col justify-center'
            style={{ background: 'white' }}
          >
            <h3
              className='text-2xl md:text-3xl font-bold text-[#0d1f0d] mb-2 leading-tight tracking-[-0.02em]'
              style={{ fontFamily: '"Playfair Display" ,serif' }}
            >
              A serene, high-precision
            </h3>
            <h3
              className='text-2xl md:text-3xl font-bold mb-8 leading-tight tracking-[-0.02em]'
              style={{
                fontFamily: '"Playfair Display" ,serif',
                background: 'linear-gradient(100deg, #2E8B35, #F5A800)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              system for your team.
            </h3>

            <motion.div
              variants={containerVariants}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, margin: '-40px' }}
              className='grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-1'
            >
              {modules.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className='group flex items-start gap-3 p-3 rounded-xl cursor-default transition-all duration-300'
                  style={{
                    background:
                      hoveredIdx === idx ? `${item.accent}08` : 'transparent',
                    border: `1px solid ${
                      hoveredIdx === idx ? item.accent + '25' : 'transparent'
                    }`
                  }}
                >
                  {/* Icon */}
                  <div
                    className='w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 mt-0.5'
                    style={{
                      background:
                        hoveredIdx === idx ? item.accent : `${item.accent}12`,
                      border: `1px solid ${item.accent}30`
                    }}
                  >
                    <item.icon
                      size={13}
                      style={{
                        color: hoveredIdx === idx ? 'white' : item.accent
                      }}
                    />
                  </div>

                  {/* Text */}
                  <div>
                    <p
                      className='text-[12px] font-bold uppercase tracking-wider leading-none mb-1.5 transition-colors duration-300'
                      style={{
                        color: hoveredIdx === idx ? item.accent : '#0d1f0d',
                        fontFamily: '"DM Sans", sans-serif'
                      }}
                    >
                      {item.name}
                    </p>
                    <p
                      className='text-[11px] leading-relaxed'
                      style={{
                        color: '#4b5563',
                        fontFamily: '"DM Sans", sans-serif'
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection
