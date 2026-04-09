from datetime import datetime

from pydantic import BaseModel, Field


class SearchHistoryDocument(BaseModel):
    """Schema for a search history document stored in MongoDB."""

    city: str
    country: str
    searched_at: datetime = Field(default_factory=datetime.utcnow)
