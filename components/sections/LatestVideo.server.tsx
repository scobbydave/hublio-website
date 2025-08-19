import React from 'react'
import LatestVideoClient from './LatestVideo.client'

// Attempt to extract a channel id or handle from the provided URL; fall back to fetching by channel url
function extractChannelIdOrHandle(url: string): string | null {
  if (!url) return null
  try {
    const u = new URL(url)
    const path = u.pathname.replace(/\/+$/g, '')
    // Examples:
    // /@hublioapp -> handle
    // /channel/UCxxxxx -> channel id
    const parts = path.split('/').filter(Boolean)
    if (parts.length === 0) return null

    if (parts[0] === 'channel' && parts[1]) return parts[1]
    if (parts[0].startsWith('@')) return parts[0] // handle
    // Otherwise maybe username
    return parts[parts.length - 1]
  } catch (e) {
    return null
  }
}

async function fetchLatestVideoIdFromFeed(channelIdOrHandle: string): Promise<string | null> {
  if (!channelIdOrHandle) return null

  // If it looks like a channel id (starts with UC), use it directly
  let feedUrl = ''
  if (channelIdOrHandle.startsWith('UC')) {
    feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelIdOrHandle}`
  } else if (channelIdOrHandle.startsWith('@')) {
    // Some channels support feeds by handle via the legacy username path; try both
    const handle = channelIdOrHandle.replace(/^@/, '')
    feedUrl = `https://www.youtube.com/feeds/videos.xml?user=${handle}`
  } else {
    // Try as channel id first, then as user
    feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelIdOrHandle}`
  }

  try {
    const res = await fetch(feedUrl, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    const text = await res.text()
    const m = text.match(/<yt:videoId>(.*?)<\/yt:videoId>/)
    return m?.[1] ?? null
  } catch (e) {
    console.error('Failed to fetch YouTube feed', e)
    return null
  }
}

export default async function LatestVideo({ channelUrl }: { channelUrl: string }) {
  try {
    const idOrHandle = extractChannelIdOrHandle(channelUrl)
    if (!idOrHandle) {
      // If the provided link is a direct video link, try to extract the v= param
      try {
        const u = new URL(channelUrl)
        const vid = u.searchParams.get('v')
        if (vid) return <LatestVideoClient videoId={vid} channelUrl={channelUrl} />
      } catch (e) {
        // ignore
      }

      // Fallback UI when we can't parse a channel or video id
      return (
        <div className="max-w-4xl mx-auto my-12 px-4">
          <div className="rounded-lg border bg-muted/30 p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Watch our videos on YouTube</h3>
            <p className="text-sm text-muted-foreground mb-4">Subscribe to our channel for product demos, tutorials and industry insights.</p>
            <a
              href={channelUrl || 'https://youtube.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-red-600 text-white rounded hover:opacity-90"
            >
              Visit our YouTube channel
            </a>
          </div>
        </div>
      )
    }

    const videoId = await fetchLatestVideoIdFromFeed(idOrHandle)
    if (!videoId) {
      // Fallback UI when feed doesn't return a video id
      return (
        <div className="max-w-4xl mx-auto my-12 px-4">
          <div className="rounded-lg border bg-muted/30 p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">No recent videos yet</h3>
            <p className="text-sm text-muted-foreground mb-4">We couldn't find a recent video. Visit our channel to browse all content.</p>
            <a
              href={channelUrl || 'https://youtube.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-red-600 text-white rounded hover:opacity-90"
            >
              Visit our YouTube channel
            </a>
          </div>
        </div>
      )
    }

    return <LatestVideoClient videoId={videoId} channelUrl={channelUrl} />
  } catch (e) {
    console.error('LatestVideo server error', e)
    return null
  }
}
