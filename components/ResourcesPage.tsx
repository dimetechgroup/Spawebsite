import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Clock,
  ShieldCheck,
  TrendingUp,
  Calendar,
  Mail,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { blogPosts, blogCategories } from '@/data'

const HS_PORTAL = '148419234'
const HS_FORM = '976c43ef-def8-4e2c-9903-5915a936f952'

const ResourcesPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('All')
  const [subName, setSubName] = useState('')
  const [subEmail, setSubEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [subStatus, setSubStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (honeypot) return // bot detected
    setSubStatus('sending')
    try {
      const res = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${HS_PORTAL}/${HS_FORM}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer REDACTED'
          },
          body: JSON.stringify({
            fields: [
              { name: 'firstname', value: subName },
              { name: 'email', value: subEmail }
            ]
          })
        }
      )
      if (!res.ok) throw new Error('submit failed')
      setSubStatus('success')
      setSubName('')
      setSubEmail('')
    } catch {
      setSubStatus('error')
      setTimeout(() => setSubStatus('idle'), 4000)
    }
  }

  const filteredPosts =
    activeCategory === 'All'
      ? blogPosts
      : blogPosts.filter(post => post.category === activeCategory)

  return (
    <div className="bg-white text-[#111827] font-['Inter'] selection:bg-[#207D40] selection:text-white">
      {/* HERO SECTION */}
      <section className='relative pt-32 pb-10 lg:pt-48 lg:pb-12 overflow-hidden border-b border-gray-50'>
        <div className='absolute top-0 right-0 w-1/3 h-full bg-[#F8FAFC] pointer-events-none skew-x-[-6deg] translate-x-12'></div>

        <div className='container mx-auto px-4 md:px-8 text-center relative z-10'>
          <div className='max-w-4xl mx-auto'>
            <div className='flex items-center justify-center gap-3 mb-6'>
              <span className='h-px w-8 bg-[#207D40]/30'></span>
              <span className='text-[11px] font-black uppercase tracking-[0.4em] text-[#207D40]'>
                Knowledge Hub
              </span>
              <span className='h-px w-8 bg-[#207D40]/30'></span>
            </div>

            <h1
              className='text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] text-[#111827] mb-8'
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Insights to Help You <br />
              <span className='text-[#207D40]'>Grow & Manage</span> <br />
              Your Spa Better.
            </h1>

            <p className='text-sm md:text-base text-gray-500 font-medium max-w-xl mx-auto leading-relaxed mb-10'>
              Our resources are designed to help spa owners make informed
              decisions, improve operations, and grow sustainably.
            </p>

            <button
              onClick={() => document.getElementById('subscription-area')?.scrollIntoView({ behavior: 'smooth' })}
              className='bg-[#F7A300] text-white px-8 py-3.5 rounded-xl font-black text-xs hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/10 active:scale-95'
            >
              Subscribe for Spa Growth Insights
            </button>
          </div>
        </div>
      </section>

      {/* ARTICLES GRID */}
      <section className='py-20 bg-[#F8FAFC]/50'>
        <div className='container mx-auto px-4 md:px-8'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-6 mb-12'>
            <h2 className='text-2xl md:text-3xl font-black tracking-tight border-l-4 border-[#207D40] pl-5'>
              Featured Insights
            </h2>
            <div className='flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-xl border border-gray-100 shadow-sm'>
              {blogCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-black transition-all ${
                    activeCategory === cat
                      ? 'bg-[#111827] text-white shadow-md'
                      : 'text-gray-400 hover:text-gray-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredPosts.map(post => (
              <div
                key={post.id}
                className='group bg-white rounded-[1.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col'
              >
                <div className='relative aspect-[16/10] overflow-hidden'>
                  <img
                    src={post.image}
                    alt={post.title}
                    className='w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 block'
                  />
                  <div className='absolute top-4 left-4'>
                    <span className='bg-[#207D40] text-white px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest'>
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className='p-6 flex flex-col flex-grow'>
                  <div className='flex items-center gap-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3'>
                    <span className='flex items-center gap-1'>
                      <Clock size={10} className='text-[#207D40]' />{' '}
                      {post.readTime}
                    </span>
                    <span className='flex items-center gap-1'>
                      <Calendar size={10} className='text-[#F7A300]' />{' '}
                      {post.date}
                    </span>
                  </div>
                  <h3 className='text-base font-black text-[#111827] mb-3 leading-tight group-hover:text-[#207D40] transition-colors line-clamp-2'>
                    {post.title}
                  </h3>
                  <p className='text-gray-400 text-[12px] leading-relaxed mb-6 flex-grow line-clamp-2'>
                    {post.preview}
                  </p>
                  <button
                    onClick={() => navigate(`/resources/${post.slug}`)}
                    className='flex items-center gap-1.5 text-[11px] font-black text-[#207D40] group/btn w-fit'
                  >
                    Read More{' '}
                    <ArrowRight
                      size={12}
                      className='group-hover/btn:translate-x-1 transition-transform'
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='py-20 bg-white overflow-hidden'>
        <div className='container mx-auto px-4 md:px-8'>
          <div className='flex flex-col lg:flex-row items-center gap-16'>
            <div className='lg:w-1/2'>
              <div className='flex items-center gap-3 mb-6'>
                <span className='h-[2px] w-6 bg-[#F7A300]'></span>
                <span className='text-[11px] font-black uppercase tracking-[0.4em] text-[#F7A300]'>
                  Educational Foundation
                </span>
              </div>
              <h2
                className='text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter leading-tight text-[#111827] mb-8'
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Why Spa Owners <br /> Trust Our Insights.
              </h2>
              <p className='text-sm text-gray-400 font-medium leading-relaxed mb-10'>
                Our content is built on real ERP implementation experience
                across Africa. Every guide reflects practical systems designed
                to increase revenue and support growth.
              </p>
            </div>

            <div className='lg:w-1/2 relative'>
              <div className='relative rounded-[2rem] overflow-hidden shadow-xl'>
                <img
                  src='/images/spa.jpeg'
                  alt='MySpa Insights Tablet'
                  className='w-full h-auto block'
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STAY AHEAD SUBSCRIPTION SECTION */}
      <section id='subscription-area' className='relative py-24 overflow-hidden'>
        {/* Section-wide Background Image */}
        <div className='absolute inset-0 z-0'>
          <img
            src='https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=2070&auto=format&fit=crop'
            className='w-full h-full object-cover opacity-[0.03] scale-110 grayscale block'
            alt='Soft Background Pattern'
          />
        </div>

        <div className='container mx-auto px-4 md:px-8 relative z-10'>
          <div className='relative rounded-[3rem] overflow-hidden min-h-[450px] flex items-center justify-center shadow-2xl border border-gray-100'>
            {/* Card Internal Background Image */}
            <img
              src='/images/ESPA-Innovation-2022.png'
              className='absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-[2000ms] block'
              alt='Massage Background'
            />
            {/* Elegant Brand Overlay */}
            <div className='absolute inset-0 bg-gradient-to-br from-[#111827]/95 via-[#111827]/80 to-[#207D40]/40 backdrop-blur-[3px]'></div>

            <div className='relative z-10 text-center max-w-xl px-6 py-12'>
              <div className='w-12 h-12 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl flex items-center justify-center text-[#F7A300] mx-auto mb-8 shadow-xl'>
                <Mail size={22} className='animate-bounce-slow' />
              </div>

              <h2 className='text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tighter mb-6 leading-tight'>
                Stay Ahead in the <br />
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#F7A300] to-orange-300'>
                  Spa Industry.
                </span>
              </h2>

              <p className='text-gray-300 text-sm font-medium mb-10 leading-relaxed opacity-90'>
                Get expert insights, ERP best practices, and operational
                strategies delivered to your salon every month.
              </p>

              <div className='flex flex-col w-full mb-10'>
                {subStatus === 'success' ? (
                  <div className='flex items-center justify-center gap-2 text-white bg-white/10 backdrop-blur-sm py-4 rounded-2xl border border-[#207D40]/30 shadow-2xl'>
                    <CheckCircle size={20} className='text-[#207D40]' /> <span className='font-bold text-sm'>You're subscribed!</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className='flex flex-col w-full gap-3'>
                    <div className='flex flex-col sm:flex-row gap-3'>
                      <input
                        type='text'
                        value={honeypot}
                        onChange={e => setHoneypot(e.target.value)}
                        tabIndex={-1}
                        autoComplete='off'
                        style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
                      />
                      <input
                        type='text'
                        placeholder='Your Name'
                        value={subName}
                        onChange={e => setSubName(e.target.value)}
                        required
                        className='flex-grow bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#F7A300]/50 shadow-2xl text-sm transition-all text-[#111827]'
                      />
                      <input
                        type='email'
                        placeholder='Professional email'
                        value={subEmail}
                        onChange={e => setSubEmail(e.target.value)}
                        required
                        className='flex-grow bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#F7A300]/50 shadow-2xl text-sm transition-all text-[#111827]'
                      />
                      <button
                        type='submit'
                        disabled={subStatus === 'sending'}
                        className='bg-[#F7A300] hover:bg-orange-600 disabled:opacity-50 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 whitespace-nowrap flex items-center justify-center'
                      >
                        {subStatus === 'sending' ? (
                          <Loader2 size={16} className='animate-spin' />
                        ) : (
                          'Subscribe'
                        )}
                      </button>
                    </div>
                    {subStatus === 'error' && (
                      <p className='text-red-400 text-[12px] font-bold text-center mt-2'>Something went wrong. Try again.</p>
                    )}
                  </form>
                )}
              </div>

              <div className='flex justify-center '>
                <button
                  className='text-[11px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-[#207D40] transition-colors border-b border-white/10 pb-1'
                  onClick={() => navigate('/contact')}
                >
                  Book a Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: inline-flex; animation: marquee 30s linear infinite; }
        .font-serif { font-family: 'Times New Roman', serif; }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default ResourcesPage
