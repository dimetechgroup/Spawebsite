import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { featureGroups, featuresMarqueeItems as marqueeItems } from '../data'

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.13,
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
    }
  })
}

const Features: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section
      id='features'
      className='relative py-28 overflow-hidden'
      style={{ background: '#0d1f0d' }}
    >
      {/* ── Background ── */}
      <div className='pointer-events-none absolute inset-0'>
        <svg className='absolute inset-0 w-full h-full opacity-[0.03]'>
          <filter id='fnoise'>
            <feTurbulence
              type='fractalNoise'
              baseFrequency='0.65'
              numOctaves='3'
              stitchTiles='stitch'
            />
            <feColorMatrix type='saturate' values='0' />
          </filter>
          <rect width='100%' height='100%' filter='url(#fnoise)' />
        </svg>

        {/* Green glow */}
        <div
          className='absolute -top-40 left-1/4 w-[700px] h-[700px] rounded-full opacity-15'
          style={{
            background: 'radial-gradient(circle, #2E8B35, transparent 65%)',
            filter: 'blur(80px)'
          }}
        />

        {/* Top / bottom rules */}
        <div
          className='absolute top-0 left-0 right-0 h-px'
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(46,139,53,0.2) 40%, rgba(46,139,53,0.2) 60%, transparent)'
          }}
        />
        <div
          className='absolute bottom-0 left-0 right-0 h-px'
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(46,139,53,0.2) 40%, rgba(46,139,53,0.2) 60%, transparent)'
          }}
        />
      </div>

      <div className='relative max-w-7xl mx-auto px-6 lg:px-10'>
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
          }}
          className='text-center mb-20 max-w-2xl mx-auto'
        >
          <h2
            className='text-4xl md:text-5xl lg:text-[3.2rem] font-bold leading-[1.1] tracking-[-0.025em] text-white mb-5'
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Explore Our{' '}
            <em
              className='not-italic'
              style={{
                background: 'linear-gradient(100deg, #A8C5A0 10%, #F5A800 85%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Modules
            </em>
          </h2>
          <p
            className='text-gray-300 text-base leading-relaxed'
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            Built for the high-end salon. Scaled for the global spa franchise.
          </p>
        </motion.div>

        {/* ── Cards ── */}
        <div className='grid lg:grid-cols-3 gap-6 mb-16'>
          {featureGroups.map((group, gIdx) => (
            <motion.div
              key={gIdx}
              custom={gIdx}
              variants={cardVariants}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, margin: '-60px' }}
              onMouseEnter={() => setHovered(gIdx)}
              onMouseLeave={() => setHovered(null)}
              className='relative rounded-[2rem] overflow-hidden cursor-default'
              style={{
                background: group.featured
                  ? `linear-gradient(155deg, #1e3d23 0%, #122618 45%, #0b1c12 100%)`
                  : `linear-gradient(155deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)`,
                border:
                  hovered === gIdx
                    ? `1px solid ${group.accent}55`
                    : group.featured
                    ? `1px solid ${group.accent}35`
                    : '1px solid rgba(255,255,255,0.07)',
                boxShadow:
                  hovered === gIdx
                    ? `0 40px 80px rgba(0,0,0,0.55), 0 0 0 1px ${group.accent}18, inset 0 1px 0 rgba(255,255,255,0.09)`
                    : group.featured
                    ? `0 20px 48px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.07)`
                    : `0 8px 28px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04)`,
                transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                transform:
                  hovered === gIdx
                    ? 'translateY(-10px) scale(1.015)'
                    : 'translateY(0) scale(1)'
              }}
            >
              <div
                className='absolute top-0 left-0 right-0 h-px pointer-events-none transition-all duration-500'
                style={{
                  background:
                    hovered === gIdx
                      ? `linear-gradient(90deg, transparent 5%, ${group.accent}cc 40%, ${group.accentLight}aa 60%, transparent 95%)`
                      : `linear-gradient(90deg, transparent 15%, ${group.accent}55 50%, transparent 85%)`
                }}
              />

              {/* Corner glow (top-left) */}
              <div
                className='absolute inset-0 pointer-events-none'
                style={{
                  background: `radial-gradient(ellipse at 15% 0%, ${group.accent}22 0%, transparent 52%)`,
                  opacity: hovered === gIdx ? 1 : group.featured ? 0.75 : 0.45,
                  transition: 'opacity 0.5s ease'
                }}
              />

              {/* Bottom-right secondary glow on hover */}
              <div
                className='absolute inset-0 pointer-events-none'
                style={{
                  background: `radial-gradient(ellipse at 85% 100%, ${group.accent}12 0%, transparent 50%)`,
                  opacity: hovered === gIdx ? 1 : 0,
                  transition: 'opacity 0.5s ease'
                }}
              />

              {/* Watermark number */}
              <div
                className='absolute -top-6 -right-3 select-none pointer-events-none'
                style={{
                  fontSize: '10rem',
                  fontWeight: 900,
                  lineHeight: 1,
                  color: group.accent,
                  opacity: hovered === gIdx ? 0.055 : 0.03,
                  fontFamily: '"Poppins", sans-serif',
                  transition: 'opacity 0.5s ease'
                }}
              >
                {group.number}
              </div>

              <div className='relative z-10 p-9'>
                {/* Top row: category + number */}
                <div className='flex items-center justify-between mb-8'>
                  <span
                    className='inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] px-3 py-1.5 rounded-full'
                    style={{
                      background: `${group.accent}18`,
                      color: group.accentLight,
                      border: `1px solid ${group.accent}38`,
                      fontFamily: '"DM Sans", sans-serif'
                    }}
                  >
                    <span
                      className='w-1 h-1 rounded-full'
                      style={{
                        background: group.accent,
                        display: 'inline-block'
                      }}
                    />
                    {gIdx === 0
                      ? 'Finance'
                      : gIdx === 1
                      ? 'CX & Sales'
                      : 'Operations'}
                  </span>
                  <span
                    className='text-[11px] font-semibold tracking-[0.18em] uppercase'
                    style={{
                      color: `${group.accent}80`,
                      fontFamily: '"DM Sans", sans-serif'
                    }}
                  >
                    {group.number}
                  </span>
                </div>

                <div
                  className='w-[52px] h-[52px] rounded-2xl flex items-center justify-center mb-6'
                  style={{
                    background: `linear-gradient(135deg, ${group.accent}30 0%, ${group.accent}10 100%)`,
                    border: `1px solid ${group.accent}40`,
                    boxShadow:
                      hovered === gIdx
                        ? `0 10px 30px ${group.accent}30, inset 0 1px 0 ${group.accentLight}20`
                        : `0 4px 12px ${group.accent}15`,
                    transition: 'box-shadow 0.45s ease'
                  }}
                >
                  {React.createElement(group.items[0].icon, {
                    size: 22,
                    color: group.accentLight,
                    strokeWidth: 1.6
                  })}
                </div>

                <h3
                  className='text-[1.45rem] font-bold text-white mb-3 leading-[1.25]'
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  {group.title}
                </h3>

                <p
                  className='text-sm leading-relaxed mb-7'
                  style={{
                    color: 'rgba(200,220,200,0.92)',
                    fontFamily: '"DM Sans", sans-serif'
                  }}
                >
                  {group.description}
                </p>

                <div
                  className='mb-7 h-px'
                  style={{
                    background: `linear-gradient(90deg, ${group.accent}50, ${group.accent}10 55%, transparent 90%)`
                  }}
                />

                {/* Feature items — clean list */}
                <div className='flex flex-col gap-4'>
                  {group.items.map((item, idx) => (
                    <div
                      key={idx}
                      className='flex items-center gap-4 group/item'
                    >
                      <div
                        className='w-[34px] h-[34px] rounded-xl flex items-center justify-center flex-shrink-0'
                        style={{
                          background:
                            hovered === gIdx
                              ? `${group.accent}20`
                              : `${group.accent}0e`,
                          border: `1px solid ${group.accent}${
                            hovered === gIdx ? '38' : '20'
                          }`,
                          transition:
                            'background 0.4s ease, border-color 0.4s ease'
                        }}
                      >
                        <item.icon
                          size={14}
                          color={group.accentLight}
                          strokeWidth={1.8}
                        />
                      </div>

                      <div className='min-w-0 flex-1'>
                        <p
                          className='text-sm font-semibold text-white leading-none'
                          style={{ fontFamily: '"DM Sans", sans-serif' }}
                        >
                          {item.name}
                        </p>
                        <p
                          className='text-[11px] mt-1 leading-none'
                          style={{
                            color: 'rgba(200,220,200,0.85)',
                            fontFamily: '"DM Sans", sans-serif'
                          }}
                        >
                          {item.description}
                        </p>
                      </div>

                      {/* Accent dot on hover */}
                      <div
                        className='w-1.5 h-1.5 rounded-full flex-shrink-0'
                        style={{
                          background: group.accent,
                          opacity: hovered === gIdx ? 0.55 : 0,
                          transition: `opacity 0.35s ease ${idx * 0.06}s`
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Marquee strip ── */}
        <div
          className='relative rounded-2xl overflow-hidden py-5 px-6'
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)'
          }}
        >
          {/* Fade edges */}
          <div
            className='absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none'
            style={{
              background: 'linear-gradient(90deg, #0d1f0d, transparent)'
            }}
          />
          <div
            className='absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none'
            style={{
              background: 'linear-gradient(-90deg, #0d1f0d, transparent)'
            }}
          />

          <div className='flex gap-10 overflow-hidden'>
            <motion.div
              className='flex gap-10 flex-shrink-0'
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
            >
              {marqueeItems.map((item, i) => (
                <div key={i} className='flex items-center gap-3 flex-shrink-0'>
                  <div
                    className='w-1.5 h-1.5 rounded-full'
                    style={{ background: i % 2 === 0 ? '#2E8B35' : '#F5A800' }}
                  />
                  <span
                    className='text-[11px] font-bold uppercase tracking-[0.18em] whitespace-nowrap'
                    style={{
                      color: 'rgba(255,255,255,0.25)',
                      fontFamily: '"DM Sans", sans-serif'
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  )
}

export default Features
