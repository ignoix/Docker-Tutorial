# 🚀 Node.js & Koa2 学习指南

本目录包含Node.js API服务的配置和学习资料，用于Docker演示项目中的后端API服务。

## 📋 目录内容

- `Dockerfile` - Node.js镜像构建文件
- `package.json` - 项目依赖配置
- `app.js` - 主应用文件（Koa2服务器）
- `config.js` - 配置文件
- `README.md` - 本学习指南

## 🌟 Node.js 基础概念

### 什么是Node.js？

Node.js是一个基于Chrome V8 JavaScript引擎的JavaScript运行时环境，允许在服务器端运行JavaScript代码。它采用事件驱动、非阻塞I/O模型，非常适合构建高性能的网络应用程序。

### 主要特性

- **事件驱动**: 基于事件循环的异步编程模型
- **非阻塞I/O**: 高效的I/O操作，不会阻塞主线程
- **单线程**: 主线程处理请求，工作线程处理I/O
- **跨平台**: 支持Windows、macOS、Linux
- **丰富的生态系统**: npm包管理器，海量开源包
- **JSON友好**: 原生支持JSON数据格式

### 适用场景

- **Web API服务**: RESTful API、GraphQL
- **实时应用**: 聊天室、在线游戏
- **微服务**: 小型、独立的服务
- **工具开发**: 构建工具、CLI工具
- **IoT应用**: 物联网设备控制

## 🔧 项目配置详解

### Dockerfile配置解析

```dockerfile
FROM node:18-alpine  # 基于Node.js 18 Alpine镜像

# 安装wget用于健康检查
RUN apk add --no-cache wget

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制应用代码
COPY . .

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# 更改文件所有者
RUN chown -R nodejs:nodejs /app
USER nodejs

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
```

### package.json配置解析

```json
{
  "name": "docker-demo-api",
  "version": "1.0.0",
  "description": "Docker Demo API with Koa2 and MySQL",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "dependencies": {
    "koa": "^2.14.2",           // Koa2框架
    "koa-router": "^12.0.0",    // 路由中间件
    "koa-bodyparser": "^4.4.1", // 请求体解析
    "koa-cors": "^0.0.16",      // CORS跨域处理
    "mysql2": "^3.6.5",         // MySQL数据库驱动
    "dotenv": "^16.3.1"         // 环境变量管理
  }
}
```

## 🌐 Koa2 框架详解

### 什么是Koa2？

Koa2是Express团队设计的下一代Web框架，基于ES6+的async/await语法，提供了更优雅的异步处理方式。相比Express，Koa2更加轻量、灵活。

### Koa2 vs Express

| 特性 | Koa2 | Express |
|------|------|---------|
| 中间件模型 | 洋葱模型 | 线性模型 |
| 异步处理 | async/await | 回调函数 |
| 错误处理 | 统一错误处理 | 分散错误处理 |
| 体积 | 轻量 | 较重 |
| 学习曲线 | 较陡 | 平缓 |

### 核心概念

1. **Context对象**: 封装了request和response对象
2. **中间件**: 处理HTTP请求的函数
3. **洋葱模型**: 中间件的执行顺序
4. **错误处理**: 统一的错误处理机制

## 🏗️ 项目架构解析

### 应用结构

```javascript
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');
const mysql = require('mysql2/promise');

const app = new Koa();
const router = new Router();

// 中间件配置
app.use(cors());
app.use(bodyParser());

// 路由配置
app.use(router.routes()).use(router.allowedMethods());

// 启动服务器
app.listen(3000);
```

### 中间件详解

#### 1. CORS中间件
```javascript
const cors = require('koa-cors');
app.use(cors());  // 处理跨域请求
```

#### 2. 请求体解析中间件
```javascript
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());  // 解析JSON和表单数据
```

#### 3. 自定义中间件
```javascript
// 日志中间件
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// 错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { error: err.message };
  }
});
```

## 🗄️ 数据库连接

### 连接池配置

```javascript
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'mysql',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'docker_user',
  password: process.env.DB_PASSWORD || 'docker_pass',
  database: process.env.DB_NAME || 'docker_demo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);
```

### 数据库操作

```javascript
// 查询操作
const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);

// 插入操作
const [result] = await pool.execute(
  'INSERT INTO users (name, age) VALUES (?, ?)',
  [name, age]
);

// 更新操作
const [result] = await pool.execute(
  'UPDATE users SET name = ?, age = ? WHERE id = ?',
  [name, age, id]
);

// 删除操作
const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
```

## 🛣️ 路由设计

### RESTful API设计

```javascript
// 获取所有用户
router.get('/api/users', async (ctx) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM users ORDER BY id DESC');
    ctx.body = {
      success: true,
      data: rows
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: '获取用户列表失败',
      error: error.message
    };
  }
});

// 获取单个用户
router.get('/api/users/:id', async (ctx) => {
  const { id } = ctx.params;
  // 处理逻辑...
});

// 创建用户
router.post('/api/users', async (ctx) => {
  const { name, age } = ctx.request.body;
  // 处理逻辑...
});

// 更新用户
router.put('/api/users/:id', async (ctx) => {
  const { id } = ctx.params;
  const { name, age } = ctx.request.body;
  // 处理逻辑...
});

// 删除用户
router.delete('/api/users/:id', async (ctx) => {
  const { id } = ctx.params;
  // 处理逻辑...
});
```

### 路由参数处理

