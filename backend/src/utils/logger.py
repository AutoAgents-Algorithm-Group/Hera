"""日志配置 - 使用 loguru 提供统一的日志管理"""

import sys
from pathlib import Path
from loguru import logger

# 移除默认的 handler
logger.remove()

# 创建 logs 目录
log_dir = Path(__file__).parent.parent.parent / "logs"
log_dir.mkdir(exist_ok=True)

# 添加控制台输出 - 彩色格式，便于开发调试
logger.add(
    sys.stdout,
    format="<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
    level="DEBUG",
    colorize=True,
)

# 添加文件输出 - 所有日志
logger.add(
    log_dir / "zeus_{time:YYYY-MM-DD}.log",
    format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | {name}:{function}:{line} - {message}",
    level="DEBUG",
    rotation="00:00",  # 每天午夜轮转
    retention="7 days",  # 保留7天
    compression="zip",  # 压缩旧日志
    encoding="utf-8",
)

# 添加错误日志文件 - 只记录 ERROR 及以上级别
logger.add(
    log_dir / "zeus_error_{time:YYYY-MM-DD}.log",
    format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | {name}:{function}:{line} - {message}",
    level="ERROR",
    rotation="00:00",
    retention="30 days",  # 错误日志保留30天
    compression="zip",
    encoding="utf-8",
)

# 导出 logger 实例
__all__ = ["logger"]

