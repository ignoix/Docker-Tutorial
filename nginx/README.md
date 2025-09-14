# 🌐 Nginx 学习指南

本目录包含Nginx反向代理服务器的配置和学习资料，用于Docker演示项目中的静态文件服务和API代理。

## 📋 目录内容

- `Dockerfile` - Nginx镜像构建文件
- `nginx.conf` - Nginx主配置文件
- `README.md` - 本学习指南

## 🚀 Nginx 基础概念

### 什么是Nginx？

Nginx（发音为"engine-x"）是一个高性能的Web服务器、反向代理服务器和邮件代理服务器。它以其高并发、低内存占用和稳定性而闻名。

### 主要特性

- **高性能**: 采用事件驱动架构，支持高并发连接
- **反向代理**: 将客户端请求转发到后端服务器
- **负载均衡**: 在多个后端服务器间分配请求
- **静态文件服务**: 高效提供静态资源
- **SSL/TLS终止**: 处理HTTPS加密
- **缓存**: 提供内容缓存功能

## 🔧 配置文件详解

### 主配置文件结构

```nginx
events {
    # 事件模块配置
}

http {
    # HTTP模块配置
    server {
        # 虚拟主机配置
    }
}
```

### 本项目配置解析

#### 1. 事件模块配置
```nginx
events {
    worker_connections 1024;  # 每个工作进程的最大连接数
}
```

#### 2. HTTP模块基础配置
```nginx
http {
    include       /etc/nginx/mime.types;  # 包含MIME类型定义
    default_type  application/octet-stream;  # 默认MIME类型
    
    # 日志格式定义
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    # 访问日志和错误日志
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;
}
```

#### 3. 性能优化配置
```nginx
# 基本设置
sendfile on;           # 高效文件传输
tcp_nopush on;         # 优化TCP传输
tcp_nodelay on;        # 减少延迟
keepalive_timeout 65;  # 保持连接超时时间
types_hash_max_size 2048;  # 类型哈希表大小
```

#### 4. Gzip压缩配置
```nginx
gzip on;                    # 启用Gzip压缩
gzip_vary on;               # 添加Vary头
gzip_min_length 1024;       # 最小压缩文件大小
gzip_proxied any;           # 代理请求也压缩
gzip_comp_level 6;          # 压缩级别(1-9)
gzip_types                  # 压缩的文件类型
    text/plain
    text/css
    text/xml
    text/javascript
    application/json
    application/javascript
    application/xml+rss
    application/atom+xml
    image/svg+xml;
```

## 🔄 反向代理配置

### 上游服务器定义
```nginx
upstream api_backend {
    server nodejs:3000;  # 后端API服务器
}
```

### 代理配置
```nginx
location /api/ {
    proxy_pass http://api_backend;           # 代理到上游服务器
    proxy_http_version 1.1;                  # HTTP版本
    proxy_set_header Upgrade $http_upgrade;  # WebSocket支持
    proxy_set_header Connection 'upgrade';   # 连接升级
    proxy_set_header Host $host;             # 传递主机头
    proxy_set_header X-Real-IP $remote_addr; # 真实IP
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  # 转发链
    proxy_set_header X-Forwarded-Proto $scheme;  # 协议类型
    proxy_cache_bypass $http_upgrade;        # 缓存绕过
    
    # 超时设置
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
```

## 📁 静态文件服务

### 静态文件配置
```nginx
location / {
    root /usr/share/nginx/html;  # 静态文件根目录
    index index.html;            # 默认首页
    try_files $uri $uri/ /index.html;  # SPA路由支持
}

# 静态资源缓存
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;                              # 缓存1年
    add_header Cache-Control "public, immutable";  # 缓存控制头
}
```

## 🛡️ 安全配置

### 基本安全设置
```nginx
# 隐藏Nginx版本
server_tokens off;

# 安全头设置
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;

# 限制请求大小
client_max_body_size 10M;

# 限制请求频率
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req zone=api burst=20 nodelay;
```

## 📊 监控和日志

### 访问日志分析
```bash
# 查看访问日志
tail -f /var/log/nginx/access.log

# 统计访问量
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr

# 查看错误日志
tail -f /var/log/nginx/error.log
```

### 状态监控
```nginx
# 启用状态页面
location /nginx_status {
    stub_status on;
    access_log off;
    allow 127.0.0.1;
    deny all;
}
```

## 🔧 常用命令

### Nginx控制命令
```bash
# 启动Nginx
nginx

# 停止Nginx
nginx -s stop

# 重新加载配置
nginx -s reload

# 测试配置文件
nginx -t

# 查看版本信息
nginx -v

# 查看编译信息
nginx -V
```

### Docker环境下的命令
```bash
# 进入Nginx容器
docker-compose exec nginx sh

# 查看Nginx配置
docker-compose exec nginx nginx -T

# 重新加载配置
docker-compose exec nginx nginx -s reload

# 查看日志
docker-compose logs nginx
```

## 🚀 性能优化

### 1. 工作进程优化
```nginx
# 设置工作进程数量（通常等于CPU核心数）
worker_processes auto;

# 设置每个进程的最大连接数
events {
    worker_connections 1024;
    use epoll;  # Linux下使用epoll
}
```

### 2. 缓存优化
```nginx
# 启用代理缓存
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;

location /api/ {
    proxy_cache my_cache;
    proxy_cache_valid 200 302 10m;
    proxy_cache_valid 404 1m;
}
```

### 3. 连接优化
```nginx
# 启用keepalive
upstream backend {
    server 127.0.0.1:3000;
    keepalive 32;
}
```

## 🔍 故障排除

### 常见问题

1. **配置文件语法错误**
   ```bash
   nginx -t  # 测试配置文件
   ```

2. **端口被占用**
   ```bash
   netstat -tlnp | grep :80
   lsof -i :80
   ```

3. **权限问题**
   ```bash
   # 确保Nginx有读取文件的权限
   chmod -R 755 /usr/share/nginx/html
   ```

4. **代理连接失败**
   ```bash
   # 检查后端服务是否运行
   curl http://backend:3000/health
   ```

### 调试技巧

1. **启用详细日志**
   ```nginx
   error_log /var/log/nginx/error.log debug;
   ```

2. **添加调试头**
   ```nginx
   add_header X-Debug-Backend $upstream_addr;
   add_header X-Debug-Status $upstream_status;
   ```

## 📚 学习资源

### 官方文档
- [Nginx官方文档](https://nginx.org/en/docs/)
- [Nginx配置参考](https://nginx.org/en/docs/dirindex.html)

### 推荐教程
- [Nginx Beginner's Guide](https://nginx.org/en/docs/beginners_guide.html)
- [Nginx Admin's Guide](https://nginx.org/en/docs/http/)

### 实用工具
- [Nginx配置生成器](https://nginxconfig.io/)
- [Nginx配置测试工具](https://nginx.viraptor.info/)

## 🎯 实践练习

### 练习1: 基本静态文件服务
1. 创建简单的HTML页面
2. 配置Nginx提供静态文件服务
3. 测试访问和缓存效果

### 练习2: 反向代理配置
1. 配置多个后端服务
2. 实现负载均衡
3. 测试故障转移

### 练习3: 性能优化
1. 启用Gzip压缩
2. 配置缓存策略
3. 监控性能指标

---

**Happy Nginx Learning! 🌐**
