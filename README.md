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

## Exercise 1 - Canary rollout

Edit `nginx/nginx.conf` and change the weights.

### 95/5

```nginx
upstream app_backend {
  server v1:3001 weight=95;
  server v2:3002 weight=5;
}
```

Results for 20 requests: Blue 19 + Green/Canary 1

```console
Hello from v1 (Blue)! Requests: 136
Hello from v1 (Blue)! Requests: 137
Hello from v1 (Blue)! Requests: 138
Hello from v1 (Blue)! Requests: 139
Hello from v1 (Blue)! Requests: 140
Hello from v1 (Blue)! Requests: 141
Hello from v1 (Blue)! Requests: 142
Hello from v1 (Blue)! Requests: 143
Hello from v1 (Blue)! Requests: 144
Hello from v2 (Green/Canary)! Requests: 9
Hello from v1 (Blue)! Requests: 145
Hello from v1 (Blue)! Requests: 146
Hello from v1 (Blue)! Requests: 147
Hello from v1 (Blue)! Requests: 148
Hello from v1 (Blue)! Requests: 149
Hello from v1 (Blue)! Requests: 150
Hello from v1 (Blue)! Requests: 151
Hello from v1 (Blue)! Requests: 152
Hello from v1 (Blue)! Requests: 153
Hello from v1 (Blue)! Requests: 154
```

### 80/20

```nginx
upstream app_backend {
  server v1:3001 weight=80;
  server v2:3002 weight=20;
}
```

Results for 20 requests: Blue 16 + Green/Canary 4

```console
Hello from v1 (Blue)! Requests: 155
Hello from v1 (Blue)! Requests: 156
Hello from v2 (Green/Canary)! Requests: 10
Hello from v1 (Blue)! Requests: 157
Hello from v1 (Blue)! Requests: 158
Hello from v1 (Blue)! Requests: 159
Hello from v1 (Blue)! Requests: 160
Hello from v2 (Green/Canary)! Requests: 11
Hello from v1 (Blue)! Requests: 161
Hello from v1 (Blue)! Requests: 162
Hello from v1 (Blue)! Requests: 163
Hello from v1 (Blue)! Requests: 164
Hello from v2 (Green/Canary)! Requests: 12
Hello from v1 (Blue)! Requests: 165
Hello from v1 (Blue)! Requests: 166
Hello from v1 (Blue)! Requests: 167
Hello from v1 (Blue)! Requests: 168
Hello from v2 (Green/Canary)! Requests: 13
Hello from v1 (Blue)! Requests: 169
Hello from v1 (Blue)! Requests: 170
```

### 50/50

```nginx
upstream app_backend {
  server v1:3001 weight=50;
  server v2:3002 weight=50;
}
```

Resultas for 20 requests: Blue 10 + Green/Canary 10

```console
Hello from v1 (Blue)! Requests: 171
Hello from v2 (Green/Canary)! Requests: 14
Hello from v1 (Blue)! Requests: 172
Hello from v2 (Green/Canary)! Requests: 15
Hello from v1 (Blue)! Requests: 173
Hello from v2 (Green/Canary)! Requests: 16
Hello from v1 (Blue)! Requests: 174
Hello from v2 (Green/Canary)! Requests: 17
Hello from v1 (Blue)! Requests: 175
Hello from v2 (Green/Canary)! Requests: 18
Hello from v1 (Blue)! Requests: 176
Hello from v2 (Green/Canary)! Requests: 19
Hello from v1 (Blue)! Requests: 177
Hello from v2 (Green/Canary)! Requests: 20
Hello from v1 (Blue)! Requests: 178
Hello from v2 (Green/Canary)! Requests: 21
Hello from v1 (Blue)! Requests: 179
Hello from v2 (Green/Canary)! Requests: 22
Hello from v1 (Blue)! Requests: 180
Hello from v2 (Green/Canary)! Requests: 23
```

### 100% v2

```nginx
upstream app_backend {
  server v2:3002;
}
```

Resultas for 20 requests: Blue 10 + Green/Canary 10

