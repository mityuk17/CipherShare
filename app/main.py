from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator
from database.base import init_db
from api import text_record_router
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()  # Инициализация базы данных при старте
    yield
    
    
app = FastAPI(title="CipherShare",
              description="Secure data sharing service",
              lifespan=lifespan)


instrumentator = Instrumentator()
instrumentator.instrument(app).expose(app, endpoint="/metrics")

# Подключение роутеров
app.include_router(text_record_router)

