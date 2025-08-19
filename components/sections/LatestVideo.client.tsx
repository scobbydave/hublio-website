"use client"
import React, { useState } from 'react'

export default function LatestVideoClient({ videoId, channelUrl }: { videoId: string; channelUrl?: string }) {
  const [playing, setPlaying] = useState(false)
  const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
  const iframeSrc = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`

  return (
    <div className="latest-video max-w-4xl mx-auto my-12 px-4">
      {!playing ? (
        <div className="relative block w-full aspect-video bg-gray-900 overflow-hidden rounded-lg">
          <button
            onClick={() => setPlaying(true)}
            aria-label="Play latest Hublio video"
            className="absolute inset-0 w-full h-full focus:outline-none"
          >
            <img src={thumb} alt="Latest Hublio video" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/60 rounded-full p-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </button>
        </div>
      ) : (
        <div className="w-full aspect-video">
          <iframe
            src={iframeSrc}
            title="Hublio latest video"
            width="100%"
            height="100%"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg"
          />
        </div>
      )}

      <div className="mt-3 text-center text-sm text-muted-foreground">
        <a href={channelUrl || '#'} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
          Visit our YouTube channel
        </a>
      </div>
    </div>
  )
}
