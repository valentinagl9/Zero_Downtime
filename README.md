# Zero-Downtime Deployment Example

Student example for Blue/Green and Canary deployment strategies using Node.js, Docker, Nginx, Docker Compose, Render and GitHub Actions.

## Architecture

```text
Client
  |
  v
Nginx reverse proxy
  |------------------|
  v                  v
v1 (Blue)        v2 (Green/Canary)
```

The default Nginx configuration routes approximately 95% of traffic to `v1` and 5% to `v2`.

## Run locally

```bash
docker compose up --build
```

Open:

- Application: http://localhost:8080
- v1 directly: http://localhost:3001
- v2 directly: http://localhost:3002
- v1 health: http://localhost:3001/health
- v2 health: http://localhost:3002/health