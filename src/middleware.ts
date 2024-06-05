import { NextRequest, NextFetchEvent, NextResponse } from 'next/server'

export async function middleware(request: NextRequest, _next: NextFetchEvent) {
  const res = NextResponse.next()
  const ip =
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.ip ||
    '127.0.0.1' // try {
  //   const response = await fetch('https://jsonip.com')
  //   const data = await response.json()
  //   ip = data.ip
  // } catch (error) {
  //   console.error('Error fetching IP from jsonip.com:', error)
  //   ip = 'Unknown'
  // }
  console.log('========== client IP address ============')
  console.log(ip)
  try {
    const serverResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/checkip?clientIp=${ip}`
    )
    if (serverResponse.status > 400) {
      return new NextResponse('Access Denied', { status: 403 })
    }
  } catch (error) {
    console.error('Error checking IP with server:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
  return res
}
