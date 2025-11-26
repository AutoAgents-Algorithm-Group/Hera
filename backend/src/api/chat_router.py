from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from ..repository.models.chats import SimpleChatRequest, ChatRequest, ResumeResearchRequest
from ..services.chat_service import create_chat_service
from ..services.deep_research import create_deep_research_service
from ..utils.logger import logger

chat_router = APIRouter(prefix="/api", tags=["Chat"])


@chat_router.post("/invoke-agent")
async def invoke_agent_endpoint(request: ChatRequest):
    """
    Agent 模式 - 支持工具调用，自动规划执行
    
    Args:
        request: 包含 message, model, mcp_servers, chat_history, custom_model
        
    Returns:
        StreamingResponse: SSE 流式响应
    """
    logger.info(f"🤖 收到 Agent 请求 | message: {request.message[:100]}... | model: {request.model} | mcp_servers: {len(request.mcp_servers or [])} | custom_model: {bool(request.custom_model)}")
    
    # 创建聊天服务（从 config.yaml 读取配置）
    chat_service = create_chat_service()
    
    # 处理聊天历史
    chat_history = request.chat_history or []
    
    # 将 custom_model 转换为字典格式
    custom_model_dict = None
    if request.custom_model:
        custom_model_dict = {
            "baseUrl": request.custom_model.baseUrl,
            "apiKey": request.custom_model.apiKey,
            "modelName": request.custom_model.modelName
        }
    
    # 处理资源文件
    resource_files = None
    if request.resource_files:
        resource_files = [
            {
                "name": rf.name,
                "content": rf.content,
                "type": rf.type
            }
            for rf in request.resource_files
        ]
        logger.info(f"📄 收到 {len(resource_files)} 个资源文件")
    
    return StreamingResponse(
        chat_service.invoke(
            message=request.message,
            mcp_servers=request.mcp_servers,
            chat_history=chat_history,
            custom_model=custom_model_dict,
            resource_files=resource_files
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )


@chat_router.post("/invoke-deep-research")
async def invoke_deep_research_endpoint(request: SimpleChatRequest):
    """
    Deep Research 模式 - 深度研究助手
    
    多阶段研究流程：
    1. 澄清研究范围
    2. 制定研究计划
    3. 执行深度研究
    4. 生成研究报告
    
    Args:
        request: 包含 message, model, chat_history
        
    Returns:
        StreamingResponse: SSE 流式响应，包含完整的研究过程
    """
    logger.info(f"🔬 收到 Deep Research 请求 | query: {request.message[:100]}... | model: {request.model}")
    
    # 创建研究服务（从 config.yaml 读取配置）
    research_service = create_deep_research_service()
    chat_history = request.chat_history or []
    
    return StreamingResponse(
        research_service.invoke(
            request.message,
            chat_history,
            skip_clarification=request.skip_clarification,
            continue_research=request.continue_research,
            thread_id=request.thread_id,
            resume=request.resume
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )


@chat_router.post("/resume-deep-research")
async def resume_deep_research_endpoint(request: ResumeResearchRequest):
    """
    恢复暂停的深度研究流程
    
    用户确认 TodoList 后，从 LangGraph checkpoint 恢复执行
    
    Args:
        request: 包含 thread_id 和确认状态
        
    Returns:
        StreamingResponse: SSE 流式响应
    """
    request = ResumeResearchRequest(**request.dict()) if not isinstance(request, ResumeResearchRequest) else request
    
    logger.info(f"🔄 恢复研究 | thread_id: {request.thread_id} | confirmed: {request.confirmed}")
    
    # 创建研究服务（从 config.yaml 读取配置）
    research_service = create_deep_research_service()
    
    return StreamingResponse(
        research_service.invoke(
            query="",
            chat_history=[],
            skip_clarification=False,
            continue_research=False,
            thread_id=request.thread_id,
            resume=True,
            confirmed=request.confirmed
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )