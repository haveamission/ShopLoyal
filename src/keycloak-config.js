import Keycloak from 'keycloak-js';

export const keycloak = Keycloak({
    "realm": "wantify",
    "auth-server-url": "https://id.v2.wantify.com/auth",
    "ssl-required": "external",
    "resource": "wantify-app",
    "public-client": true,
    "confidential-port": 0,
    "clientId": "wantify-app"
});