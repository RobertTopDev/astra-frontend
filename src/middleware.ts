import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkip`)
    console.log("location from server: ", await response.json());
    if (response.status > 400)
      return new NextResponse('Access denided', { status: response.status })
  } catch (err) {
    return new NextResponse(`Server error`, { status: 500 })
  }

  return NextResponse.next()
}
