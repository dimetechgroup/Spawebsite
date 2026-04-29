import React, { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { testimonials } from '../data'

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
    }
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
    }
  })
}

const Testimonials: React.FC = () => {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isPaused, setIsPaused] = useState(false)

  const next = useCallback(() => {
    setDirection(1)
    setCurrent(prev => (prev + 1) % testimonials.length)
  }, [])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent(prev => (prev - 1 + testimonials.length) % testimonials.length)
  }, [])

  const goTo = (idx: number) => {
    setDirection(idx > current ? 1 : -1)
    setCurrent(idx)
  }

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, isPaused])

  const t = testimonials[current]

  return (
    <section
      className='relative py-28 overflow-hidden'
      style={{ background: '#FDFAF6' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Background decorations ── */}
      <div className='pointer-events-none absolute inset-0'>
        {/* Dot grid */}
        <svg className='absolute inset-0 w-full h-full opacity-[0.045]'>
          <defs>
            <pattern
              id='tdots'
              x='0'
              y='0'
              width='28'
              height='28'
              patternUnits='userSpaceOnUse'
            >
              <circle cx='2' cy='2' r='1.4' fill='#1a2e1a' />
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#tdots)' />
        </svg>

        {/* Green glow top-left */}
        <div
          className='absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20'
          style={{
            background: 'radial-gradient(circle, #2E8B35, transparent 65%)',
            filter: 'blur(80px)'
          }}
        />
        {/* Amber glow bottom-right */}
        <div
          className='absolute -bottom-20 -right-20 w-[480px] h-[480px] rounded-full opacity-15'
          style={{
            background: 'radial-gradient(circle, #F5A800, transparent 65%)',
            filter: 'blur(80px)'
          }}
        />

        {/* Large quote watermark */}
        <div
          className='absolute right-12 top-1/2 -translate-y-1/2 select-none opacity-[0.03] text-[#0d1f0d] leading-none'
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 'clamp(200px, 28vw, 380px)',
            fontWeight: 900
          }}
        >
          "
        </div>
      </div>

      <div className='relative max-w-7xl mx-auto px-6 lg:px-10'>
        {/* ── Section header ── */}
        <div className='flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16'>
          <div className='max-w-xl'>
            <h2
              className='text-4xl md:text-5xl lg:text-[3.2rem] font-bold leading-[1.1] tracking-[-0.025em] text-[#0d1f0d]'
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Leading the{' '}
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
                Industry
              </em>{' '}
              Forward.
            </h2>
          </div>

          {/* Navigation controls */}
          <div className='flex items-center gap-4'>
            <button
              onClick={prev}
              className='w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-300 hover:scale-105'
              style={{
                borderColor: 'rgba(46,139,53,0.25)',
                background: 'white',
                color: '#2E8B35',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
              }}
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dot indicators */}
            <div className='flex items-center gap-2'>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className='transition-all duration-300 rounded-full'
                  style={{
                    width: i === current ? 24 : 8,
                    height: 8,
                    background:
                      i === current ? '#2E8B35' : 'rgba(46,139,53,0.2)'
                  }}
                />
              ))}
            </div>

            <button
              onClick={next}
              className='w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-300 hover:scale-105'
              style={{
                borderColor: 'rgba(46,139,53,0.25)',
                background: 'white',
                color: '#2E8B35',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ── Main carousel + side thumbnails ── */}
        <div className='grid lg:grid-cols-[1fr_280px] gap-6 items-start'>
          {/* Active testimonial card */}
          <div className='relative overflow-hidden rounded-[2rem]'>
            <AnimatePresence mode='wait' custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial='enter'
                animate='center'
                exit='exit'
                className='relative rounded-[2rem] overflow-hidden'
                style={{
                  background: 'linear-gradient(145deg, #2E8B35, #F5A800)',
                  boxShadow: '0 40px 80px black, 0 0 0 1px black'
                }}
              >
                {/* Top accent bar */}
                <div
                  className='absolute top-0 left-0 right-0 h-[2px]'
                  style={{
                    background:
                      'linear-gradient(90deg, #2E8B35, #F5A800, transparent)'
                  }}
                />

                <div className='p-8 md:p-12'>
                  {/* Quote icon */}
                  <div
                    className='w-10 h-10 rounded-xl flex items-center justify-center mb-8'
                    style={{
                      background: 'rgba(46,139,53,0.15)',
                      border: '1px solid rgba(46,139,53,0.2)'
                    }}
                  >
                    <Quote size={16} color='#2E8B35' />
                  </div>

                  {/* Stars */}
                  <div className='flex gap-1 mb-6'>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill='#F5A800' color='#F5A800' />
                    ))}
                  </div>

                  {/* Quote text */}
                  <p
                    className='text-xl md:text-2xl text-white font-medium leading-[1.6] mb-10 tracking-[-0.01em]'
                    style={{ fontFamily: '"Playfair Display", serif' }}
                  >
                    "{t.content}"
                  </p>

                  {/* Author row */}
                  <div className='flex items-center justify-between flex-wrap gap-6'>
                    <div className='flex items-center gap-4'>
                      <div className='relative'>
                        <div
                          className='absolute -inset-1 rounded-2xl opacity-40 blur-md'
                          style={{
                            background:
                              'linear-gradient(135deg, #2E8B35, #F5A800)'
                          }}
                        />
                        <img
                          src={t.img}
                          alt={t.name}
                          className='relative w-14 h-14 rounded-2xl object-cover'
                          style={{ border: '2px solid rgba(255,255,255,0.1)' }}
                        />
                      </div>
                      <div>
                        <p
                          className='text-white font-bold text-lg leading-tight'
                          style={{
                            fontFamily: '"Playfair Display", serif'
                          }}
                        >
                          {t.name}
                        </p>
                        <p
                          className='text-[11px] font-semibold uppercase tracking-[0.15em] mt-1'
                          style={{
                            color: '#2E8B35',
                            fontFamily: '"DM Sans", sans-serif'
                          }}
                        >
                          {t.role}
                        </p>
                        <p
                          className='text-[11px] mt-0.5'
                          style={{
                            color: 'rgba(255,255,255,0.3)',
                            fontFamily: '"DM Sans", sans-serif'
                          }}
                        >
                          {t.location}
                        </p>
                      </div>
                    </div>

                    {/* Stat badge */}
                  </div>
                </div>

                {/* Progress bar */}
                <div
                  className='absolute bottom-0 left-0 right-0 h-[3px]'
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  {!isPaused && (
                    <motion.div
                      key={`progress-${current}`}
                      className='h-full'
                      style={{
                        background: 'linear-gradient(90deg, #2E8B35, #F5A800)'
                      }}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 5, ease: 'linear' }}
                    />
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Side thumbnail stack */}
          <div className='hidden lg:flex flex-col gap-3'>
            {testimonials.map((item, i) => (
              <motion.button
                key={i}
                onClick={() => goTo(i)}
                whileHover={{ x: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className='relative w-full text-left rounded-2xl p-4 flex items-center gap-3 transition-all duration-300'
                style={{
                  background:
                    i === current
                      ? 'linear-gradient(135deg, #0d1f0d, #122216)'
                      : 'rgba(13,31,13,0.04)',
                  border:
                    i === current
                      ? '1px solid rgba(46,139,53,0.25)'
                      : '1px solid rgba(13,31,13,0.06)',
                  boxShadow:
                    i === current ? '0 8px 24px rgba(13,31,13,0.12)' : 'none'
                }}
              >
                {i === current && (
                  <div
                    className='absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] rounded-r-full'
                    style={{ background: '#2E8B35' }}
                  />
                )}
                <img
                  src={item.img}
                  alt={item.name}
                  className='w-10 h-10 rounded-xl object-cover flex-shrink-0'
                  style={{
                    filter: i === current ? 'none' : 'grayscale(60%)',
                    opacity: i === current ? 1 : 0.6
                  }}
                />
                <div className='min-w-0'>
                  <p
                    className='text-sm font-bold truncate leading-tight'
                    style={{
                      color: i === current ? '#ffffff' : '#3a4e3a',
                      fontFamily: '"DM Sans", sans-serif'
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    className='text-[10px] truncate mt-0.5'
                    style={{
                      color: i === current ? '#2E8B35' : '#7a9a7a',
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 600
                    }}
                  >
                    {item.stat.value} {item.stat.label}
                  </p>
                </div>
              </motion.button>
            ))}

            {/* Total count */}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
