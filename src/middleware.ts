import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  try {
    const ipInfo = await fetch('https://jsonip.com')
    const clientIp = (await ipInfo.json()).ip
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/checkip?clientIp=${clientIp}`
    )
    if (response.status > 400)
      return new NextResponse('Access denided', { status: response.status })
  } catch (err) {
    return new NextResponse(`Server error`, { status: 500 })
  }

  return NextResponse.next()
}
