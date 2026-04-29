import React from 'react'
import { useNavigate } from 'react-router-dom'
import { values } from '@/data'

import {
  Target,
  ArrowRight,
  Building2,
  CheckCircle2,
  Globe,
  Settings
} from 'lucide-react'

const AboutPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-white text-[#111827] font-['Inter'] selection:bg-[#207D40] selection:text-white">
      {/* SECTION 1: HERO */}
      <section className='relative pt-24 pb-12 lg:pt-32 lg:pb-16 overflow-hidden'>
        <div className='absolute top-0 right-0 w-1/3 h-full bg-[#F8FAFC] pointer-events-none skew-x-[-6deg] translate-x-12'></div>

        <div className='container mx-auto px-4 md:px-8 relative z-10'>
          <div className='flex flex-col lg:flex-row gap-12 xl:gap-20'>
            <div className='lg:w-[55%]'>
              <div className='flex items-center gap-3 mb-6'>
                <span className='h-[2px] w-10 bg-[#207D40]'></span>
                <span className='text-[11px] font-black uppercase tracking-[0.5em] text-[#207D40]'>
                  Corporate Pedigree
                </span>
              </div>
              <h1
                className='text-4xl md:text-5xl lg:text-6xl font-black text-[#111827] leading-[1.1] tracking-tighter mb-8'
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                Built by ERP Experts. <br />
                <span className='text-[#207D40]'>Designed</span>{' '}
                <span className='text-[#F7A300]'>Specifically</span> <br />
                for Spas.
              </h1>
              <p className='text-sm md:text-base text-gray-500 font-medium max-w-lg leading-relaxed mb-10'>
                <a
                  href='https://dimetechgroup.com/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-green-700 font-semibold hover:underline'
                >
                  Dimetech Group
                </a>{' '}
                has over a decade of experience building industry-specific ERP
                solutions across Africa. After working closely with
                service-based businesses, we recognized that spas require more
                than appointment tools they require structured, scalable
                business systems.
              </p>

              <div className='flex flex-col sm:flex-row items-center gap-4'>
                <button
                  onClick={() => navigate('/contact')}
                  className='w-full sm:w-auto bg-[#F7A300] text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-[#F7A300]/10'
                >
                  Let’s Grow Together
                </button>
              </div>
            </div>

            <div className='lg:w-[45%] relative'>
              <div className='relative h-full'>
                <div className='relative rounded-[2rem] overflow-hidden shadow-xl'>
                  <img
                    src='/images/DSC06623.jpg'
                    alt='Modern Office Hallway'
                    className='w-full h-[450px] object-cover block'
                  />
                </div>
                {/* Floating Parent Company Card */}
                <div className='absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-50 max-w-xs hidden md:block z-20'>
                  <div className='flex items-center gap-3 mb-3'>
                    <div className='w-8 h-8 bg-[#207D40] rounded-lg flex items-center justify-center text-white'>
                      <Building2 size={16} />
                    </div>
                    <div>
                      <p className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
                        Parent Company
                      </p>
                      <p className='font-black text-[#111827] text-xs leading-tight'>
                        <a
                          href='https://dimetechgroup.com/'
                          target='_blank'
                          rel='noopener noreferrer'
                          className='hover:text-[#207D40] underline underline-offset-2 transition-colors duration-200'
                        >
                          Dimetech Group Ltd
                        </a>
                      </p>
                    </div>
                  </div>
                  <p className='text-[11px] text-gray-500 leading-relaxed font-medium'>
                    MySpa Management System was developed to solve real-world
                    spa operational challenges, combining global ERP standards
                    with dedicated local support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: STORY & EXPERTISE */}
      <section className='py-10 bg-white'>
        <div className='container mx-auto px-4 md:px-8'>
          <div className='flex flex-col lg:flex-row gap-12 items-start border-t border-gray-100 pt-10'>
            <div className='lg:w-1/2'>
              <h2
                className='text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter mb-8 leading-tight'
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Over a Decade of <br />
                ERP Excellence{' '}
                <span className='text-[#207D40]'>Across Africa</span>
              </h2>
            </div>

            <div className='lg:w-1/2 grid gap-8'>
              <div className='flex gap-4'>
                <div className='flex-shrink-0 w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-300'>
                  <Settings size={18} />
                </div>
                <div>
                  <h4 className='text-base font-black mb-1.5 tracking-tight'>
                    Industry-Specific Logic
                  </h4>
                  <p className='text-gray-500 text-[11px] leading-relaxed font-medium'>
                    Unlike generic SaaS tools, MySpa is built on specific
                    business logic that understands treatment rooms, therapist
                    commissions, and inventory shrinkage.
                  </p>
                </div>
              </div>
              <div className='flex gap-4'>
                <div className='flex-shrink-0 w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-300'>
                  <Target size={18} />
                </div>
                <div>
                  <h4 className='text-base font-black mb-1.5 tracking-tight'>
                    Built for Service Businesses
                  </h4>
                  <p className='text-gray-500 text-[11px] leading-relaxed font-medium'>
                    We specialize in the high-touch, high-transaction
                    environment of spas, ensuring your system handles peak-hour
                    pressure with zero lag.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: OUR VALUES */}
      <section className='py-10 bg-white'>
        <div className='container mx-auto px-4 md:px-8'>
          <div className='mb-8'>
            <h2 className='text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter mb-4 leading-tight'>
              Our Values
            </h2>
            <p className='text-sm text-gray-400 max-w-xl font-medium leading-relaxed'>
              An established ERP company doesn't just build code; we build
              pillars for your business. Our values are the foundation of our
              long-term reliability.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-px bg-gray-100 rounded-[2rem] overflow-hidden border border-gray-100'>
            {values.map((v, i) => (
              <div
                key={i}
                className={`${v.bgColor} p-8 flex flex-col items-start hover:bg-gray-50 transition-colors`}
              >
                <div className='w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 mb-6'>
                  <v.icon size={16} />
                </div>
                <h4 className='text-sm font-black mb-2 tracking-tight'>
                  {v.title}
                </h4>
                <p className='text-[11px] text-gray-400 font-medium leading-relaxed'>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: LOCAL SUPPORT */}
      <section className='py-10 bg-white'>
        <div className='container mx-auto px-4 md:px-8'>
          <div className='bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-xl flex flex-col lg:flex-row'>
            <div className='lg:w-2/5 min-h-[400px]'>
              <img
                src='/images/supportteam.jpeg'
                alt='Spa Treatment in Action'
                className='w-full h-full object-cover block'
              />
            </div>
            <div className='lg:w-3/5 p-10 lg:p-16'>
              <h3 className='text-2xl md:text-3xl lg:text-4xl font-black text-[#111827] tracking-tighter mb-6 leading-tight'>
                Dedicated Local <br />
                <span className='text-[#F7A300]'>Support in Kenya</span>
              </h3>
              <p className='text-sm text-gray-500 font-medium leading-relaxed mb-10'>
                We provide dedicated support from our Kenyan team, ensuring fast
                response times, local understanding, and hands-on assistance
                when needed.
              </p>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8'>
                {[
                  'Fast Response Times',
                  'Local Market Understanding',
                  'Hands-on Implementation',
                  '24/7 Priority Assistance'
                ].map((point, i) => (
                  <div key={i} className='flex items-center gap-2'>
                    <CheckCircle2 size={16} className='text-[#207D40]' />
                    <span className='text-[11px] font-bold text-[#111827]'>
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FINAL CTA */}
      <section className='relative py-20 overflow-hidden flex items-center justify-center'>
        <div className='absolute inset-0 z-0'>
          <img
            src='/images/cta.jpeg'
            className='w-full h-full object-cover'
            alt='Zen Spa Treatment'
          />
          <div className='absolute inset-0 bg-[#1e2b4d]/85 mix-blend-multiply'></div>
        </div>

        <div className='container mx-auto px-4 md:px-8 relative z-10 text-center text-white'>
          <p className='text-base md:text-lg text-gray-300 font-medium mb-10 max-w-xl mx-auto leading-relaxed'>
            Join the future of wellness management with global ERP standards.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <button
              onClick={() => navigate('/contact')}
              className='w-full sm:w-auto bg-[#F7A300] text-white px-8 py-3.5 rounded-xl font-black text-base hover:bg-orange-600 transition-all flex items-center justify-center gap-2 group'
            >
              Let's Grow Together
              <ArrowRight
                size={18}
                className='group-hover:translate-x-1 transition-transform'
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
