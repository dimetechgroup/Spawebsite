import React from 'react'
import type { DemoVideo } from '@/types'

const PLAYER_OPTIONS: Record<string, string> = {
  'player[autoplay]': 'true',
  'player[showLogo]': 'false'
}

const playerUrl = (url: string): string => {
  try {
    const u = new URL(url)
    for (const [key, value] of Object.entries(PLAYER_OPTIONS)) {
      if (!u.searchParams.has(key)) u.searchParams.set(key, value)
    }
    return u.toString()
  } catch {
    return url
  }
}

const DemoVideoEmbed: React.FC<{ video: DemoVideo }> = ({ video }) => (
  <iframe
    src={playerUrl(video.embedUrl)}
    title={video.poster.alt}
    className='w-full h-full border-0'
    allow='autoplay; fullscreen; encrypted-media; picture-in-picture'
    allowFullScreen
  />
)

export default DemoVideoEmbed
