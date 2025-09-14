# 🐳 Docker 学习演示项目

这是一个完整的Docker和Docker Compose学习演示项目，展示了如何使用Docker容器化技术构建一个微服务架构的用户管理系统。

## 📋 项目概述

本项目包含以下组件：
- **MySQL数据库**：存储用户数据，支持UTF-8字符集
- **Node.js API服务**：基于Koa2框架的RESTful API
- **前端页面**：响应式Web界面
- **Nginx反向代理**：负载均衡和静态文件服务

## ✨ 项目特色

- **完整的微服务架构**：展示Docker容器化最佳实践
- **中文支持**：MySQL配置UTF-8字符集，完美支持中文数据
- **健康检查**：所有服务都配置了健康检查机制
- **数据持久化**：使用Docker数据卷保存MySQL数据
- **现代化UI**：响应式前端界面，支持增删改查操作

## 🏗️ 项目架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx (80)    │────│  Node.js (3000) │────│   MySQL (3306)  │
│   反向代理       │    │   API服务        │    │   数据库         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌─────────┐              ┌─────────┐              ┌─────────┐
    │ 前端页面 │              │ 用户CRUD │              │ 用户数据 │
    │ 静态文件 │              │ 接口服务 │              │ 持久化   │
    └─────────┘              └─────────┘              └─────────┘
```

## 📁 项目结构

```
Docker-Tutorial/
├── mysql/                    # MySQL数据库配置
│   ├── Dockerfile           # MySQL镜像构建文件
│   ├── my.cnf               # MySQL配置文件（字符集设置）
│   └── init/                # 数据库初始化脚本
│       └── 01-create-user-table.sql
├── nodejs/                   # Node.js API服务
│   ├── Dockerfile           # Node.js镜像构建文件
│   ├── package.json         # 依赖配置
│   ├── app.js              # 主应用文件
│   └── config.js           # 配置文件
├── frontend/                # 前端页面
│   └── index.html          # 用户管理界面
├── nginx/                   # Nginx配置
│   ├── Dockerfile          # Nginx镜像构建文件
│   └── nginx.conf          # Nginx配置文件
├── docker-compose.yml       # Docker Compose编排文件
├── .dockerignore           # Docker忽略文件
└── README.md               # 项目说明文档
```

## 🚀 快速开始

### 前置要求

- Docker Desktop (推荐版本 20.10+)
- Docker Compose (推荐版本 2.0+)

### 1. 克隆项目

```bash
git clone <repository-url>
cd Docker-Tutorial
```

### 2. 启动所有服务

```bash
# 构建并启动所有服务
docker-compose up --build

# 后台运行
docker-compose up -d --build
```

### 3. 访问应用

- **前端页面**: http://localhost
- **API接口**: http://localhost/api
- **健康检查**: http://localhost/health
- **MySQL数据库**: localhost:3306

### 4. 停止服务

```bash
# 停止所有服务
docker-compose down

# 停止并删除数据卷
docker-compose down -v
```

## 🛠️ Docker 命令详解

### 基础Docker命令

```bash
# 查看Docker版本
docker --version
docker-compose --version

# 查看Docker信息
docker info

# 查看运行中的容器
docker ps

# 查看所有容器（包括停止的）
docker ps -a

# 查看Docker镜像
docker images

# 查看Docker网络
docker network ls

# 查看Docker数据卷
docker volume ls
```

### 镜像管理

```bash
# 构建镜像
docker build -t <镜像名> <构建上下文路径>

# 构建指定Dockerfile
docker build -f <Dockerfile路径> -t <镜像名> <构建上下文路径>

# 查看镜像详细信息
docker inspect <镜像名>

# 删除镜像
docker rmi <镜像名>

# 删除所有未使用的镜像
docker image prune -a
```

### 容器管理

```bash
# 运行容器
docker run -d -p <主机端口>:<容器端口> <镜像名>

# 运行容器并指定名称
docker run -d --name <容器名> -p <主机端口>:<容器端口> <镜像名>

# 运行容器并挂载数据卷
docker run -d -v <主机路径>:<容器路径> <镜像名>

# 运行容器并设置环境变量
docker run -d -e <环境变量名>=<值> <镜像名>

# 进入运行中的容器
docker exec -it <容器名> /bin/bash

# 查看容器日志
docker logs <容器名>

# 查看容器详细信息
docker inspect <容器名>

# 停止容器
docker stop <容器名>

# 启动已停止的容器
docker start <容器名>

# 重启容器
docker restart <容器名>

# 删除容器
docker rm <容器名>

# 删除所有停止的容器
docker container prune
```

### Docker Compose命令

```bash
# 启动所有服务
docker-compose up

# 后台启动所有服务
docker-compose up -d

# 构建并启动服务
docker-compose up --build

# 启动指定服务
docker-compose up <服务名>

# 停止所有服务
docker-compose down

# 停止并删除数据卷
docker-compose down -v