```console
Hello from v2 (Green/Canary)! Requests: 24
Hello from v2 (Green/Canary)! Requests: 25
Hello from v2 (Green/Canary)! Requests: 26
Hello from v2 (Green/Canary)! Requests: 27
Hello from v2 (Green/Canary)! Requests: 28
Hello from v2 (Green/Canary)! Requests: 29
Hello from v2 (Green/Canary)! Requests: 30
Hello from v2 (Green/Canary)! Requests: 31
Hello from v2 (Green/Canary)! Requests: 32
Hello from v2 (Green/Canary)! Requests: 33
Hello from v2 (Green/Canary)! Requests: 34
Hello from v2 (Green/Canary)! Requests: 35
Hello from v2 (Green/Canary)! Requests: 36
Hello from v2 (Green/Canary)! Requests: 37
Hello from v2 (Green/Canary)! Requests: 38
Hello from v2 (Green/Canary)! Requests: 39
Hello from v2 (Green/Canary)! Requests: 40
Hello from v2 (Green/Canary)! Requests: 41
Hello from v2 (Green/Canary)! Requests: 42
Hello from v2 (Green/Canary)! Requests: 43
```

## Exercise 2 - Blue/Green rollback

To simulate a broken v2, temporarily replace the root route in `app/v2/server.js` with:

```javascript
app.get('/', (req, res) => {
  res.status(500).send('ERROR: v2 is broken');
});
```

Route all traffic to v2:

```nginx
upstream app_backend {
  server v2:3002;
}
```

Results:

```console
dependency failed to start: container zero_downtime-v2-1 is unhealthy

What's next:
    Debug this Compose error with Gordon → docker ai "help me fix this compose error"
```

If v2 fails, roll back by switching Nginx to v1:

```nginx
upstream app_backend {
  server v1:3001;
}
```

Results:

```console
dependency failed to start: container zero_downtime-v2-1 is unhealthy

What's next:
    Debug this Compose error with Gordon → docker ai "help me fix this compose error"
```

## Exercise 3 — Logging

Both applications count requests in memory and print the current counter to stdout.

Inspect the logs:

```bash
docker compose logs v1
docker compose logs v2
```

