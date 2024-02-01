
![Trace - Transparent PNG](https://github.com/DigitalForge-Dynamics/Trace/assets/76014409/1a5c47be-8461-46b6-84cb-54e48f91ebfd)

## Database Development
To start development on the database, please configure the following ``` .env.docker.development ``` environment file with appropriate credentials. 

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
```
