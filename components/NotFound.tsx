import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, House } from 'lucide-react'
import Seo from './Seo'
import { navRoutes } from '@/seo/routes'

/**
 * Real 404 page. Rendered for the '*' route and prerendered to dist/404.html,
 * which public/.htaccess serves via ErrorDocument so unknown URLs return a
 * genuine HTTP 404 instead of a soft-404 homepage.
 */
const NotFound: React.FC = () => (
  <div className='min-h-screen bg-[#FDFAF6] flex items-center'>
    <Seo path='/404' />

    <div className='container mx-auto px-4 md:px-8 py-32 max-w-3xl text-center'>
      <p className='text-[11px] font-black uppercase tracking-[0.4em] text-[#F7A300] mb-6'>
        Error 404
      </p>

      <h1
        className='text-4xl md:text-5xl lg:text-6xl font-bold text-[#0d1f0d] leading-[1.08] tracking-tight mb-6'
        style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
      >
        We couldn't find that page.
      </h1>

      <p className='text-base text-gray-500 leading-relaxed max-w-xl mx-auto mb-12'>
        The link may be out of date or the address mistyped. Everything below is
        still exactly where you left it.
      </p>

      <div className='flex flex-wrap items-center justify-center gap-3 mb-16'>
        <Link
          to='/'
          className='flex items-center gap-2 bg-[#207D40] hover:bg-[#1a6333] text-white px-7 py-3.5 rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-[#207D40]/20'
        >
          <House size={15} /> Back to Home
        </Link>
        <Link
          to='/contact'
          className='flex items-center gap-2 border border-gray-200 bg-white hover:border-[#207D40] text-[#0d1f0d] px-7 py-3.5 rounded-xl text-sm font-semibold transition-all'
        >
          Contact Support <ArrowRight size={15} />
        </Link>
      </div>

      <div className='border-t border-gray-200 pt-10'>
        <p className='text-[11px] font-black uppercase tracking-widest text-gray-400 mb-6'>
          Or jump to
        </p>
        <div className='flex flex-wrap items-center justify-center gap-x-8 gap-y-4'>
          {navRoutes()
            .filter(route => route.path !== '/')
            .map(route => (
              <Link
                key={route.path}
                to={route.path}
                className='text-xs font-black uppercase tracking-widest text-gray-600 hover:text-[#207D40] transition-colors'
              >
                {route.navLabel}
              </Link>
            ))}
        </div>
      </div>
    </div>
  </div>
)

export default NotFound
