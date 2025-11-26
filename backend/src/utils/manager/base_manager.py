"""
Base Manager - 所有 Manager 的基类
直接管理 YAML 配置的加载和访问
"""

import yaml
from pathlib import Path
from typing import Optional, Dict, Any


def find_project_root(start_path: Path = None) -> Path:
    """
    从指定路径向上查找项目根目录（包含 yaml 配置文件的目录）
    
    Args:
        start_path: 起始查找路径，默认为当前文件所在目录
    
    Returns:
        项目根目录路径（backend 目录）
    """
    current = start_path or Path(__file__).resolve().parent
    
    # 向上查找，直到找到包含 yaml 配置文件的目录
    while current != current.parent:
        # 检查目录下是否有 yaml 配置文件
        yaml_files = list(current.glob("*.yaml")) + list(current.glob("*.yml"))
        if yaml_files and any(f.stem in ['llm', 'mcp', 'tools'] for f in yaml_files):
            return current
        current = current.parent
    
    # 如果没找到，返回 backend 目录（fallback）
    return Path(__file__).resolve().parent.parent.parent


class BaseManager:
    """所有 Manager 的基类，负责加载配置并提供配置访问方法"""
    
    def __init__(self, config_file: str = "config.yaml"):
        """
        初始化，加载配置
        
        Args:
            config_file: 配置文件名（相对于 backend 根目录），如 "llm.yaml", "mcp.yaml"
        """
        project_root = find_project_root()
        self.config_path = project_root / config_file
        self._config_data: Dict[str, Any] = {}
        self._load_config()
    
    def _load_config(self):
        """从 YAML 文件加载配置"""
        try:
            if self.config_path.exists():
                with open(self.config_path, 'r', encoding='utf-8') as f:
                    self._config_data = yaml.safe_load(f) or {}
            else:
                self._config_data = {}
        except Exception as e:
            self._config_data = {}
    
    def reload(self):
        """重新加载配置"""
        self._load_config()
    
    def get_agent_config(self, agent_name: str) -> Optional[Dict[str, Any]]:
        """
        获取 Agent 配置
        
        Args:
            agent_name: Agent 名称 (research_agent, chat_agent, critique_subagent, research_subagent)
        
        Returns:
            配置字典
        """
        try:
            agent_data = self._config_data.get('agent', {}).get(agent_name)
            return agent_data
        except Exception as e:
            return None
    
    def get_llm_client_config(self) -> Optional[Dict[str, Any]]:
        """
        获取全局 LLM 客户端配置
        
        Returns:
            包含 base_url 和 api_key 的字典
        """
        try:
            return self._config_data.get('llm_client', {})
        except Exception as e:
            return None
    
    def get_tool_api_key(self, tool_name: str) -> Optional[str]:
        """
        获取工具 API Key
        
        Args:
            tool_name: 工具名称 (tavily)
        
        Returns:
            API Key 字符串
        """
        try:
            return self._config_data.get('tools', {}).get(tool_name, {}).get('api_key')
        except Exception as e:
            return None
    
    def get_all_config(self) -> Dict[str, Any]:
        """获取完整配置"""
        return self._config_data.copy()

