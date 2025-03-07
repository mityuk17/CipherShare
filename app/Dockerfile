# Используем официальный образ Python 3.12
FROM python:3.12-slim

# Устанавливаем переменные окружения
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Устанавливаем системные зависимости для работы с PostgreSQL и шифрованием
RUN apt-get update && apt-get install -y \
    libpq-dev gcc curl && \
    rm -rf /var/lib/apt/lists/*

# Создаём рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей и устанавливаем их
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Копируем весь код приложения
COPY . .



# Команда для запуска сервиса
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
