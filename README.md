## TRACE

## Database Development

To start development on the database, please configure the following [.env.docker.development](./.env.docker.development) environment file with appropriate credentials.

Once this is done, you'll need to configure the API root environment file with the credentials to allow it to connect to the database. You can find the structure below.

## API Environment Variables

These are the needed environment variables to run up the API service for trace.

```
## Database Credentials
API_DATABASE_NAME=""
API_DATABASE_USERNAME=""
API_DATABASE_PASSWORD=""
API_DATABASE_HOST=""

## Application Variables
API_PORT=
API_URL=
```

## API OIDC Providers

The OIDC providers are defined within [oidc_providers.json](./api//oidc_providers.json) configuration file. Any custom providers are able to be put here, and used to request tokens.
