import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   const response = {
    message: '라라랄',
    data: 'dadadada'
   }

   return NextResponse.json(response, { status: 200 })
}