from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# User Models
class UserRegister(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    first_name: str
    last_name: str
    balance: float
    pterodactyl_user_id: Optional[int] = None

# Balance Models
class DepositRequest(BaseModel):
    amount: float = Field(..., gt=0)

# Server Models
class PricingPlan(BaseModel):
    id: str
    name: str
    cpu: str
    ram: str
    storage: str
    price: float

class ServerPurchase(BaseModel):
    plan: str
    location: str
    server_name: str = Field(..., min_length=3, max_length=100)

class ServerResponse(BaseModel):
    id: str
    pterodactyl_id: Optional[int] = None
    name: str
    plan: str
    cpu: str
    ram: str
    storage: str
    location: str
    ip: Optional[str] = None
    port: Optional[int] = None
    status: str
    price: float
    created_at: datetime