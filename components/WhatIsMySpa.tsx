import React from 'react'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
    }
  })
}

/**
 * Plain-language definition of the product, directly under the Hero. The
 * background is the Hero's bottom wave (#D4EAD0 at 40% over #FDFAF6), so the
 * two sections meet without a seam.
 */
const WhatIsMySpa: React.FC = () => (
  <section
    id='what-is-myspa'
    aria-labelledby='what-is-myspa-heading'
    className='relative py-20 lg:py-28 overflow-hidden'
    style={{ background: '#EDF4E7' }}
  >
    <div
      className='pointer-events-none absolute -top-24 right-0 w-[520px] h-[520px] rounded-full opacity-30'
      style={{
        background: 'radial-gradient(circle, #F9E4B0, transparent 65%)',
        filter: 'blur(70px)'
      }}
    />

    <div className='relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-x-20 lg:gap-y-10'>
      {/* Heading and definition */}
      <motion.div
        variants={fadeUp}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-60px' }}
        className='lg:col-start-1 lg:row-start-1'
      >
        <h2
          id='what-is-myspa-heading'
          className='text-4xl md:text-5xl lg:text-[3.2rem] font-bold leading-[1.1] tracking-[-0.025em] text-[#0d1f0d] mb-6'
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          What is{' '}
          <em
            className='not-italic'
            style={{
              background: 'linear-gradient(100deg, #2E8B35 10%, #F5A800 85%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            MySpa?
          </em>
        </h2>
        <p
          className='text-[#2f432f] text-[1.1rem] leading-[1.75]'
          style={{ fontFamily: '"DM Sans", sans-serif' }}
        >
          MySpa is spa and salon management software (a spa ERP) built for spas
          and salons in Kenya. It runs your whole spa or salon in one system:
          appointments, point of sale, client records, staff and payroll,
          inventory, accounting and gift vouchers.
        </p>
      </motion.div>

      {/* How it connects, and what owners get */}
      <motion.div
        variants={fadeUp}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-60px' }}
        custom={1}
        className='lg:col-start-2 lg:row-start-1 lg:row-span-2 rounded-[2rem] bg-white p-8 md:p-10'
        style={{
          boxShadow:
            '0 24px 60px rgba(13,31,13,0.08), 0 0 0 1px rgba(13,31,13,0.05)'
        }}
      >
        <p
          className='text-[#4b5563] text-base leading-[1.8]'
          style={{ fontFamily: '"DM Sans", sans-serif' }}
        >
          Most spas use a booking app, a POS, Excel and a separate accounting
          tool that don't talk to each other. MySpa connects them. When a
          treatment is booked, MySpa reserves the therapist and room, deducts
          the products used, calculates the therapist's commission and records
          the sale in your accounts.
        </p>
        <div
          className='my-7 h-px'
          style={{
            background:
              'linear-gradient(90deg, rgba(46,139,53,0.35), rgba(245,168,0,0.25) 55%, transparent)'
          }}
        />
        <p
          className='text-[#4b5563] text-base leading-[1.8]'
          style={{ fontFamily: '"DM Sans", sans-serif' }}
        >
          Owners see real-time revenue and profit for every service, therapist
          and branch, from anywhere. MySpa is cloud-based, priced in KES, and
          supported by a local team in Nairobi. Clients can pay by M-Pesa and
          debit card.
        </p>
      </motion.div>

      {/* Calls to action. Last in source order so they follow all the copy on
          small screens; on desktop they sit under the definition. */}
      <motion.div
        variants={fadeUp}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-60px' }}
        custom={2}
        className='lg:col-start-1 lg:row-start-2 lg:self-end flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-8'
      >
        <Link
          to='/contact'
          className='flex items-center justify-center gap-2 text-white text-base sm:text-sm font-semibold px-8 py-4 sm:py-3.5 rounded-xl transition-transform duration-300 hover:-translate-y-0.5'
          style={{
            background: 'linear-gradient(135deg, #207D40 0%, #165c2e 100%)',
            boxShadow: '0 10px 30px rgba(32, 125, 64, 0.30)',
            fontFamily: '"DM Sans", sans-serif'
          }}
        >
          Book a free demo
          <ArrowRight size={15} />
        </Link>
        <Link
          to='/resources/spa-erp-vs-booking-software'
          className='group inline-flex items-center justify-center sm:justify-start gap-2 text-[#207D40] hover:text-[#165c2e] text-base sm:text-sm font-semibold underline decoration-[#207D40]/30 underline-offset-4 hover:decoration-[#165c2e] transition-colors'
          style={{ fontFamily: '"DM Sans", sans-serif' }}
        >
          Spa ERP vs booking software
          <ArrowRight
            size={14}
            className='transition-transform duration-300 group-hover:translate-x-1'
          />
        </Link>
      </motion.div>
    </div>
  </section>
)

export default WhatIsMySpa
