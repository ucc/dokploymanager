declare module 'dns-axfr' {
    interface AxfrRecord {
        name: string
        type: string
        ttl: number
        a?: string
        aaaa?: string
        cname?: string
        ns?: string
        mx?: string
        txt?: string
        soa?: any
        srv?: any
    }

    interface AxfrResponse {
        questions: Array<{
            name: string
            type: string
        }>
        answers: AxfrRecord[]
    }

    export function resolveAxfr(
        nameserver: string,
        zone: string,
        callback: (err: Error | null, response?: AxfrResponse) => void
    ): void

    export function resolveAxfrTimeout(timeout: number): void
}
