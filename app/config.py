from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    POSTGRES_DB: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_PORT: int
    PG_VOLUME_PATH: str
    APP_PORT: int
    PROMETHEUS_PORT: int
    GRAFANA_PORT: int
    GF_SECURITY_ADMIN_PASSWORD: str


settings = Settings()