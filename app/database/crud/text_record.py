from sqlmodel import select, delete
from models.text_record import TextRecord
from sqlalchemy.ext.asyncio import AsyncSession

async def create_record(record: TextRecord, session: AsyncSession) -> TextRecord:
    session.add(record)
    await session.commit()
    await session.refresh(record)
    return record

async def get_record_by_hashed_key(hashed_key: str, session: AsyncSession) -> TextRecord:
    statement = select(TextRecord).where(TextRecord.hashed_key == hashed_key)
    result = await session.exec(statement)
    record: TextRecord = result.first()
    
    if record is None:
        return record
    
    if record.is_expired():
        await session.delete(record)
        await session.commit()
        return None
    
    if record.is_one_time:
        await session.delete(record)
        await session.commit()
    
    return record