# 查看服务状态
docker-compose ps

# 查看服务日志
docker-compose logs

# 查看指定服务日志
docker-compose logs <服务名>

# 实时查看日志
docker-compose logs -f

# 进入服务容器
docker-compose exec <服务名> /bin/bash

# 重启服务
docker-compose restart <服务名>

# 扩展服务实例
docker-compose up --scale <服务名>=<数量>

# 查看服务配置
docker-compose config

# 验证配置文件
docker-compose config --quiet
```

## 🔧 服务配置说明

### MySQL服务

- **端口**: 3306
- **数据库**: docker_demo
- **用户名**: docker_user
- **密码**: docker_pass
- **Root密码**: root123
- **字符集**: utf8mb4
- **排序规则**: utf8mb4_unicode_ci
- **字符集配置**: 通过my.cnf配置文件设置，支持中文存储

### Node.js API服务

- **端口**: 3000
- **框架**: Koa2
- **数据库**: 连接MySQL服务
- **API端点**:
  - `GET /api/users` - 获取所有用户
  - `GET /api/users/:id` - 获取指定用户
  - `POST /api/users` - 创建用户
  - `PUT /api/users/:id` - 更新用户
  - `DELETE /api/users/:id` - 删除用户
  - `GET /health` - 健康检查

### Nginx服务

- **端口**: 80
- **功能**: 反向代理、静态文件服务
- **配置**: 自动代理API请求到Node.js服务

## 🔤 字符集配置

本项目已配置MySQL使用UTF-8字符集，支持中文数据存储。配置包括：

- **my.cnf**: 设置服务器字符集为utf8mb4
- **Dockerfile**: 设置环境变量MYSQL_CHARSET=utf8mb4
- **初始化脚本**: 数据库和表都使用utf8mb4字符集

如遇中文乱码，执行：`docker-compose down -v && docker-compose up --build -d`

## 🐛 故障排除

### 常见问题

1. **端口冲突**
   ```bash
   # 检查端口占用
   lsof -i :80
   lsof -i :3000
   lsof -i :3306
   
   # 修改docker-compose.yml中的端口映射
   ```

2. **容器启动失败**
   ```bash
   # 查看容器日志
   docker-compose logs <服务名>
   
   # 查看详细错误信息
   docker-compose logs --tail=50 <服务名>
   ```

3. **数据库连接失败**
   ```bash
   # 检查MySQL容器状态
   docker-compose ps mysql
   
   # 检查MySQL日志
   docker-compose logs mysql
   
   # 进入MySQL容器检查
   docker-compose exec mysql mysql -u root -p
   ```

4. **API服务无法访问**
   ```bash
   # 检查API服务状态
   docker-compose ps nodejs
   
   # 检查API服务日志
   docker-compose logs nodejs
   
   # 测试API连接
   curl http://localhost:3000/health
   ```

5. **MySQL中文乱码问题**
   ```bash
   # 清理数据卷重新初始化
   docker-compose down -v
   docker-compose up --build -d
   ```

### 清理命令

```bash
# 停止并删除所有容器、网络、数据卷
docker-compose down -v --remove-orphans

# 删除所有未使用的资源
docker system prune -a

# 删除所有数据卷
docker volume prune

# 删除所有网络
docker network prune
```

## 📚 学习要点

### Docker核心概念

1. **镜像(Image)**: 只读的模板，用于创建容器
2. **容器(Container)**: 镜像的运行实例
3. **数据卷(Volume)**: 持久化数据存储
4. **网络(Network)**: 容器间通信
5. **Dockerfile**: 构建镜像的指令文件

### Docker Compose核心概念

1. **服务(Service)**: 定义容器如何运行
2. **网络(Network)**: 服务间通信
3. **数据卷(Volume)**: 数据持久化
4. **依赖关系**: 服务启动顺序
5. **健康检查**: 服务状态监控

### 最佳实践

1. **多阶段构建**: 减小镜像大小
2. **非root用户**: 提高安全性
3. **健康检查**: 确保服务可用性
4. **数据卷**: 持久化重要数据
5. **环境变量**: 配置外部化
6. **网络隔离**: 提高安全性
7. **字符集配置**: 数据库使用UTF-8字符集，支持国际化

## 🔄 开发流程

### 本地开发

1. 修改代码
2. 重新构建镜像: `docker-compose build <服务名>`
3. 重启服务: `docker-compose up -d <服务名>`

### 生产部署

1. 修改环境变量
2. 构建生产镜像
3. 使用生产级配置
4. 设置监控和日志

## 📖 扩展学习

- [Docker官方文档](https://docs.docker.com/)
- [Docker Compose文档](https://docs.docker.com/compose/)
- [Docker最佳实践](https://docs.docker.com/develop/dev-best-practices/)
- [Koa.js文档](https://koajs.com/)
- [Nginx文档](https://nginx.org/en/docs/)

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

MIT License

---

**Happy Docker Learning! 🐳**
