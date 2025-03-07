# CipherShare: Secure Data Sharing Service

CipherShare is a secure data transfer service built with FastAPI and SQLModel. It allows users to create encrypted data records that can be retrieved using a unique code. Records can be configured as one-time (deleted after the first view) or time-limited (expire after a specified TTL, based on creation time).

## Features
- **Secure Data Transfer:** Encrypt data using AES-GCM and store only its hash.
- **Record Expiration:** Supports one-time records or records that expire after a user-defined TTL.
- **Auto-Generated API Documentation:** Swagger UI available at `/docs` and ReDoc at `/redoc`.
- **Asynchronous Operations:** Async endpoints and database operations for improved performance.
- **Dockerized Deployment:** Ready-to-use Docker and Docker Compose setup.
- **HTTPS with Nginx:** Secure HTTPS access via an Nginx reverse proxy.
- **Monitoring & Logging:** Integrated Prometheus for metrics, Grafana for dashboards.
