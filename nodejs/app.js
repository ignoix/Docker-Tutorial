const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = new Koa();
const router = new Router();

// 数据库连接配置
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

// 创建数据库连接池
const pool = mysql.createPool(dbConfig);

// 中间件
app.use(cors());
app.use(bodyParser());

// 健康检查
router.get('/health', async (ctx) => {
  ctx.body = { status: 'OK', message: 'API服务运行正常' };
});

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

// 根据ID获取用户
router.get('/api/users/:id', async (ctx) => {
  try {
    const { id } = ctx.params;
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: '用户不存在'
      };
      return;
    }
    
    ctx.body = {
      success: true,
      data: rows[0]
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: '获取用户信息失败',
      error: error.message
    };
  }
});

// 创建用户
router.post('/api/users', async (ctx) => {
  try {
    const { name, age } = ctx.request.body;
    
    if (!name || !age) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: '姓名和年龄不能为空'
      };
      return;
    }
    
    const [result] = await pool.execute(
      'INSERT INTO users (name, age) VALUES (?, ?)',
      [name, age]
    );
    
    ctx.status = 201;
    ctx.body = {
      success: true,
      message: '用户创建成功',
      data: {
        id: result.insertId,
        name,
        age
      }
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: '创建用户失败',
      error: error.message
    };
  }
});

// 更新用户
router.put('/api/users/:id', async (ctx) => {
  try {
    const { id } = ctx.params;
    const { name, age } = ctx.request.body;
    
    if (!name || !age) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: '姓名和年龄不能为空'
      };
      return;
    }
    
    const [result] = await pool.execute(
      'UPDATE users SET name = ?, age = ? WHERE id = ?',
      [name, age, id]
    );
    
    if (result.affectedRows === 0) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: '用户不存在'
      };
      return;
    }
    
    ctx.body = {
      success: true,
      message: '用户更新成功',
      data: { id, name, age }
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: '更新用户失败',
      error: error.message
    };
  }
});

// 删除用户
router.delete('/api/users/:id', async (ctx) => {
  try {
    const { id } = ctx.params;
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: '用户不存在'
      };
      return;
    }
    
    ctx.body = {
      success: true,
      message: '用户删除成功'
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: '删除用户失败',
      error: error.message
    };
  }
});

// 使用路由
app.use(router.routes()).use(router.allowedMethods());

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API服务器运行在端口 ${PORT}`);
});

// 优雅关闭
process.on('SIGTERM', async () => {
  console.log('正在关闭API服务器...');
  await pool.end();
  process.exit(0);
});
