<div align="center">

<img src="https://img.shields.io/badge/-Hera-000000?style=for-the-badge&labelColor=faf9f6&color=faf9f6&logoColor=000000" alt="Hera" width="280"/>

<h4>现代全栈开发模板</h4>

[English](README.md) | 简体中文

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="media/dark_license.svg" />
  <img alt="License MIT" src="media/light_license.svg" />
</picture>

</div>

以希腊神话中的奥林匹斯众神之后赫拉命名，这个模板为创建出色的现代应用程序提供了生产就绪架构的基础。

## 目录
- [目录](#目录)
- [为什么选择 Hera？](#为什么选择-hera)
- [快速开始](#快速开始)
- [部署](#部署)
- [贡献](#贡献)
- [许可证](#许可证)

## 为什么选择 Hera？

Hera 是一个革命性的全栈开发模板，让开发者能够以前所未有的速度和可靠性创建现代应用程序。就像它的同名神话人物——强大的奥林匹斯众神之后一样，Hera 为您的项目提供了蓬勃发展的基础和培育环境。

- **上市时间**：通过预配置设置将开发时间减少多达 70%
- **最佳实践**：遵循行业标准和经过验证的架构模式
- **灵活性**：易于定制以满足您的具体需求
- **社区**：基于流行的、得到良好支持的技术构建
- **文档**：全面的指南和示例

## 快速开始

**前置要求**
- Node.js 18+ 和 npm
- Python 3.11+
- Docker（可选，用于容器化部署）

**开始使用**
```bash
# 1. 克隆仓库
git clone https://github.com/AutoAgents-Algorithm-Group/Hera.git
cd Hera

# 2. 使设置脚本可执行并运行
chmod +x setup.sh
./setup.sh

# 3. 开始开发
make dev
```

## 部署
**Docker**
```bash
cd Hera
docker compose -f docker/docker-compose.yml up -d
```

**故障排除**
```bash
# 查看应用日志
docker compose -f docker/docker-compose.yml logs -f app

# 停止并删除旧容器
docker stop hera && docker rm hera
docker rmi hera-app
```

## 贡献

1. Fork 仓库
2. 创建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 许可证

该项目根据 MIT 许可证授权 - 有关详细信息，请参阅 [LICENSE](LICENSE) 文件。