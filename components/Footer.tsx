import React, { useState, useEffect } from 'react'
import { Phone, Mail, Send, CheckCircle, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { fetchConfig } from '../api'

const HS_PORTAL = '148419234'
const HS_FORM = '976c43ef-def8-4e2c-9903-5915a936f952'

const Footer: React.FC = () => {
  const navigate = useNavigate()
  const [subName, setSubName] = useState('')
  const [subEmail, setSubEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [subStatus, setSubStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [contactEmail, setContactEmail] = useState('contact@dimetechgroup.com')

  useEffect(() => {
    fetchConfig()
      .then(data => {
        if (data?.contact_email) {
          setContactEmail(data.contact_email)
        }
      })
      .catch(err => console.error(err))
  }, [])

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

  const handleNav = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className='bg-[#111827] text-white pt-20 pb-10 border-t border-gray-800'>
      <div className='container mx-auto px-4 md:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16'>
          <div>
            <div
              className='flex items-center gap-2 mb-6 cursor-pointer'
              onClick={() => handleNav('/')}
            >
              <img
                src='/images/MYSPA.png'
                alt='MySpa Logo'
                className='h-12 w-auto object-contain'
              />
              <span className='text-2xl font-bold'></span>
            </div>
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
                <span>+254 708 178 500</span>
              </li>
              <li className='flex gap-3 items-center'>
                <Mail size={14} className='text-[#207D40]' />
                <span>{contactEmail}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='text-[11px] font-black uppercase tracking-widest mb-6 border-l-4 border-[#207D40] pl-3'>
              Explore
            </h4>
            <ul className='space-y-3 text-gray-400 text-xs font-bold'>
              {[
                { label: 'Home', path: '/' },
                { label: 'Features', path: '/features' },
                { label: 'Pricing', path: '/pricing' },
                { label: 'FAQ', path: '/faq' },
                { label: 'Contact', path: '/contact' }
              ].map(item => (
                <li key={item.path}>
                  <button
                    onClick={() => handleNav(item.path)}
                    className='hover:text-[#207D40] transition-colors text-left uppercase tracking-widest'
                  >
                    {item.label}
                  </button>
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
                {/* Honeypot — hidden from real users */}
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
          <p>copyright © 2024 MySpa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
