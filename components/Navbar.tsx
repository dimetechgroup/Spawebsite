import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { navRoutes } from '@/seo/routes'

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Derived from seo/routes.ts so the nav, sitemap and prerender list agree.
  const navLinks = navRoutes().map(route => ({
    name: route.navLabel as string,
    path: route.path
  }))

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen
          ? 'bg-white shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className='container mx-auto px-4 md:px-8 flex items-center justify-between'>
        {/* Logo */}
        <Link to='/' className='flex items-center gap-2' aria-label='MySpa home'>
          <img
            src='/images/MYSPA.png'
            alt='MySpa, spa and salon management software'
            className='h-12 w-auto object-contain'
            width={877}
            height={297}
          />
        </Link>

        {/* Desktop Links */}
        <div className='hidden lg:flex items-center gap-6 text-xs font-black uppercase tracking-widest text-gray-600'>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors relative group ${
                location.pathname === link.path
                  ? 'text-[#207D40]'
                  : 'hover:text-[#207D40]'
              }`}
            >
              {link.name}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-[#207D40] transition-all group-hover:w-full ${
                  location.pathname === link.path ? 'w-full' : 'w-0'
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className='flex items-center gap-4'>
          <a
            href='https://app.myspa.co.ke/login'
            rel='noopener'
            className='hidden lg:inline-block text-[11px] font-black uppercase tracking-widest text-[#F7A300] hover:text-[#d98c00] transition-colors'
          >
            Login
          </a>
          <a href='https://app.myspa.co.ke/register' rel='noopener' className='hidden lg:inline-block bg-[#207D40] hover:bg-[#1a6333] text-white px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-[#207D40]/20'>
            Sign Up
          </a>
          <button
            className='lg:hidden p-2 text-gray-600'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className='flex flex-col p-6 gap-6'>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className='text-sm font-black uppercase tracking-widest text-gray-800 hover:text-[#207D40]'
            >
              {link.name}
            </Link>
          ))}
          <div className='pt-4 border-t border-gray-100 flex flex-col gap-4'>
            <a
              href='https://app.myspa.co.ke/login'
              rel='noopener'
              className='text-left font-black uppercase tracking-widest text-[#F7A300]'
            >
              Login
            </a>
            <a
              href='https://app.myspa.co.ke/register'
              rel='noopener'
              className='bg-[#207D40] hover:bg-[#1a6333] text-white text-center px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-[#207D40]/20'
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
