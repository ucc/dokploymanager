```
cd dokploymanager
nano .env.local
```

Fill out the env file:

```
KEYCLOAK_CLIENT_ID="client id"
KEYCLOAK_CLIENT_SECRET="client secret"
KEYCLOAK_ISSUER="https://<keycloak url>/realms/<realm>"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<random secret>"
DOKPLOY_URL="https://<dokploy server url>"
DOKPLOY_API_URL="https://<dokploy server url>/api/auth"
DOKPLOY_ORGANIZATION_ID="<organization id>"
DOKPLOY_SECRET="<dokploy api secret>"
DNS_NAMESERVER="monnik"  # Optional: DNS server hostname for zone transfers
DNS_ZONE="ucc.au"        # Optional: DNS zone to query
```

Install deps and run:

```
pnpm install
pnpm run dev
```
