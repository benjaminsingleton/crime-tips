# TLS

Default production path terminates TLS in **Caddy** (`docker-compose.prod.yml` + `Caddyfile`). The Node app speaks HTTP only on the internal Compose network.

## Mode 1 — Public DNS + Let’s Encrypt (default)

1. Point DNS A/AAAA at the VM
2. Set `DOMAIN=tips.example.gov` and `PUBLIC_ORIGIN=https://tips.example.gov` in `.env`
3. Open host ports 80 and 443 **only after** DNS for `DOMAIN` is correct (premature ACME failures pollute Caddy logs and delay go-live)
4. `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d`

Caddy obtains and renews certificates automatically.

**Lab / no public DNS:** use `DOMAIN=localhost` (Caddy internal cert) or Mode 2/3 below. Do not expect Let’s Encrypt to succeed on a private hostname.

## Mode 2 — Internal CA / uploaded certificates

Mount agency certs into the proxy and adjust `Caddyfile`, for example:

```caddy
tips.example.gov {
	tls /certs/tls.crt /certs/tls.key
	encode gzip
	reverse_proxy app:3000
}
```

Add a volume such as `./certs:/certs:ro` on the `proxy` service.

## Mode 3 — Agency load balancer / existing reverse proxy

Omit public Caddy if TLS already terminates at an F5/nginx/WAF:

1. Run base Compose (or prod overlay without publishing proxy) so `app` listens on loopback only
2. Point the agency proxy at `http://127.0.0.1:8080`
3. Set `TRUST_PROXY=true` and `PUBLIC_ORIGIN` to the public HTTPS origin
4. Keep Postgres unpublished

Never expose the Node process as the public TLS terminator.
