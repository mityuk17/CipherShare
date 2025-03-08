from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Лучше указать конкретные домены в продакшене
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


instrumentator = Instrumentator()
instrumentator.instrument(app).expose(app, endpoint="/metrics")

# Подключение роутеров
app.include_router(text_record_router)