```console
v1-1  | v1 running on 3001
v1-1  | v1 request count: 1
v1-1  | v1 request count: 2
v1-1  | v1 request count: 3
v1-1  | v1 request count: 4
v1-1  | v1 request count: 5
v1-1  | v1 request count: 6
v1-1  | v1 request count: 7
v1-1  | v1 request count: 8
v1-1  | v1 request count: 9
v1-1  | v1 request count: 10
v1-1  | v1 request count: 11
v1-1  | v1 request count: 12
v1-1  | v1 request count: 13
v1-1  | v1 request count: 14
v1-1  | v1 request count: 15
v1-1  | v1 request count: 16
v1-1  | v1 request count: 17
v1-1  | v1 request count: 18
v1-1  | v1 request count: 19
v1-1  | v1 request count: 20
v1-1  | v1 request count: 21
v1-1  | v1 request count: 22
v1-1  | v1 request count: 23
v1-1  | v1 request count: 24
v1-1  | v1 request count: 25
v1-1  | v1 request count: 26
v1-1  | v1 request count: 27
v1-1  | v1 request count: 28
v1-1  | v1 request count: 29
v1-1  | v1 request count: 30
v1-1  | v1 request count: 31
v1-1  | v1 request count: 32
v1-1  | v1 request count: 33
v1-1  | v1 request count: 34
v1-1  | v1 request count: 35
v1-1  | v1 request count: 36
v1-1  | v1 request count: 37
v1-1  | v1 request count: 38
v1-1  | v1 request count: 39
v1-1  | v1 request count: 40
v1-1  | v1 request count: 41
v1-1  | v1 request count: 42
v1-1  | v1 request count: 43
v1-1  | v1 request count: 44
v1-1  | v1 request count: 45
v1-1  | v1 request count: 46
v1-1  | v1 request count: 47
v1-1  | v1 request count: 48
v1-1  | v1 request count: 49
v1-1  | v1 request count: 50
v1-1  | v1 request count: 51
v1-1  | v1 request count: 52
v1-1  | v1 request count: 53
v1-1  | v1 request count: 54
v1-1  | v1 request count: 55
v1-1  | v1 request count: 56
v1-1  | v1 request count: 57
v1-1  | v1 request count: 58
v1-1  | v1 request count: 59
v1-1  | v1 request count: 60
v1-1  | v1 request count: 61
v1-1  | v1 request count: 62
v1-1  | v1 request count: 63
v1-1  | v1 request count: 64
v1-1  | v1 request count: 65
v1-1  | v1 request count: 66
v1-1  | v1 request count: 67
v1-1  | v1 request count: 68
v1-1  | v1 request count: 69
v1-1  | v1 request count: 70
v1-1  | v1 request count: 71
v1-1  | v1 request count: 72
v1-1  | v1 request count: 73
v1-1  | v1 request count: 74
v1-1  | v1 request count: 75
v1-1  | v1 request count: 76
v1-1  | v1 request count: 77
v1-1  | v1 request count: 78
v1-1  | v1 request count: 79
v1-1  | v1 request count: 80
v1-1  | v1 request count: 81
v1-1  | v1 request count: 82
v1-1  | v1 request count: 83
v1-1  | v1 request count: 84
v1-1  | v1 request count: 85
v1-1  | v1 request count: 86
v1-1  | v1 request count: 87
v1-1  | v1 request count: 88
v1-1  | v1 request count: 89
v1-1  | v1 request count: 90
v1-1  | v1 request count: 91
v1-1  | v1 request count: 92
v1-1  | v1 request count: 93
v1-1  | v1 request count: 94
v1-1  | v1 request count: 95
v1-1  | v1 request count: 96
v1-1  | v1 request count: 97
v1-1  | v1 request count: 98
v1-1  | v1 request count: 99
v1-1  | v1 request count: 100
v1-1  | v1 request count: 101
v1-1  | v1 request count: 102
v1-1  | v1 request count: 103
v1-1  | v1 request count: 104
v1-1  | v1 request count: 105
v1-1  | v1 request count: 106
v1-1  | v1 request count: 107
v1-1  | v1 request count: 108
v1-1  | v1 request count: 109
v1-1  | v1 request count: 110
v1-1  | v1 request count: 111
v1-1  | v1 request count: 112
v1-1  | v1 request count: 113
v1-1  | v1 request count: 114
v1-1  | v1 request count: 115
v1-1  | v1 request count: 116
v1-1  | v1 request count: 117
v1-1  | v1 request count: 118
v1-1  | v1 request count: 119
v1-1  | v1 request count: 120
v1-1  | v1 request count: 121
v1-1  | v1 request count: 122
v1-1  | v1 request count: 123
v1-1  | v1 request count: 124
v1-1  | v1 request count: 125
v1-1  | v1 request count: 126
v1-1  | v1 request count: 127
v1-1  | v1 request count: 128
v1-1  | v1 request count: 129
v1-1  | v1 request count: 130
v1-1  | v1 request count: 131
v1-1  | v1 request count: 132
v1-1  | v1 request count: 133
v1-1  | v1 request count: 134
v1-1  | v1 request count: 135
v1-1  | v1 request count: 136
v1-1  | v1 request count: 137
v1-1  | v1 request count: 138
v1-1  | v1 request count: 139
v1-1  | v1 request count: 140
v1-1  | v1 request count: 141
v1-1  | v1 request count: 142
v1-1  | v1 request count: 143
v1-1  | v1 request count: 144
v1-1  | v1 request count: 145
v1-1  | v1 request count: 146
v1-1  | v1 request count: 147
v1-1  | v1 request count: 148
v1-1  | v1 request count: 149
v1-1  | v1 request count: 150
v1-1  | v1 request count: 151
v1-1  | v1 request count: 152
v1-1  | v1 request count: 153
v1-1  | v1 request count: 154
v1-1  | v1 request count: 155
v1-1  | v1 request count: 156
v1-1  | v1 request count: 157
v1-1  | v1 request count: 158
v1-1  | v1 request count: 159
v1-1  | v1 request count: 160
v1-1  | v1 request count: 161
v1-1  | v1 request count: 162
v1-1  | v1 request count: 163
v1-1  | v1 request count: 164
v1-1  | v1 request count: 165
v1-1  | v1 request count: 166
v1-1  | v1 request count: 167
v1-1  | v1 request count: 168
v1-1  | v1 request count: 169
v1-1  | v1 request count: 170
v1-1  | v1 request count: 171
v1-1  | v1 request count: 172
v1-1  | v1 request count: 173
v1-1  | v1 request count: 174
v1-1  | v1 request count: 175
v1-1  | v1 request count: 176
v1-1  | v1 request count: 177
v1-1  | v1 request count: 178
v1-1  | v1 request count: 179
v1-1  | v1 request count: 180
v2-1  | v2 running on 3002
```

