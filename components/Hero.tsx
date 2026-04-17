'use client'

import React, { useEffect, useRef } from 'react'
import {
  Play,
  ShieldCheck,
  Star,
  TrendingUp,
  Sparkles,
  Users
} from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const fadeUp: import('framer-motion').Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
    }
  })
}

const Hero: React.FC = () => {
  const navigate = useNavigate()
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 })
  const rotateX = useTransform(springY, [-0.5, 0.5], ['6deg', '-6deg'])
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-6deg', '6deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <section className='relative min-h-screen bg-[#FDFAF6] overflow-hidden flex items-center'>
      {/* ── Decorative background ── */}
      <div className='pointer-events-none absolute inset-0'>
        <div
          className='absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full opacity-30'
          style={{
            background:
              'radial-gradient(circle at 60% 40%, #A8C5A0 0%, #C9DFC5 40%, transparent 70%)',
            filter: 'blur(80px)'
          }}
        />
        <div
          className='absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full opacity-25'
          style={{
            background:
              'radial-gradient(circle at 40% 60%, #F5C97A 0%, #F9E4B0 50%, transparent 70%)',
            filter: 'blur(70px)'
          }}
        />

        <div
          className='absolute top-0 right-[38%] w-px h-full opacity-10'
          style={{
            background:
              'linear-gradient(180deg, transparent, #207D40 40%, transparent)'
          }}
        />
      </div>

      <div className='relative max-w-screen-2xl mx-auto px-6 lg:px-16 py-24 lg:py-0 w-full'>
        <div className='grid lg:grid-cols-[1fr_1.15fr] gap-14 xl:gap-20 items-center'>
          {/* ─────────── LEFT COLUMN ─────────── */}
          <div className='flex flex-col items-start'>
            <motion.h1
              variants={fadeUp}
              initial='hidden'
              animate='visible'
              custom={1}
              style={{ fontFamily: '"Playfair Display", serif' }}
              className='text-[2.85rem] lg:text-[3.6rem] xl:text-[4.2rem] 2xl:text-[4.4rem] font-bold text-[#0d1f0d] leading-[1.08] tracking-[-0.02em] mb-6'
            >
              Simplify Spa
              <br />
              Operations.
              <br />
              <em
                className='not-italic'
                style={{
                  background:
                    'linear-gradient(100deg, #207D40 10%, #F7A300 80%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Grow with Confidence.
              </em>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial='hidden'
              animate='visible'
              custom={2}
              style={{ fontFamily: '"DM Sans", sans-serif' }}
              className='text-[#5a6e5a] text-[1rem] leading-[1.75] max-w-[450px] mb-10'
            >
              My Spa Management System is designed exclusively for spas. We are
              helping owners digitize operations, gain real-time visibility, and
              scale with confidence from anywhere.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial='hidden'
              animate='visible'
              custom={3}
              className='flex flex-col sm:flex-row items-start gap-3 mb-10'
            >
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className='relative overflow-hidden text-white text-sm font-semibold px-8 py-3.5 rounded-xl shadow-lg'
                style={{
                  background:
                    'linear-gradient(135deg, #207D40 0%, #165c2e 100%)',
                  fontFamily: '"DM Sans", sans-serif',
                  boxShadow: '0 10px 30px rgba(32, 125, 64, 0.30)'
                }}
              >
                <span className='relative z-10'>Get Started</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                onClick={() => navigate('/contact')}
                className='flex items-center gap-2.5 bg-white border border-[#e2e8e2] text-[#0d1f0d] text-sm font-semibold px-7 py-3.5 rounded-xl shadow-sm'
                style={{ fontFamily: '"DM Sans", sans-serif' }}
              >
                <span
                  className='flex items-center justify-center w-6 h-6 rounded-full'
                  style={{ background: '#207D40' }}
                >
                  <Play size={9} fill='white' color='white' />
                </span>
                Book a Demo
              </motion.button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial='hidden'
              animate='visible'
              custom={4}
              className='flex items-center gap-6'
            >
              <div className='flex items-center gap-1.5'></div>
              <div className='w-px h-4 bg-[#d4e8d4]' />
              <div className='flex items-center gap-1.5'>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill='#F7A300' color='#F7A300' />
                ))}
                <span
                  className='text-[11px] font-semibold tracking-[0.12em] uppercase text-[#6b8a6b] ml-1'
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  4.9 / 5
                </span>
              </div>
              <div className='w-px h-4 bg-[#d4e8d4]' />
              <div className='flex items-center gap-1.5'>
                <Users size={13} className='text-[#207D40]' />
                <span
                  className='text-[11px] font-semibold tracking-[0.12em] uppercase text-[#6b8a6b]'
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  250+ Spas
                </span>
              </div>
            </motion.div>
          </div>

          {/* ─────────── RIGHT COLUMN ─────────── */}
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className='relative flex justify-center lg:justify-end'
            style={{ perspective: '1000px' }}
          >
            <div
              className='absolute inset-0 m-auto w-[85%] h-[85%] rounded-[2.5rem] opacity-40 blur-[60px]'
              style={{
                background: 'radial-gradient(circle, #A8C5A0, transparent 70%)'
              }}
            />

            <motion.div
              style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
              className='relative'
            >
              <div
                className='relative rounded-[2rem] overflow-visible'
                style={{
                  background:
                    'linear-gradient(145deg, rgba(255,255,255,0.85), rgba(245,252,245,0.7))',
                  backdropFilter: 'blur(16px)',
                  boxShadow:
                    '0 40px 80px rgba(13,31,13,0.10), 0 0 0 1px rgba(255,255,255,0.6) inset',
                  padding: '14px'
                }}
              >
                <div className='rounded-[1.6rem] overflow-hidden border border-white/60'>
                  <img
                    src='/images/Dashboard.png'
                    alt='Spa Dashboard Analytics'
                    className='w-[480px] lg:w-[560px] xl:w-[620px] h-auto block'
                  />
                </div>
                <div
                  className='absolute inset-0 rounded-[2rem] pointer-events-none'
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 50%)'
                  }}
                />
              </div>

              {/* Revenue Badge */}
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.75, duration: 0.5, ease: 'backOut' }}
                className='absolute -top-5 -left-8 bg-white rounded-2xl px-4 py-3 flex items-center gap-3'
                style={{
                  boxShadow:
                    '0 16px 48px rgba(13,31,13,0.12), 0 0 0 1px rgba(32,125,64,0.08)'
                }}
              >
                <div
                  className='w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0'
                  style={{
                    background: 'linear-gradient(135deg, #207D40, #165c2e)'
                  }}
                >
                  <TrendingUp size={16} />
                </div>
                <div>
                  <p
                    className='text-[10px] font-bold tracking-[0.14em] uppercase text-gray-400 mb-0.5'
                    style={{ fontFamily: '"DM Sans", sans-serif' }}
                  >
                    Revenue Growth
                  </p>
                  <p
                    className='text-xl font-bold text-[#207D40] leading-none'
                    style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                  >
                    +24.5%
                  </p>
                </div>
              </motion.div>

              {/* Bookings Badge */}
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.5, ease: 'backOut' }}
                className='absolute -bottom-5 -right-6 bg-white rounded-2xl px-4 py-3 flex items-center gap-3'
                style={{
                  boxShadow:
                    '0 16px 48px rgba(13,31,13,0.12), 0 0 0 1px rgba(247,163,0,0.08)'
                }}
              >
                <div className='flex -space-x-2'>
                  {['#A8C5A0', '#F7A300', '#207D40'].map((c, i) => (
                    <div
                      key={i}
                      className='w-8 h-8 rounded-full border-2 border-white flex-shrink-0'
                      style={{ background: c, zIndex: 3 - i }}
                    />
                  ))}
                </div>
                <div>
                  <p
                    className='text-sm font-bold text-[#0d1f0d] leading-none'
                    style={{ fontFamily: '"DM Sans", sans-serif' }}
                  >
                    5 New Bookings
                  </p>
                  <p
                    className='text-[11px] font-semibold mt-1'
                    style={{
                      color: '#207D40',
                      fontFamily: '"DM Sans", sans-serif'
                    }}
                  >
                    Just now
                  </p>
                </div>
              </motion.div>

              {/* Live Pulse */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.05, duration: 0.4, ease: 'backOut' }}
                className='absolute top-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur rounded-full px-3 py-1.5'
                style={{
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  fontFamily: '"DM Sans", sans-serif'
                }}
              >
                <span className='relative flex h-2 w-2'>
                  <span
                    className='animate-ping absolute inline-flex h-full w-full rounded-full opacity-75'
                    style={{ background: '#207D40' }}
                  />
                  <span
                    className='relative inline-flex rounded-full h-2 w-2'
                    style={{ background: '#207D40' }}
                  />
                </span>
                <span className='text-[10px] font-semibold text-[#0d1f0d] tracking-wide uppercase'>
                  Live
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom wave / section divider ── */}
      <div className='absolute bottom-0 left-0 right-0 pointer-events-none'>
        <svg
          viewBox='0 0 1440 60'
          xmlns='http://www.w3.org/2000/svg'
          className='w-full opacity-40'
        >
          <path
            d='M0 40 C360 0 1080 80 1440 20 L1440 60 L0 60 Z'
            fill='#D4EAD0'
          />
        </svg>
      </div>
    </section>
  )
}

export default Hero
