variable "KC_ADMIN_URL" {
  type        = string
  description = "URL for the Keycloak instance / Realm. If no realm is provided, provider defaults to master."
}
variable "KC_ADMIN_USERNAME" {
  type        = string
  description = "Username to use to authenticate to Keycloak to configure new realm."
}
variable "KC_ADMIN_PASSWORD" {
  type        = string
  description = "Password to use to authenticate to Keycloak to configure new realm."
  sensitive   = true
}
variable "KC_ROOT_CA_PATH" {
  type        = string
  description = "Optional path to Keycloak's certificate file for TLS."
}
