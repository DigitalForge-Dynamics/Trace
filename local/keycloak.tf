terraform {
  required_providers {
    keycloak = {
      source  = "keycloak/keycloak"
      version = "5.5.0"
    }
  }
}

provider "keycloak" {
  client_id           = "admin-cli"
  username            = var.KC_ADMIN_USERNAME
  password            = var.KC_ADMIN_PASSWORD
  url                 = var.KC_ADMIN_URL
  root_ca_certificate = fileexists(var.KC_ROOT_CA_PATH) ? file(var.KC_ROOT_CA_PATH) : null
}

resource "keycloak_realm" "realm" {
  realm = "trace-realm"
}

resource "keycloak_openid_client" "oidc" {
  realm_id              = keycloak_realm.realm.realm
  client_id             = "trace-client"
  access_type           = "PUBLIC"
  standard_flow_enabled = true
  valid_redirect_uris = [
    "https://localhost:5173/oidc-callback"
  ]
  web_origins = [
    "https://localhost:5173"
  ]
}

resource "keycloak_user" "user" {
  realm_id   = keycloak_realm.realm.realm
  username   = "trace-user"
  email      = "trace@example.com"
  first_name = "Trace"
  last_name  = "User"
  initial_password {
    value     = "trace-password"
    temporary = false
  }
}
