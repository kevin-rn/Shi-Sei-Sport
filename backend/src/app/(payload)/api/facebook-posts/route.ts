import { NextResponse } from 'next/server'

const PAGE_ID = 'ShiSeiSport'
const FIELDS = 'id,message,story,created_time,full_picture,permalink_url'
const POST_LIMIT = 5

export async function GET() {
  const token = process.env.FACEBOOK_PAGE_TOKEN

  if (!token) {
    return NextResponse.json({ posts: [] }, { status: 200 })
  }

  try {
    const url = `https://graph.facebook.com/v22.0/${PAGE_ID}/posts?fields=${FIELDS}&limit=${POST_LIMIT}&access_token=${token}`
    const res = await fetch(url, { next: { revalidate: 600 } }) // cache 10 min

    if (!res.ok) {
      return NextResponse.json({ posts: [] }, { status: 200 })
    }

    const data = await res.json()

    if (data.error) {
      return NextResponse.json({ posts: [] }, { status: 200 })
    }

    return NextResponse.json({ posts: data.data ?? [] })
  } catch {
    return NextResponse.json({ posts: [] }, { status: 200 })
  }
}
