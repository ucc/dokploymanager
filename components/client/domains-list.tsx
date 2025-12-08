"use client"

import { useState, useEffect } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import DomainItem from "./domain-item"
import { DomainWithSource } from "@/types/domain"

interface DomainsResponse {
    success: boolean
    domains?: DomainWithSource[]
    message?: string
}

export default function DomainsList() {
    const [domains, setDomains] = useState<DomainWithSource[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        async function fetchDomains() {
            try {
                const response = await fetch('/api/domains')
                const data: DomainsResponse = await response.json()

                if (!data.success) {
                    setError(data.message || 'Failed to fetch domains')
                    return
                }

                setDomains(data.domains || [])
            } catch (err) {
                setError('Network error. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchDomains()
    }, [])

    const filteredDomains = domains.filter(item =>
        item.domain.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Active Domains</CardTitle>
                <CardDescription>
                    These update every 5 minutes. If you don't see your domain, hold tight!
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <Input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    {loading && (
                        <p className="text-sm text-muted-foreground">Loading domains...</p>
                    )}

                    {error && (
                        <div className="text-sm p-3 rounded-md bg-red-50 text-red-700 border border-red-200">
                            {error}
                        </div>
                    )}

                    {!loading && !error && filteredDomains.length === 0 && searchQuery && (
                        <p className="text-sm text-muted-foreground">No domains match your search.</p>
                    )}

                    {!loading && !error && domains.length === 0 && !searchQuery && (
                        <p className="text-sm text-muted-foreground">No domains found.</p>
                    )}

                    {!loading && !error && filteredDomains.length > 0 && (
                        <div className="flex flex-col gap-2">
                            {filteredDomains.map((item) => (
                                <DomainItem key={item.domain} url={item.domain} source={item.source} />
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
