from fastapi import FastAPI, APIRouter, HTTPException, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import hashlib

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Admin password
ADMIN_PASSWORD = "Emilia9@#$"

# Models
class Video(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    embedUrl: str
    thumbnail: str  # base64 or URL
    category: str
    views: int = 0
    episode: Optional[str] = None
    createdAt: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class VideoCreate(BaseModel):
    title: str
    description: str
    embedUrl: str
    thumbnail: str
    category: str
    episode: Optional[str] = None

class VideoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    embedUrl: Optional[str] = None
    thumbnail: Optional[str] = None
    category: Optional[str] = None
    episode: Optional[str] = None

class Category(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str

class CategoryCreate(BaseModel):
    name: str
    slug: str

class Settings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    logo: str  # base64
    primaryColor: str = "#3B82F6"
    darkBg: str = "#0F0F0F"
    lightBg: str = "#FFFFFF"
    textColor: str = "#E5E7EB"

class SettingsUpdate(BaseModel):
    logo: Optional[str] = None
    primaryColor: Optional[str] = None
    darkBg: Optional[str] = None
    lightBg: Optional[str] = None
    textColor: Optional[str] = None

class Page(BaseModel):
    model_config = ConfigDict(extra="ignore")
    slug: str
    title: str
    content: str

class PageUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class AdminLogin(BaseModel):
    password: str

class AdminResponse(BaseModel):
    token: str

class TranslateRequest(BaseModel):
    text: str
    source: str = "en"
    target: str = "id"

class TranslateResponse(BaseModel):
    translatedText: str

# Helper function to verify admin
def verify_admin(authorization: Optional[str] = None):
    if not authorization or authorization != f"Bearer {hashlib.sha256(ADMIN_PASSWORD.encode()).hexdigest()}":
        raise HTTPException(status_code=401, detail="Unauthorized")

# Routes
@api_router.get("/")
async def root():
    return {"message": "ShinDoraNesub API"}

# Translation endpoint (proxy to LibreTranslate)
@api_router.post("/translate", response_model=TranslateResponse)
async def translate(request: TranslateRequest):
    import requests
    try:
        response = requests.post(
            "https://libretranslate.com/translate",
            json={
                "q": request.text,
                "source": request.source,
                "target": request.target,
                "format": "text"
            },
            headers={"Content-Type": "application/json"}
        )
        data = response.json()
        return {"translatedText": data.get("translatedText", request.text)}
    except Exception as e:
        logger.error(f"Translation error: {e}")
        return {"translatedText": request.text}

# Admin login
@api_router.post("/admin/login", response_model=AdminResponse)
async def admin_login(login: AdminLogin):
    if login.password == ADMIN_PASSWORD:
        token = hashlib.sha256(ADMIN_PASSWORD.encode()).hexdigest()
        return {"token": token}
    raise HTTPException(status_code=401, detail="Invalid password")

# Videos
@api_router.get("/videos", response_model=List[Video])
async def get_videos(category: Optional[str] = None, limit: int = 50):
    query = {"category": category} if category else {}
    videos = await db.videos.find(query, {"_id": 0}).sort("createdAt", -1).to_list(limit)
    return videos

@api_router.get("/videos/{video_id}", response_model=Video)
async def get_video(video_id: str):
    video = await db.videos.find_one({"id": video_id}, {"_id": 0})
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # Increment views
    await db.videos.update_one({"id": video_id}, {"$inc": {"views": 1}})
    video["views"] = video.get("views", 0) + 1
    return video

@api_router.post("/videos", response_model=Video)
async def create_video(video: VideoCreate, authorization: Optional[str] = Header(None)):
    verify_admin(authorization)
    video_obj = Video(**video.model_dump())
    doc = video_obj.model_dump()
    await db.videos.insert_one(doc)
    return video_obj

@api_router.put("/videos/{video_id}", response_model=Video)
async def update_video(video_id: str, video_update: VideoUpdate, authorization: Optional[str] = Header(None)):
    verify_admin(authorization)
    
    existing = await db.videos.find_one({"id": video_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Video not found")
    
    update_data = {k: v for k, v in video_update.model_dump().items() if v is not None}
    if update_data:
        await db.videos.update_one({"id": video_id}, {"$set": update_data})
    
    updated = await db.videos.find_one({"id": video_id}, {"_id": 0})
    return updated

@api_router.delete("/videos/{video_id}")
async def delete_video(video_id: str, authorization: Optional[str] = Header(None)):
    verify_admin(authorization)
    result = await db.videos.delete_one({"id": video_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Video not found")
    return {"message": "Video deleted"}

# Search
@api_router.get("/search", response_model=List[Video])
async def search_videos(q: str, limit: int = 50):
    videos = await db.videos.find(
        {"$or": [
            {"title": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
            {"category": {"$regex": q, "$options": "i"}}
        ]},
        {"_id": 0}
    ).to_list(limit)
    return videos

# Trending
@api_router.get("/trending", response_model=List[Video])
async def get_trending(limit: int = 20):
    videos = await db.videos.find({}, {"_id": 0}).sort("views", -1).limit(limit).to_list(limit)
    return videos

# Categories
@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    categories = await db.categories.find({}, {"_id": 0}).to_list(100)
    return categories

@api_router.post("/categories", response_model=Category)
async def create_category(category: CategoryCreate, authorization: Optional[str] = Header(None)):
    verify_admin(authorization)
    category_obj = Category(**category.model_dump())
    doc = category_obj.model_dump()
    await db.categories.insert_one(doc)
    return category_obj

@api_router.put("/categories/{category_id}", response_model=Category)
async def update_category(category_id: str, category_update: CategoryCreate, authorization: Optional[str] = Header(None)):
    verify_admin(authorization)
    
    existing = await db.categories.find_one({"id": category_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Category not found")
    
    await db.categories.update_one({"id": category_id}, {"$set": category_update.model_dump()})
    updated = await db.categories.find_one({"id": category_id}, {"_id": 0})
    return updated

@api_router.delete("/categories/{category_id}")
async def delete_category(category_id: str, authorization: Optional[str] = Header(None)):
    verify_admin(authorization)
    result = await db.categories.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted"}

# Settings
@api_router.get("/settings", response_model=Settings)
async def get_settings():
    settings = await db.settings.find_one({}, {"_id": 0})
    if not settings:
        # Return default settings
        default_settings = Settings(logo="")
        return default_settings
    return settings

@api_router.put("/settings", response_model=Settings)
async def update_settings(settings_update: SettingsUpdate, authorization: Optional[str] = Header(None)):
    verify_admin(authorization)
    
    existing = await db.settings.find_one({}, {"_id": 0})
    update_data = {k: v for k, v in settings_update.model_dump().items() if v is not None}
    
    if existing:
        if update_data:
            await db.settings.update_one({}, {"$set": update_data})
        updated = await db.settings.find_one({}, {"_id": 0})
        return updated
    else:
        # Create new settings
        new_settings = Settings(**update_data) if update_data else Settings(logo="")
        await db.settings.insert_one(new_settings.model_dump())
        return new_settings

# Pages
@api_router.get("/pages/{slug}", response_model=Page)
async def get_page(slug: str):
    page = await db.pages.find_one({"slug": slug}, {"_id": 0})
    if not page:
        # Return default content
        default_pages = {
            "about": {
                "slug": "about",
                "title": "About Us",
                "content": "ShinDoraNesub adalah proyek penggemar untuk anime klasik seperti Doraemon, Crayon Shin-chan, Ninja Hattori-kun, dan Chibi Maruko-chan. Semua video di-embed dari sumber publik.\n\nKontak: shindoranesub@gmail.com"
            },
            "disclaimer": {
                "slug": "disclaimer",
                "title": "Disclaimer",
                "content": "Semua video di situs ini berasal dari sumber publik. Kami tidak menyimpan atau mengklaim kepemilikan konten apa pun.\n\nKontak: shindoranesub@gmail.com"
            },
            "privacy": {
                "slug": "privacy",
                "title": "Privacy Policy",
                "content": "Kami tidak mengumpulkan data pengguna. Semua pengaturan disimpan lokal di browser (LocalStorage).\n\nKontak: shindoranesub@gmail.com"
            },
            "terms": {
                "slug": "terms",
                "title": "Terms & Conditions",
                "content": "Dengan menggunakan situs ini, pengguna setuju untuk menonton konten hanya untuk penggunaan pribadi.\n\nKontak: shindoranesub@gmail.com"
            }
        }
        return default_pages.get(slug, {"slug": slug, "title": "Not Found", "content": ""})
    return page

@api_router.put("/pages/{slug}", response_model=Page)
async def update_page(slug: str, page_update: PageUpdate, authorization: Optional[str] = Header(None)):
    verify_admin(authorization)
    
    existing = await db.pages.find_one({"slug": slug}, {"_id": 0})
    update_data = {k: v for k, v in page_update.model_dump().items() if v is not None}
    
    if existing:
        if update_data:
            await db.pages.update_one({"slug": slug}, {"$set": update_data})
        updated = await db.pages.find_one({"slug": slug}, {"_id": 0})
        return updated
    else:
        # Create new page
        new_page = Page(slug=slug, title=update_data.get("title", ""), content=update_data.get("content", ""))
        await db.pages.insert_one(new_page.model_dump())
        return new_page

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()