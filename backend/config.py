import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

class Settings:
    # MongoDB
    MONGO_URL = os.environ['MONGO_URL']
    DB_NAME = os.environ['DB_NAME']
    
    # JWT
    JWT_SECRET_KEY = os.environ['JWT_SECRET_KEY']
    JWT_ALGORITHM = os.environ['JWT_ALGORITHM']
    JWT_EXPIRATION_DAYS = int(os.environ.get('JWT_EXPIRATION_DAYS', 7))
    
    # Pterodactyl
    PTERODACTYL_PANEL_URL = os.environ['PTERODACTYL_PANEL_URL']
    PTERODACTYL_API_KEY = os.environ['PTERODACTYL_API_KEY']
    
settings = Settings()