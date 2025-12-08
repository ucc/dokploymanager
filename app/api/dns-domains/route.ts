import { NextResponse } from 'next/server'
import { resolveAxfr } from 'dns-axfr'

const DNS_NAMESERVER = process.env.DNS_NAMESERVER!
const DNS_ZONE = process.env.DNS_ZONE!

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes in milliseconds
let cachedDomains: string[] | null = null
let cacheTimestamp: number | null = null

async function performZoneTransfer(): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const domains: Set<string> = new Set()

        resolveAxfr(DNS_NAMESERVER, DNS_ZONE, (err, response) => {
            if (err) {
                reject(err)
                return
            }

            if (!response || !response.answers || response.answers.length === 0) {
                resolve([])
                return
            }

            response.answers.forEach((record: any) => {
                if (record.type === 'A' || record.type === 'AAAA' || record.type === 'CNAME') {
                    const domain = record.name.replace(/\.$/, '')
                    domains.add(domain)
                }
            })

            resolve(Array.from(domains))
        })
    })
}

export async function GET() {
    try {
        // Check if cache is valid
        const now = Date.now()
        if (cachedDomains && cacheTimestamp && (now - cacheTimestamp) < CACHE_TTL) {
            return NextResponse.json({
                success: true,
                domains: cachedDomains,
                cached: true
            })
        }

        // Perform DNS zone transfer
        const domains = await performZoneTransfer()
        const sortedDomains = domains.sort()

        // Update cache
        cachedDomains = sortedDomains
        cacheTimestamp = now

        return NextResponse.json({
            success: true,
            domains: sortedDomains,
            cached: false
        })
    } catch (error) {
        console.error('Error fetching DNS domains:', error)

        // If we have cached data and an error occurs, return cached data
        if (cachedDomains) {
            return NextResponse.json({
                success: true,
                domains: cachedDomains,
                cached: true,
                warning: 'Using cached data due to DNS error'
            })
        }

        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error'
            },
            { status: 500 }
        )
    }
}
