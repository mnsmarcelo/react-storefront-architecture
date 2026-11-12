import Keycloak from 'keycloak-js';

export const keycloak = new Keycloak({
  url: 'http://127.0.0.1:8080',
  realm: 'workspace',
  clientId: 'frontend-shell',
});

let initialization: Promise<boolean> | undefined;

export function initializeKeycloak() {
  initialization ??= keycloak.init({
    onLoad: 'login-required',
    pkceMethod: 'S256',
  });
  return initialization;
}