With a 50/50 configuration, counts should become approximately equal over many requests, but not necessarily exactly equal.

## Exercise 4 — Health checks

Both applications expose a `/health` endpoint.

Example response:

```json
{
  "status": "healthy",
  "version": "v1"
}
```

Docker Compose also defines container health checks. Inspect status with:

```bash
docker compose ps
```

```console
NAME                    IMAGE                                                                     COMMAND                  SERVICE   CREATED              STATUS                        PORTS
zero_downtime-nginx-1   zero_downtime-nginx                                                       "/docker-entrypoint.…"   nginx     About a minute ago   Up 49 seconds                 0.0.0.0:8080->80/tcp, [::]:8080->80/tcp
zero_downtime-v1-1      sha256:1ed5116023cdbda761cad5ea92a5a48136bc12803f670d5d167bcccb21441604   "docker-entrypoint.s…"   v1        32 minutes ago       Up 32 minutes (healthy)       0.0.0.0:3001->3001/tcp, [::]:3001->3001/tcp
zero_downtime-v2-1      zero_downtime-v2                                                          "docker-entrypoint.s…"   v2        About a minute ago   Up About a minute (healthy)   0.0.0.0:3002->3002/tcp, [::]:3002->3002/tcp
```

## Stop the environment

```bash
docker compose down
```

## Despliegue en Producion (Reder)

El sistema se encuentra desplegado y operativo en la nube utilizando **Render**, implementando una arquitectura de despliegue **Canary Deployment** gestionada por Nginx como Reverse Proxy.

### Endpoints Publicos

| Servicio | Rol | URL Pública |
| :--- | :--- | :--- |
| **Nginx Proxy** | Traffic Splitter / Entrypoint | `https://zero-downtime-nginx.onrender.com` |
| **App v1** | Version Blue (95% del tráfico) | `https://zero-downtime-v1.onrender.com` |
| **App v2** | Version Green/Canary (5% del tráfico) | `https://zero-downtime-v2.onrender.com` |

### Verificacion de Estado (Health Checks)

Comprobación del estado individual de los microservicios en Render:

```Bash
curl -s https://zero-downtime-v1.onrender.com/health && echo ""
curl -s https://zero-downtime-v2.onrender.com/health && echo ""
```

Resultado:

```console
{"status":"healthy","version":"v1"}
{"status":"healthy","version":"v2"}
```

### Pruebas de Distribucion de Trafico

```Bash
for i in {1..100}; do curl -s "https://zero-downtime-nginx.onrender.com/?req=$i"; echo ""; done | grep -oE "v1|v2" | sort | uniq -c
```
Result:

```console
  98 v1
   2 v2
```

### Latencia y Respuesta del Servidor

```Bash
curl -o /dev/null -s -w "HTTP Status: %{http_code} | Total Time: %{time_total}s\n" https://zero-downtime-nginx.onrender.com/
```

Result:

```console
HTTP Status: 200 | Total Time: 0.547713s
```

## Notes

- Request counters are intentionally stored in memory for teaching purposes and reset whenever a container restarts.
- Nginx weighted load balancing is approximate over a sequence of requests.
- This repository is designed as a classroom example, not as a production-ready deployment platform.
- `render.yaml` use to deploy on a cloud environment
