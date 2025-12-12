## KeyCloak

1. Configure Keycloak Instance using `docker-compose`.
1. Set values in `local/.env` file, to configure Terraform Provider to KeyCloak instance.
1. Run `terraform apply`,to create a local development realm.
1. Update values in `trace-api/.env`, `trace-playwright/.env`, `.env`.
