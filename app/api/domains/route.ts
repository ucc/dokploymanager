import { NextResponse } from 'next/server'
import { DomainSource, DomainWithSource } from '@/types/domain'

const DOKPLOY_URL = process.env.DOKPLOY_URL!
const DOKPLOY_SECRET = process.env.DOKPLOY_SECRET!

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes in milliseconds

let cachedDomains: DomainWithSource[] | null = null
let cacheTimestamp: number | null = null

interface Domain {
    domainId: string
    host: string
    https: boolean
    port: number
    path: string
    certificateType: string
}

interface Application {
    applicationId: string
    name: string
    domains: Domain[]
}

interface Environment {
    environmentId: string
    name: string
    applications: Application[]
}

interface Project {
    projectId: string
    name: string
    environments: Environment[]
}

async function fetchDokployDomains(): Promise<string[]> {
    const response = await fetch(`${DOKPLOY_URL}/api/project.all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': DOKPLOY_SECRET,
        },
    })

    if (!response.ok) {
        throw new Error('Failed to fetch from Dokploy')
    }

    const projects: Project[] = await response.json()

    // Extract all domains from all projects
    const allDomains: string[] = []

    projects.forEach(project => {
        project.environments?.forEach(environment => {
            environment.applications?.forEach(application => {
                application.domains?.forEach(domain => {
                    if (domain.host && !allDomains.includes(domain.host)) {
                        allDomains.push(domain.host)
                    }
                })
            })
        })
    })

    return allDomains
}

async function fetchDNSDomains(): Promise<string[]> {
    try {
        const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/dns-domains`)

        if (!response.ok) {
            console.warn('DNS domains fetch failed, continuing without DNS data')
            return []
        }

        const data = await response.json()
        return data.success ? (data.domains || []) : []
    } catch (error) {
        console.warn('Error fetching DNS domains:', error)
        return []
    }
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

        // Fetch from both sources in parallel
        const [dokployDomains, dnsDomains] = await Promise.allSettled([
            fetchDokployDomains(),
            fetchDNSDomains()
        ])

        // Create a map to track domains and their sources
        const domainMap = new Map<string, DomainSource>()

        // Add Dokploy domains (these take priority)
        if (dokployDomains.status === 'fulfilled') {
            dokployDomains.value.forEach(domain => {
                domainMap.set(domain, DomainSource.DOKPLOY)
            })
        } else {
            console.error('Dokploy fetch failed:', dokployDomains.reason)
            // If we have cached data and Dokploy fails, return cached data
            if (cachedDomains) {
                return NextResponse.json({
                    success: true,
                    domains: cachedDomains,
                    cached: true,
                    warning: 'Using cached data due to Dokploy API error'
                })
            }
            throw dokployDomains.reason
        }

        // Add DNS domains (only if not already from Dokploy)
        if (dnsDomains.status === 'fulfilled') {
            dnsDomains.value.forEach(domain => {
                if (!domainMap.has(domain)) {
                    domainMap.set(domain, DomainSource.DNS)
                }
            })
        }

        // Convert map to array of objects and sort: Dokploy first, then DNS, alphabetically within each group
        const domainsWithSource: DomainWithSource[] = Array.from(domainMap.entries())
            .map(([domain, source]) => ({ domain, source }))
            .sort((a, b) => {
                // Dokploy domains come first
                if (a.source === DomainSource.DOKPLOY && b.source !== DomainSource.DOKPLOY) return -1
                if (a.source !== DomainSource.DOKPLOY && b.source === DomainSource.DOKPLOY) return 1
                // Within same source, sort alphabetically
                return a.domain.localeCompare(b.domain)
            })

        // Update cache
        cachedDomains = domainsWithSource
        cacheTimestamp = now

        return NextResponse.json({
            success: true,
            domains: domainsWithSource,
            cached: false
        })
    } catch (error) {
        console.error('Error fetching domains:', error)

        // If we have cached data and an error occurs, return cached data
        if (cachedDomains) {
            return NextResponse.json({
                success: true,
                domains: cachedDomains,
                cached: true,
                warning: 'Using cached data due to network error'
            })
        }

        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        )
    }
}
