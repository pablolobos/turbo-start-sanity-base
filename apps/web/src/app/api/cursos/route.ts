import { client } from '@/lib/sanity/client'
import { queryCursosData } from '@/lib/sanity/query'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const data = await client.fetch(queryCursosData)
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching cursos:', error)
        return NextResponse.json({ error: 'Error fetching cursos' }, { status: 500 })
    }
} 