from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from ..utils.manager.llm_manager import LLMManager
from .chats import chat_router
from .mcp import router as mcp_router


app = FastAPI(
    title="Zeus AI Backend",
    description="AI 服务后端 - 使用 LangChain 和 LangGraph",
    version="2.0.0"
)

# 注册路由
app.include_router(chat_router)
app.include_router(mcp_router)

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://zenus.agentspro.cn",
    "http://45.78.224.30:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """根路径"""
    return {
        "name": "Zeus Backend API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """健康检查接口"""
    return {"status": "ok", "message": "API is running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.api.main:app", host="0.0.0.0", port=8000, reload=True)
