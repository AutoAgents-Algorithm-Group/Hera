"""
LLM Manager - 统一管理 LLM 模型的创建和配置
"""

from typing import Optional, Dict, Any
from langchain_openai import ChatOpenAI

from .base_manager import BaseManager


class LLMManager(BaseManager):
    """
    LLM 模型管理器
    
    负责根据配置创建和管理 LLM 模型实例
    """
    
    def __init__(self):
        """初始化 LLMManager，加载 llm.yaml 配置"""
        super().__init__(config_file="llm.yaml")
    
    def create_model(
        self,
        agent_name: str,
        temperature: Optional[float] = None,
        streaming: bool = False,
        custom_model: Optional[Dict[str, Any]] = None,
        **kwargs
    ) -> ChatOpenAI:
        """
        根据 Agent 配置创建模型实例
        
        Args:
            agent_name: Agent 名称（如 research_agent, chat_agent, critique_subagent, research_subagent）
            temperature: 温度参数，如果为 None 则使用配置中的值
            streaming: 是否启用流式输出
            custom_model: 自定义模型配置（来自前端 localStorage），格式：
                {
                    "baseUrl": str,
                    "apiKey": str,
                    "modelName": str
                }
            **kwargs: 其他传递给 ChatOpenAI 的参数
            
        Returns:
            ChatOpenAI 实例
            
        Raises:
            ValueError: 如果配置不存在或缺少必需参数
        """
        # 如果提供了自定义模型配置，优先使用
        if custom_model and custom_model.get("modelName"):
            api_key = custom_model.get("apiKey")
            base_url = custom_model.get("baseUrl")
            model_name = custom_model.get("modelName")
            
            if not api_key:
                raise ValueError("自定义模型配置缺少 apiKey")
            if not model_name:
                raise ValueError("自定义模型配置缺少 modelName")
            
            # 使用默认 temperature 或传入的值
            final_temperature = temperature if temperature is not None else 0.7
            
            # 构建 ChatOpenAI 参数
            model_params = {
                "model": model_name,
                "api_key": api_key,
                "temperature": final_temperature,
                "streaming": streaming,
                **kwargs
            }
            
            # 添加 base_url（如果提供）
            if base_url:
                model_params["base_url"] = base_url
            
            print(f"✅ 使用自定义模型配置: {model_name} @ {base_url or 'default'}")
            return ChatOpenAI(**model_params)
        
        # 否则使用 llm.yaml 配置
        # 获取全局 LLM 客户端配置（继承自 BaseManager）
        llm_client_config = self.get_llm_client_config()
        if not llm_client_config:
            raise ValueError("LLM 客户端配置（llm_client）不存在")
        
        api_key = llm_client_config.get("api_key")
        base_url = llm_client_config.get("base_url")
        
        if not api_key:
            raise ValueError("api_key 未在 llm_client 中配置")
        
        # 获取 Agent 特定配置（继承自 BaseManager）
        agent_config = self.get_agent_config(agent_name)
        if not agent_config:
            raise ValueError(f"Agent 配置不存在: {agent_name}")
        
        # 提取配置
        model_name = agent_config.get("model")
        config_temperature = agent_config.get("temperature", 0.7)
        
        # 验证必需参数
        if not model_name:
            raise ValueError(f"model 未配置: {agent_name}")
        
        # 使用传入的 temperature 或配置中的值
        final_temperature = temperature if temperature is not None else config_temperature
        
        # 构建 ChatOpenAI 参数
        model_params = {
            "model": model_name,
            "api_key": api_key,
            "temperature": final_temperature,
            "streaming": streaming,
            **kwargs
        }
        
        # 添加 base_url（如果提供）
        if base_url:
            model_params["base_url"] = base_url
        
        # 创建模型实例
        return ChatOpenAI(**model_params)