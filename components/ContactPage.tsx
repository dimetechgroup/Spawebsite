import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Globe,
  MessageSquare,
  ArrowRight,
  ShieldCheck
} from 'lucide-react'

const ContactPage: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className='bg-white min-h-screen'>
      {/* HERO SECTION */};
      <section className='relative pt-28 pb-10 lg:pt-36 lg:pb-14 overflow-hidden'>
        <div className='absolute inset-0 z-0'>
          <div className='absolute top-0 right-0 w-1/3 h-full bg-[#F8FAFC] pointer-events-none skew-x-[-6deg] translate-x-12'></div>
        </div>

        <div className='container mx-auto px-4 md:px-8 relative z-10'>
          <div className='grid lg:grid-cols-2 gap-16 items-center'>
            {/* LEFT: Text */}
            <div>
              <div className='flex items-center gap-3 mb-6'>
                <span className='h-px w-10 bg-[#207D40]'></span>
                <span className='text-[11px] font-black uppercase tracking-[0.4em] text-[#207D40]'>
                  Concierge Services
                </span>
              </div>

              <h1
                className='text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] text-[#111827] mb-8'
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Get in Touch <br />
                <span className='text-[#F7A300]'>with</span>{' '}
                <span className='text-[#207D40]'>MySpa.</span>
              </h1>

              <p className='text-sm md:text-base text-gray-500 font-medium leading-relaxed max-w-xl'>
                Our experts are ready to help you navigate your digital
                transformation. Whether you need technical support or a bespoke
                enterprise consultation, we're here to help.
              </p>
            </div>

            {/* RIGHT: Image */}
            <div className='hidden lg:block relative'>
              {/* Decorative glow behind image */}
              <div className='absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-[#207D40]/10 to-[#F7A300]/10 blur-2xl scale-105 pointer-events-none' />

              <div className='relative rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl shadow-gray-200/60 aspect-[4/3]'>
                <img
                  src='/images/DSC06623.jpg'
                  alt='MySpa Support Team'
                  className='w-full h-full object-cover'
                />
                {/* Bottom fade overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent' />

                {/* Floating badge */}
                <div className='absolute bottom-6 left-6 flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg'>
                  <div className='w-8 h-8 rounded-xl bg-[#207D40] flex items-center justify-center flex-shrink-0'>
                    <ShieldCheck size={16} className='text-white' />
                  </div>
                  <div>
                    <p className='text-[11px] font-black text-[#111827] uppercase tracking-widest leading-none'>
                      Response Time
                    </p>
                    <p className='text-xs text-gray-500 font-medium mt-0.5'>
                      Under 2 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CONTACT GRID */}
      <section className='pb-16'>
        <div className='container mx-auto px-4 md:px-8'>
          <div className='grid lg:grid-cols-2 gap-16 items-start'>
            {/* LEFT: INFO CARDS */}
            <div className='space-y-8'>
              <div className='grid sm:grid-cols-2 gap-6'>
                <div className='p-8 rounded-[2rem] bg-[#F8FAFC] border border-gray-100 group hover:border-[#207D40]/20 transition-all'>
                  <div className='w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#207D40] mb-6'>
                    <Phone size={18} />
                  </div>
                  <h4 className='text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2'>
                    Call Sales
                  </h4>
                  <p className='text-sm font-black text-[#111827]'>
                    +254 708 178 500
                  </p>
                </div>
                <div className='p-8 rounded-[2rem] bg-[#F8FAFC] border border-gray-100 group hover:border-[#F7A300]/20 transition-all'>
                  <div className='w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#F7A300] mb-6'>
                    <Mail size={18} />
                  </div>
                  <h4 className='text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2'>
                    Email Us
                  </h4>
                  <p className='text-sm font-black text-[#111827] leading-none'>
                    contact@dimetechgroup.com
                  </p>
                </div>
              </div>

              <div className='p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl shadow-gray-100/50'>
                <div className='flex items-center gap-4 mb-8'>
                  <div className='w-12 h-12 rounded-2xl bg-[#111827] text-white flex items-center justify-center'>
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className='text-base font-black text-[#111827] tracking-tight'>
                      Headquarters
                    </h3>
                    <p className='text-[11px] text-gray-400 font-bold uppercase tracking-widest'>
                      Nairobi, Kenya
                    </p>
                  </div>
                </div>
                <div className='space-y-6'>
                  <div className='flex items-start gap-4'>
                    <div className='w-1.5 h-1.5 rounded-full bg-[#207D40] mt-1.5'></div>
                    <p className='text-xs text-gray-500 font-medium leading-relaxed'>
                      Karen Office Park,
                      <br />
                      Cedar block <br />
                      P.O Address - 25733 - 00502 Karen.
                    </p>
                  </div>

                  {/* Map embed */}
                  <div className='rounded-2xl overflow-hidden border border-gray-100 h-48'>
                    <iframe
                      title='Karen Office Park'
                      src='https://maps.google.com/maps?q=Karen+Office+Park,+Karen,+Nairobi,+Kenya&output=embed'
                      width='100%'
                      height='100%'
                      style={{ border: 0 }}
                      loading='lazy'
                      referrerPolicy='no-referrer-when-downgrade'
                    />
                  </div>

                  <div className='pt-4 border-t border-gray-50 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <ShieldCheck size={16} className='text-[#207D40]' />
                      <span className='text-[11px] font-black uppercase tracking-widest text-gray-400'>
                        Enterprise Ready
                      </span>
                    </div>
                    <a
                      href='https://www.google.com/maps/search/Karen+Office+Park,+Karen,+Nairobi,+Kenya'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-1.5 text-[11px] font-black text-[#207D40] hover:translate-x-1 transition-transform'
                    >
                      View on Map <ArrowRight size={12} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: CONTACT FORM */}
            <div className='bg-white p-10 lg:p-14 rounded-[3rem] border border-gray-100 shadow-2xl h-full flex flex-col'>
              <div className='mb-10'>
                <h3 className='text-lg font-black text-[#111827] mb-2 tracking-tight'>
                  Send a Message
                </h3>
                <p className='text-[11px] text-gray-400 font-bold uppercase tracking-widest'>
                  Typical response time: &lt; 2 hours
                </p>
              </div>

              <form className='space-y-6 flex flex-col flex-1'>
                <div className='grid sm:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <label className='text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1'>
                      Full Name
                    </label>
                    <input
                      type='text'
                      className='w-full bg-[#F8FAFC] border border-gray-100 rounded-xl px-5 py-3 focus:outline-none focus:border-[#207D40] transition-colors text-sm font-medium'
                      placeholder='Jane Doe'
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className='text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1'>
                      Email Address
                    </label>
                    <input
                      type='email'
                      className='w-full bg-[#F8FAFC] border border-gray-100 rounded-xl px-5 py-3 focus:outline-none focus:border-[#207D40] transition-colors text-sm font-medium'
                      placeholder='jane@spa.com'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <label className='text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1'>
                    Interested Tier
                  </label>
                  <select className='w-full bg-[#F8FAFC] border border-gray-100 rounded-xl px-5 py-3 focus:outline-none focus:border-[#207D40] transition-colors text-sm font-medium appearance-none'>
                    <option>Starter Plan</option>
                    <option>Growth Plan</option>
                    <option>Pro Plan</option>
                    <option>Enterprise Bespoke</option>
                  </select>
                </div>

                <div className='space-y-2 flex-1 flex flex-col'>
                  <label className='text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1'>
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className='flex-1 w-full bg-[#F8FAFC] border border-gray-100 rounded-xl px-5 py-3 focus:outline-none focus:border-[#207D40] transition-colors text-sm font-medium resize-none'
                    placeholder='Tell us about your brand vision...'
                  />
                </div>
                <button className='w-full bg-[#111827] hover:bg-[#207D40] text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 group active:scale-[0.98] shadow-xl'>
                  Send Inquiry{' '}
                  <Send
                    size={14}
                    className='group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform'
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      {/* FINAL FAQ REDIRECT */}
      <section className='py-14 bg-gray-50/50'>
        <div className='container mx-auto px-4 md:px-8 text-center'>
          <div className='max-w-xl mx-auto'>
            <button
              onClick={() => navigate('/faq')}
              className='text-[#207D40] font-black uppercase tracking-widest text-[11px] border-b-2 border-[#207D40] pb-1 hover:text-[#1a6333] transition-colors'
            >
              Go to FAQ Center
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