```javascript
// 路径参数
router.get('/users/:id', async (ctx) => {
  const { id } = ctx.params;  // 获取路径参数
  const { page, limit } = ctx.query;  // 获取查询参数
});

// 请求体参数
router.post('/users', async (ctx) => {
  const { name, age, email } = ctx.request.body;  // 获取请求体
});
```

## 🔒 错误处理

### 统一错误处理

```javascript
// 全局错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // 记录错误日志
    console.error('Error:', err);
    
    // 设置响应状态码
    ctx.status = err.status || 500;
    
    // 返回错误信息
    ctx.body = {
      success: false,
      message: err.message || '服务器内部错误',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };
  }
});
```

### 自定义错误类

```javascript
class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
    this.name = 'AppError';
  }
}

// 使用自定义错误
if (!name || !age) {
  throw new AppError('姓名和年龄不能为空', 400);
}
```

## 📊 响应格式

### 统一响应格式

```javascript
// 成功响应
ctx.body = {
  success: true,
  data: result,
  message: '操作成功'
};

// 错误响应
ctx.body = {
  success: false,
  message: '错误信息',
  error: error.message
};

// 分页响应
ctx.body = {
  success: true,
  data: {
    list: rows,
    pagination: {
      page: page,
      limit: limit,
      total: total,
      pages: Math.ceil(total / limit)
    }
  }
};
```

## 🔧 常用中间件

### 1. 请求日志中间件

```javascript
const logger = async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
};

app.use(logger);
```

### 2. 响应时间中间件

```javascript
const responseTime = async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
};

app.use(responseTime);
```

### 3. 请求验证中间件

```javascript
const validateUser = async (ctx, next) => {
  const { name, age } = ctx.request.body;
  
  if (!name || !age) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      message: '姓名和年龄不能为空'
    };
    return;
  }
  
  if (age < 1 || age > 120) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      message: '年龄必须在1-120之间'
    };
    return;
  }
  
  await next();
};
```

## 🚀 性能优化

### 1. 连接池优化

```javascript
const pool = mysql.createPool({
  host: 'mysql',
  port: 3306,
  user: 'docker_user',
  password: 'docker_pass',
  database: 'docker_demo',
  waitForConnections: true,
  connectionLimit: 20,        // 增加连接池大小
  queueLimit: 0,
  acquireTimeout: 60000,      // 获取连接超时
  timeout: 60000,             // 查询超时
  reconnect: true             // 自动重连
});
```

### 2. 缓存中间件

```javascript
const cache = new Map();

const cacheMiddleware = (ttl = 300000) => { // 5分钟缓存
  return async (ctx, next) => {
    const key = ctx.url;
    const cached = cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      ctx.body = cached.data;
      return;
    }
    
    await next();
    
    if (ctx.status === 200) {
      cache.set(key, {
        data: ctx.body,
        timestamp: Date.now()
      });
    }
  };
};
```

### 3. 压缩中间件

```javascript
const compress = require('koa-compress');

app.use(compress({
  filter: (contentType) => {
    return /text/i.test(contentType);
  },
  threshold: 2048,
  gzip: {
    flush: require('zlib').constants.Z_SYNC_FLUSH
  },
  deflate: {
    flush: require('zlib').constants.Z_SYNC_FLUSH,
  },
  br: false // 禁用brotli
}));
```

## 🔍 调试和测试

### 调试配置

```javascript
// 开发环境调试
if (process.env.NODE_ENV === 'development') {
  app.use(async (ctx, next) => {
    console.log('Request:', ctx.method, ctx.url);
    console.log('Headers:', ctx.headers);
    console.log('Body:', ctx.request.body);
    await next();
    console.log('Response:', ctx.status, ctx.body);
  });
}
```

### 单元测试示例

```javascript
const request = require('supertest');
const app = require('./app');

describe('User API', () => {
  test('GET /api/users should return users list', async () => {
    const response = await request(app.callback())
      .get('/api/users')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
  
  test('POST /api/users should create new user', async () => {
    const userData = { name: '测试用户', age: 25 };
    
    const response = await request(app.callback())
      .post('/api/users')
      .send(userData)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe(userData.name);
  });
});
```

## 🛠️ 常用命令

### 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 启动生产服务器
npm start

# 运行测试
npm test

# 代码检查
npm run lint

# 构建项目
npm run build
```

### Docker命令

```bash
# 构建镜像
docker build -t nodejs-api .

# 运行容器
docker run -p 3000:3000 nodejs-api

# 查看日志
docker logs <container_id>

# 进入容器
docker exec -it <container_id> sh
```

## 📚 学习资源

### 官方文档
- [Node.js官方文档](https://nodejs.org/en/docs/)
- [Koa.js官方文档](https://koajs.com/)
- [MySQL2文档](https://github.com/sidorares/node-mysql2)

### 推荐教程
- [Node.js入门教程](https://nodejs.org/en/learn/)
- [Koa.js指南](https://koajs.com/#introduction)
- [Express到Koa迁移指南](https://github.com/koajs/koa/wiki/Migrating-from-Express)

### 实用工具
- [Postman](https://www.postman.com/) - API测试工具
- [Insomnia](https://insomnia.rest/) - API客户端
- [Thunder Client](https://www.thunderclient.com/) - VS Code插件

## 🎯 实践练习

### 练习1: 基础API开发
1. 创建用户CRUD API
2. 添加数据验证
3. 实现错误处理

### 练习2: 中间件开发
1. 创建日志中间件
2. 实现认证中间件
3. 添加缓存中间件

### 练习3: 性能优化
1. 优化数据库查询
2. 实现连接池
3. 添加缓存机制

---

**Happy Node.js & Koa2 Learning! 🚀**
