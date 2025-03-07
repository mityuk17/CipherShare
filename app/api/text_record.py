from fastapi import APIRouter, HTTPException, Query, Depends
from services import encryption
from database.crud import text_record as text_record_crud
from database.base import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from models.text_record import CreateTextRecordResponse, CreateTextRecordRequest, GetTextRecordResponse, TextRecord

router = APIRouter(prefix="/text-records", tags=["text-records"])


@router.post("/", response_model=CreateTextRecordResponse)
async def create_record(request: CreateTextRecordRequest, session: AsyncSession = Depends(get_session)):
    # Генерируем симметричный ключ
    key = encryption.generate_key()
    # Шифруем данные
    encrypted_data = encryption.encrypt_data(request.data, key)
    # Вычисляем хеш ключа
    hashed_key = encryption.hash_key(key)
    
    record = TextRecord(hashed_key=hashed_key,
                        encrypted_data=encrypted_data,
                        is_one_time=request.is_one_time,
                        ttl=request.ttl)
    await text_record_crud.create_record(record, session)
    return CreateTextRecordResponse(code=key.hex())


@router.get("/", response_model=GetTextRecordResponse)
async def get_record(code: str = Query(..., description="Код для доступа к данным"),
                              session: AsyncSession = Depends(get_session)):
    try:
        key = bytes.fromhex(code)
    except ValueError:
        raise HTTPException(status_code=400, detail="Неверный формат кода")
    hashed_key = encryption.hash_key(key)
    record = await text_record_crud.get_record_by_hashed_key(hashed_key, session)
    if not record:
        raise HTTPException(status_code=404, detail="Запись не найдена")
    try:
        data = encryption.decrypt_data(record.encrypted_data, key)
    except Exception:
        raise HTTPException(status_code=400, detail="Ошибка при расшифровке данных. Возможно, неверный код.")
    return GetTextRecordResponse(data=data)
