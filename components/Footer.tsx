import React from 'react'
import { Phone, Mail, Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Footer: React.FC = () => {
  const navigate = useNavigate()

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
                <span>contact@dimetechgroup.com</span>
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
            <div className='flex gap-2'>
              <input
                type='email'
                placeholder='Email Address'
                className='bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-[#207D40] text-xs'
              />
              <button className='bg-[#207D40] hover:bg-[#1a6333] p-2 rounded-lg transition-colors'>
                <Send size={14} />
              </button>
            </div>
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
