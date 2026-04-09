from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, Field


class SearchHistoryDocument(BaseModel):
    """Schema for a search history document stored in MongoDB."""

    city: str
    country: str
    searched_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    travel_from: Optional[str] = None  # ISO date string, e.g. "2024-05-10"
    travel_to: Optional[str] = None    # ISO date string, e.g. "2024-05-15"
