import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Calendar, ArrowRight } from 'lucide-react'
import { articles, articleCategoryColors } from '@/data'

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const article = articles.find(a => a.slug === slug)

  if (!article) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4'>
        <p className='text-5xl font-black text-gray-100'>404</p>
        <h1 className='text-xl font-black text-[#111827]'>Article not found</h1>
        <button
          onClick={() => navigate('/resources')}
          className='flex items-center gap-2 bg-[#207D40] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1a6333] transition-all'
        >
          <ArrowLeft size={15} /> Back to Resources
        </button>
      </div>
    )
  }

  const tag =
    articleCategoryColors[article.category] ?? articleCategoryColors.ERP
  const otherArticles = articles.filter(a => a.slug !== slug).slice(0, 3)

  return (
    <div className="bg-white text-[#111827] font-['Inter']">
      <section className='relative pt-28 pb-0 overflow-hidden'>
        <div className='container mx-auto px-4 md:px-8 max-w-4xl'>
          {/* Back link */}
          <button
            onClick={() => navigate('/resources')}
            className='flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[#207D40] transition-colors mb-8'
          >
            <ArrowLeft size={13} /> Back to Resources
          </button>

          {/* Category + meta */}
          <div className='flex flex-wrap items-center gap-3 mb-6'>
            <span
              className='px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest'
              style={{ background: tag.bg, color: tag.color }}
            >
              {article.category}
            </span>
            <span className='flex items-center gap-1.5 text-[11px] font-bold text-gray-400'>
              <Clock size={11} className='text-[#207D40]' /> {article.readTime}
            </span>
            <span className='flex items-center gap-1.5 text-[11px] font-bold text-gray-400'>
              <Calendar size={11} className='text-[#F7A300]' /> {article.date}
            </span>
          </div>

          {/* Title */}
          <h1
            className='text-3xl md:text-4xl lg:text-5xl font-black text-[#111827] leading-[1.1] tracking-tighter mb-6'
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            {article.title}
          </h1>

          {/* Intro */}
          <p className='text-base text-gray-500 font-medium leading-relaxed mb-10 max-w-2xl'>
            {article.intro}
          </p>
        </div>

        {/* Hero image */}
        <div className='container mx-auto px-4 md:px-8 max-w-4xl'>
          <div className='rounded-[1.5rem] overflow-hidden shadow-xl aspect-[16/7]'>
            <img
              src={article.image}
              alt={article.title}
              className='w-full h-full object-cover block'
            />
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className='py-16'>
        <div className='container mx-auto px-4 md:px-8 max-w-3xl'>
          {article.sections.map((section, i) => (
            <div key={i} className='mb-10'>
              {section.heading && (
                <h2 className='text-xl font-black text-[#111827] tracking-tight mb-4 leading-snug'>
                  {section.heading}
                </h2>
              )}
              {section.body && (
                <p className='text-[15px] text-gray-500 leading-relaxed font-medium'>
                  {section.body}
                </p>
              )}
              {section.bullets && (
                <ul className='mt-3 space-y-3'>
                  {section.bullets.map((bullet, j) => (
                    <li key={j} className='flex items-start gap-3'>
                      <span
                        className='mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0'
                        style={{ background: '#207D40' }}
                      />
                      <span className='text-[15px] text-gray-500 leading-relaxed font-medium'>
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Divider */}
          <div className='border-t border-gray-100 my-12' />

          {/* CTA */}
          <div className='rounded-[1.5rem] bg-[#0d1f0d] p-10 text-center'>
            <p className='text-[11px] font-black uppercase tracking-[0.4em] text-[#4ade80] mb-4'>
              Ready to Transform Your Spa?
            </p>
            <h3
              className='text-2xl md:text-3xl font-black text-white tracking-tight mb-4 leading-tight'
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              See MySpa ERP in Action
            </h3>
            <p className='text-gray-400 text-sm font-medium mb-8 max-w-sm mx-auto leading-relaxed'>
              Book a personalised demo with our team and discover how MySpa fits
              your business.
            </p>
            <button
              onClick={() => navigate('/contact')}
              className='inline-flex items-center gap-2 bg-[#F7A300] hover:bg-orange-600 text-white px-8 py-3.5 rounded-xl font-black text-sm transition-all active:scale-95'
            >
              Book a Demo <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* More articles */}
      {otherArticles.length > 0 && (
        <section className='pb-20 bg-[#F8FAFC]/50'>
          <div className='container mx-auto px-4 md:px-8'>
            <h2 className='text-lg font-black tracking-tight text-[#111827] mb-8 border-l-4 border-[#207D40] pl-4'>
              More Insights
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {otherArticles.map(post => {
                const postTag =
                  articleCategoryColors[post.category] ??
                  articleCategoryColors.ERP
                return (
                  <div
                    key={post.slug}
                    onClick={() => navigate(`/resources/${post.slug}`)}
                    className='group bg-white rounded-[1.25rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col'
                  >
                    <div className='relative aspect-[16/9] overflow-hidden'>
                      <img
                        src={post.image}
                        alt={post.title}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 block'
                      />
                      <span
                        className='absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest'
                        style={{ background: postTag.bg, color: postTag.color }}
                      >
                        {post.category}
                      </span>
                    </div>
                    <div className='p-5 flex flex-col flex-grow'>
                      <div className='flex items-center gap-3 text-[11px] font-bold text-gray-400 mb-2'>
                        <span className='flex items-center gap-1'>
                          <Clock size={10} className='text-[#207D40]' />{' '}
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className='text-sm font-black text-[#111827] leading-snug group-hover:text-[#207D40] transition-colors line-clamp-2 mb-3'>
                        {post.title}
                      </h3>
                      <span className='mt-auto flex items-center gap-1 text-[11px] font-black text-[#207D40]'>
                        Read More{' '}
                        <ArrowRight
                          size={11}
                          className='group-hover:translate-x-1 transition-transform'
                        />
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default ArticlePage
