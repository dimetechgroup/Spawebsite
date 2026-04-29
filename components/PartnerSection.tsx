import React, { useRef } from 'react'
import { TrendingUp, ShieldCheck, Gem, Sparkles } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { partners } from '@/data'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
    }
  }
}

const PartnerSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section
      ref={sectionRef}
      className='relative py-28 overflow-hidden'
      style={{ background: '#0d1f0d' }}
    >
      {/* ── Background texture & glows ── */}
      <div className='pointer-events-none absolute inset-0'>
        {/* Subtle noise grain */}
        <svg className='absolute inset-0 w-full h-full opacity-[0.035]'>
          <filter id='noise'>
            <feTurbulence
              type='fractalNoise'
              baseFrequency='0.65'
              numOctaves='3'
              stitchTiles='stitch'
            />
            <feColorMatrix type='saturate' values='0' />
          </filter>
          <rect width='100%' height='100%' filter='url(#noise)' />
        </svg>

        {/* Green glow left */}
        <div
          className='absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-20'
          style={{
            background: 'radial-gradient(circle, #2E8B35, transparent 65%)',
            filter: 'blur(60px)'
          }}
        />
        {/* Amber glow right */}
        <div
          className='absolute -bottom-20 right-0 w-[500px] h-[500px] rounded-full opacity-15'
          style={{
            background: 'radial-gradient(circle, #F5A800, transparent 65%)',
            filter: 'blur(80px)'
          }}
        />

        {/* Horizontal rule */}
        <div
          className='absolute top-0 left-0 right-0 h-px'
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.06) 60%, transparent)'
          }}
        />
        <div
          className='absolute bottom-0 left-0 right-0 h-px'
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.06) 60%, transparent)'
          }}
        />

        {/* Large serif watermark */}
        <div
          className='absolute right-[-2rem] top-1/2 -translate-y-1/2 select-none opacity-[0.025] text-white leading-none'
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 'clamp(140px, 20vw, 280px)',
            fontWeight: 900,
            letterSpacing: '-0.04em'
          }}
        >
          MY SPA
        </div>
      </div>

      <div className='relative max-w-screen-2xl mx-auto px-6 lg:px-16'>
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
          }}
          className='mb-20 max-w-4xl mx-auto'
        >

          {/* Headline */}
          <h2
            className='text-4xl md:text-5xl lg:text-[3.4rem] font-bold leading-[1.1] tracking-[-0.025em] text-white mb-6'
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            The Spa Software Partner <br />
            <em
              className='not-italic'
              style={{
                background: 'linear-gradient(100deg, #A8C5A0 10%, #F5A800 80%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              You've Been Looking For
            </em>
          </h2>

          <p
            className='text-gray-300 text-base leading-relaxed'
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            Elevate your spa to new heights with a partner that blends
            technological perfection with deep industry empathy.
          </p>
        </motion.div>

        {/* ── Cards grid ── */}
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate={isInView ? 'visible' : 'hidden'}
          className='grid lg:grid-cols-3 gap-5'
        >
          {partners.map(item => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                variants={cardVariants}
                whileHover={{
                  y: -6,
                  transition: { type: 'spring', stiffness: 220, damping: 20 }
                }}
                className='group relative rounded-3xl overflow-hidden flex flex-col'
                style={{
                  background: item.featured
                    ? 'linear-gradient(160deg, #1c3422 0%, #111e14 100%)'
                    : 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                  border: item.featured
                    ? `1px solid rgba(255,169,18,0.25)`
                    : '1px solid rgba(255,255,255,0.07)',
                  boxShadow: item.featured
                    ? `0 0 0 1px rgba(255,169,18,0.06), 0 32px 64px rgba(0,0,0,0.45)`
                    : '0 16px 48px rgba(0,0,0,0.3)'
                }}
              >
                {/* Top accent line */}
                <div
                  className='h-[2px] w-full flex-shrink-0'
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${item.accent} 40%, ${item.accent} 60%, transparent 100%)`
                  }}
                />

                {/* Icon area */}
                <div className='relative flex items-center justify-center pt-12 pb-10 overflow-hidden'>
                  {/* Glow behind icon */}
                  <div
                    className='absolute w-36 h-36 rounded-full pointer-events-none'
                    style={{
                      background: `radial-gradient(circle, ${item.accent}30, transparent 70%)`,
                      filter: 'blur(20px)'
                    }}
                  />
                  {/* Icon ring */}
                  <div
                    className='relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110'
                    style={{
                      background: `radial-gradient(circle, ${item.accent}22, ${item.accent}08)`,
                      border: `1.5px solid ${item.accent}45`,
                      boxShadow: `0 0 32px ${item.accent}25`
                    }}
                  >
                    <Icon size={30} color={item.accent} strokeWidth={1.6} />
                  </div>
                </div>

                {/* Divider */}
                <div className='mx-8 h-px bg-white/[0.06]' />

                {/* Content */}
                <div className='p-8 pt-6 flex flex-col flex-1'>
                  <span
                    className='text-[9px] font-black uppercase tracking-[0.28em] mb-3 block'
                    style={{ color: item.accent }}
                  >
                    {item.tag}
                  </span>
                  <h3
                    className='text-xl font-bold text-white mb-3 leading-tight tracking-tight'
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className='text-gray-300 text-sm leading-relaxed'
                    style={{ fontFamily: '"DM Sans", sans-serif' }}
                  >
                    {item.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default PartnerSection
