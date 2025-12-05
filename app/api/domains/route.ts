import { NextResponse } from 'next/server'

const DOKPLOY_URL = process.env.DOKPLOY_URL!
const DOKPLOY_SECRET = process.env.DOKPLOY_SECRET!

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes in milliseconds
let cachedDomains: string[] | null = null
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

        // Fetch fresh data
        const response = await fetch(`${DOKPLOY_URL}/api/project.all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': DOKPLOY_SECRET,
            },
        })

        if (!response.ok) {
            // If we have cached data and the API fails, return cached data with a warning
            if (cachedDomains) {
                return NextResponse.json({
                    success: true,
                    domains: cachedDomains,
                    cached: true,
                    warning: 'Using cached data due to API error'
                })
            }

            return NextResponse.json(
                { success: false, message: 'Failed to fetch domains from Dokploy' },
                { status: response.status }
            )
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

        const sortedDomains = allDomains.sort()

        // Update cache
        cachedDomains = sortedDomains
        cacheTimestamp = now

        return NextResponse.json({
            success: true,
            domains: sortedDomains,
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
