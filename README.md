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
```

Install deps and run:

```
pnpm install
pnpm run dev
```
