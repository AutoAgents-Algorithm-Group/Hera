from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# 创建FastAPI应用
app = FastAPI(
    title="Hera API", 
    version="1.0.0",
    description="Modular API for Hera with organized router structure"
)

# CORS设置，允许前端访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Next.js默认端口
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 根路由
@app.get("/")
async def root():
    return {
        "message": "Hera API is running",
        "version": "1.0.0",
        "architecture": "Modular Router Structure",
        "available_endpoints": {
        }
    }

if __name__ == "__main__":
    uvicorn.run("API.main:app", host="0.0.0.0", port=8000, reload=True)