# Server-Side Deployment Security

This document records the **server-side / deployment-side** security controls that protect the live public portfolio at:

- `https://wpperez.com`
- `https://portfolio.wpperez.com`

It exists in this repo for documentation and reproducibility, even though the live controls themselves are enforced by the VPS reverse proxy and deployment setup rather than by the Next.js codebase alone.

---

## 1. Scope boundary

### In-repo application security
This repository contains the portfolio application code:

- Next.js static export build
- frontend assets and UI logic
- dependencies and client-side behavior

### Server-side deployment security
The following protections are currently enforced **outside** this repo at the serving layer on the VPS:

- HTTP security headers
- allowed HTTP methods
- public reverse-proxy behavior
- TLS / HTTPS serving behavior
- bind-mount strategy used to serve the exported `out/` directory safely

That means the application code and the deployment security are related, but they are **not the same layer**.

---

## 2. Live deployment model

The public portfolio is deployed as a **static export**.

### Build artifact
The portfolio build produces:

- `out/`

### Serving model
The live public site is served by **Caddy** on the VPS.

### Stable-parent mount rule
To avoid stale bind-mount failures after rebuilds, the live deployment should use this pattern:

- mount the stable project root into the container
- serve the static export from the `out/` subdirectory inside that mount

### Required invariant
Preferred live deployment pattern:

- host project path: `/srv/www/portfolio`
- container-visible project path: `/srv/portfolio`
- Caddy root for the public portfolio: `/srv/portfolio/out`

### Why this matters
Do **not** bind-mount `/srv/www/portfolio/out` directly if the build process may replace that directory.

If the generated `out/` directory inode is replaced during a rebuild, a running container can remain attached to a stale deleted mount target and the public site may return `404` even when the host has a valid fresh export.

Mounting the stable parent path avoids that failure mode.

---

## 3. Required public security headers

For the public portfolio route, the serving layer should enforce at least the following headers:

- `Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; connect-src 'self'; media-src 'self'; manifest-src 'self'; form-action 'none'`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), geolocation=(), microphone=()`
- `Strict-Transport-Security: max-age=31536000`

### Important CSP note
The current UI uses some inline React style attributes (`style={{ ... }}`) for visible behavior and layout.

Because of that, the portfolio currently requires:

- `style-src 'self' 'unsafe-inline'`

This is a conscious tradeoff to preserve the intended interface while still keeping script loading locked down with:

- `script-src 'self'`

If the UI is later refactored away from inline style attributes, the CSP should be tightened further by removing `'unsafe-inline'` from `style-src`.

---

## 4. Allowed HTTP methods

The public portfolio is a read-only static site.

The serving layer should therefore allow only:

- `GET`
- `HEAD`

All other methods should be rejected with:

- `405 Method Not Allowed`

This reduces unnecessary attack surface on the public route.

---

## 5. What this protects against

This deployment hardening helps reduce risk from:

- browser-side script injection blast radius
- clickjacking / framing attempts
- cross-origin abuse of public content
- accidental exposure of unnecessary HTTP method handling
- MIME sniffing issues
- some forms of server fingerprint leakage
- stale bind-mount breakage after rebuilds

---

## 6. What this does **not** fully solve

These controls do **not** eliminate all risk.

They do not fully solve:

- volumetric DDoS
- provider/network-layer floods
- DNS compromise
- TLS/private-key compromise
- VPS host compromise
- supply-chain compromise in dependencies or build tooling

For serious DDoS resistance, use an upstream CDN / proxy / WAF or provider-level mitigation layer.

---

## 7. Verification checklist

After deployment or security changes, verify all of the following:

### Repo/build layer
- repo is on the intended commit
- build succeeds
- `out/index.html` exists

### Serving layer
- container or host sees `/srv/portfolio/out/index.html`
- reverse-proxy configuration validates cleanly
- public domains return `200`

### Security layer
- live response headers contain the expected CSP and related hardening headers
- `POST` to the public route returns `405`
- the site still renders the intended UI correctly after any CSP change

---

## 8. Operational note

This file is documentation inside the portfolio repo.

It does **not by itself** configure the server.

If the VPS, reverse proxy, or deployment container is rebuilt elsewhere, the serving-layer configuration must still be applied in the actual deployment environment.
