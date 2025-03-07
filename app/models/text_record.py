from sqlmodel import SQLModel, Field
from datetime import datetime, timedelta

class TextRecord(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_key: str
    encrypted_data: bytes
    is_one_time: bool = Field(default=True)
    ttl: int | None = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.now)
    
    def is_expired(self) -> bool:
        if self.ttl is None:
            return False
        return datetime.now() > self.created_at + timedelta(seconds=self.ttl)


class CreateTextRecordRequest(SQLModel):
    data: str
    is_one_time: bool = Field(default=True)
    ttl: int | None = Field(default=None)
    

class CreateTextRecordResponse(SQLModel):
    code: str

class GetTextRecordResponse(SQLModel):
    data: str