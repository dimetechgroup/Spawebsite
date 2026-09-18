import React, { useState } from 'react'
import { Phone, Mail, Send, CheckCircle, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { subscribeNewsletter } from '../api'
import { contactDetails } from '@/data'
import { footerRoutes } from '@/seo/routes'

const Footer: React.FC = () => {
  const [subName, setSubName] = useState('')
  const [subEmail, setSubEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [subStatus, setSubStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (honeypot) return // bot detected
    setSubStatus('sending')
    try {
      await subscribeNewsletter({ firstname: subName, email: subEmail })
      setSubStatus('success')
      setSubName('')
      setSubEmail('')
    } catch {
      setSubStatus('error')
      setTimeout(() => setSubStatus('idle'), 4000)
    }
  }

  return (
    <footer className='bg-[#111827] text-white pt-20 pb-10 border-t border-gray-800'>
      <div className='container mx-auto px-4 md:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16'>
          <div>
            <Link
              to='/'
              className='flex items-center gap-2 mb-6'
              aria-label='MySpa home'
            >
              <img
                src='/images/MYSPA.png'
                alt='MySpa, spa and salon management software'
                className='h-12 w-auto object-contain'
                width={877}
                height={297}
              />
            </Link>
            <p className='text-gray-400 text-sm mb-6 leading-relaxed'>
              Leading the wellness industry with cutting-edge management tools.
              Powered by{' '}
              <a
                href='https://dimetechgroup.com/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-300 hover:text-white underline underline-offset-2 transition-colors duration-200'
              >
                Dimetech Group Ltd
              </a>
              .
            </p>
          </div>

          <div>
            <h4 className='text-[11px] font-black uppercase tracking-widest mb-6 border-l-4 border-[#F7A300] pl-3'>
              Contact Us
            </h4>
            <ul className='space-y-4 text-gray-400 text-xs font-bold'>
              <li className='flex gap-3 items-center'>
                <Phone size={14} className='text-[#207D40]' />
                <span>{contactDetails.salesPhone}</span>
              </li>
              <li className='flex gap-3 items-center'>
                <Mail size={14} className='text-[#207D40]' />
                <span>{contactDetails.salesEmail}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='text-[11px] font-black uppercase tracking-widest mb-6 border-l-4 border-[#207D40] pl-3'>
              Explore
            </h4>
            <ul className='space-y-3 text-gray-400 text-xs font-bold'>
              {footerRoutes().map(route => (
                <li key={route.path}>
                  <Link
                    to={route.path}
                    className='hover:text-[#207D40] transition-colors text-left uppercase tracking-widest'
                  >
                    {route.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className='text-[11px] font-black uppercase tracking-widest mb-6 border-l-4 border-[#F7A300] pl-3'>
              Subscribe
            </h4>
            {subStatus === 'success' ? (
              <div className='flex items-center gap-2 text-[#207D40] text-xs font-bold'>
                <CheckCircle size={14} /> You're subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className='space-y-2'>
                {/* Honeypot: hidden from real users */}
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
                  className='bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-[#207D40] text-xs'
                />
                <div className='flex gap-2'>
                  <input
                    type='email'
                    placeholder='Email Address'
                    value={subEmail}
                    onChange={e => setSubEmail(e.target.value)}
                    required
                    className='bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-[#207D40] text-xs'
                  />
                  <button
                    type='submit'
                    disabled={subStatus === 'sending'}
                    className='bg-[#207D40] hover:bg-[#1a6333] disabled:opacity-50 p-2 rounded-lg transition-colors'
                  >
                    {subStatus === 'sending' ? (
                      <Loader2 size={14} className='animate-spin' />
                    ) : (
                      <Send size={14} />
                    )}
                  </button>
                </div>
                {subStatus === 'error' && (
                  <p className='text-red-400 text-[10px] font-bold'>Something went wrong. Try again.</p>
                )}
              </form>
            )}
          </div>
        </div>

        <div className='pt-10 border-t border-gray-800 text-center text-gray-500 text-[11px] font-black uppercase tracking-widest'>
          <p>
            copyright © {new Date().getFullYear()} MySpa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
