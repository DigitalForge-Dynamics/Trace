
![Trace - Transparent PNG](https://github.com/DigitalForge-Dynamics/Trace/assets/76014409/1a5c47be-8461-46b6-84cb-54e48f91ebfd)

## Database Development
To start development on the database, please configure the following ``` .env.docker.development ``` environment file with any credentials to configure the hosted Database.

Once this is done, you'll need to configure the API environment variables with the same credentials to allow it to connect to the database. You can find the structure below.


## API Environment Variables
These are the needed environment variables to run up the API service for trace.
```
## Database Credentials
API_DATABASE_NAME=""
API_DATABASE_USERNAME=""
API_DATABASE_PASSWORD=""
API_DATABASE_HOST=""

## Redis Credentials
API_REDIS_HOST=""
API_REDIS_PASSWORD=""

## Application Variables
API_PORT=
API_SEED_DATABASE="true" # Only to be set if in a trusted environment. Has security implications.
```

## API Integration Tests
The integration tests require to be using the same token signing key as the API is using to validate.
This can be achieved by setting the environment variable ```EXPRESS_SIGNING_SECRET``` to the same non-falsy value on both.
e.g.
```sh
EXPRESS_SIGNING_SECRET="trace" npm start
EXPRESS_SIGNING_SECRET="trace" npm run test:integration
```
