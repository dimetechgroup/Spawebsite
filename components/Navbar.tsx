import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Resources', path: '/resources' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'About Us', path: '/about' }
  ]

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault()
    navigate(path)
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
        <div
          className='flex items-center gap-2 cursor-pointer'
          onClick={() => navigate('/')}
        >
          <img
            src='/images/MYSPA.png'
            alt='MySpa Logo'
            className='h-12 w-auto object-contain'
          />
        </div>

        {/* Desktop Links */}
        <div className='hidden lg:flex items-center gap-6 text-xs font-black uppercase tracking-widest text-gray-600'>
          {navLinks.map(link => (
            <a
              key={link.path}
              href='#'
              onClick={e => handleLinkClick(link.path, e)}
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
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className='flex items-center gap-4'>
          <button onClick={() => navigate('/contact')} className='bg-[#207D40] hover:bg-[#1a6333] text-white px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-[#207D40]/20'>
            Book Demo
          </button>
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
            <a
              key={link.path}
              href='#'
              onClick={e => handleLinkClick(link.path, e)}
              className='text-sm font-black uppercase tracking-widest text-gray-800 hover:text-[#207D40]'
            >
              {link.name}
            </a>
          ))}
          <div className='pt-4 border-t border-gray-100'>
            <button className='text-left font-black uppercase tracking-widest text-[#F7A300]'>
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
