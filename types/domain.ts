export enum DomainSource {
    DOKPLOY = 'dokploy',
    DNS = 'dns'
}

export interface DomainWithSource {
    domain: string
    source: DomainSource
}
