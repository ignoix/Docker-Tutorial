# 🐬 MySQL 学习指南

本目录包含MySQL数据库服务器的配置和学习资料，用于Docker演示项目中的数据存储。

## 📋 目录内容

- `Dockerfile` - MySQL镜像构建文件
- `my.cnf` - MySQL配置文件（字符集设置）
- `init/` - 数据库初始化脚本目录
  - `01-create-user-table.sql` - 用户表创建和初始化数据脚本
- `README.md` - 本学习指南

## 🚀 MySQL 基础概念

### 什么是MySQL？

MySQL是最流行的开源关系型数据库管理系统（RDBMS），以其高性能、可靠性和易用性而闻名。它使用SQL（结构化查询语言）进行数据管理。

### 主要特性

- **开源免费**: 社区版完全免费使用
- **高性能**: 优化的查询引擎和索引机制
- **可靠性**: 事务支持和数据完整性保证
- **可扩展性**: 支持从单机到集群的扩展
- **跨平台**: 支持多种操作系统
- **多存储引擎**: InnoDB、MyISAM等

## 🔧 配置文件详解

### Dockerfile配置解析

```dockerfile
FROM mysql:8.0  # 基于MySQL 8.0官方镜像

# 设置环境变量
ENV MYSQL_ROOT_PASSWORD=root123      # Root用户密码
ENV MYSQL_DATABASE=docker_demo       # 默认数据库名
ENV MYSQL_USER=docker_user           # 应用用户
ENV MYSQL_PASSWORD=docker_pass       # 应用用户密码

# 设置字符集
ENV MYSQL_CHARSET=utf8mb4            # 字符集
ENV MYSQL_COLLATION=utf8mb4_unicode_ci  # 排序规则

# 复制初始化脚本
COPY init/ /docker-entrypoint-initdb.d/

# 复制MySQL配置文件
COPY my.cnf /etc/mysql/conf.d/

# 暴露端口
EXPOSE 3306
```

### my.cnf配置文件解析

```ini
[mysqld]
# 字符集设置
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci
init_connect='SET NAMES utf8mb4'

# 客户端字符集
[mysql]
default-character-set=utf8mb4

# 其他客户端
[client]
default-character-set=utf8mb4

# 连接设置
[mysqld]
max_connections=200          # 最大连接数
general_log=1               # 启用通用日志
slow_query_log=1            # 启用慢查询日志
long_query_time=2           # 慢查询阈值（秒）
log-bin=mysql-bin           # 启用二进制日志
innodb_buffer_pool_size=128M  # InnoDB缓冲池大小
```

## 🗄️ 数据库初始化

### 初始化脚本说明

`01-create-user-table.sql` 脚本包含：

1. **数据库创建**
   ```sql
   CREATE DATABASE IF NOT EXISTS docker_demo 
   CHARACTER SET utf8mb4 
   COLLATE utf8mb4_unicode_ci;
   ```

2. **用户表创建**
   ```sql
   CREATE TABLE IF NOT EXISTS users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(100) NOT NULL COMMENT '用户姓名',
       age INT NOT NULL COMMENT '用户年龄',
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';
   ```

3. **示例数据插入**
   ```sql
   INSERT INTO users (name, age) VALUES 
   ('张三', 25), ('李四', 30), ('王五', 28),
   ('赵六', 35), ('钱七', 22), ('孙八', 29),
   ('周九', 31), ('吴十', 27);
   ```

## 🔧 常用命令

### Docker环境下的MySQL操作

```bash
# 进入MySQL容器
docker-compose exec mysql bash

# 连接MySQL数据库
mysql -u root -p
mysql -u docker_user -pdocker_pass docker_demo

# 查看所有数据库
SHOW DATABASES;

# 使用特定数据库
USE docker_demo;

# 查看所有表
SHOW TABLES;

# 查看表结构
DESCRIBE users;
SHOW CREATE TABLE users;

# 查看表数据
SELECT * FROM users;

# 退出MySQL
EXIT;
```

### 直接执行SQL命令

```bash
# 执行SQL查询
docker-compose exec mysql mysql -u docker_user -pdocker_pass docker_demo -e "SELECT * FROM users;"

# 执行SQL文件
docker-compose exec mysql mysql -u docker_user -pdocker_pass docker_demo < /path/to/script.sql

# 备份数据库
docker-compose exec mysql mysqldump -u root -proot123 docker_demo > backup.sql

# 恢复数据库
docker-compose exec mysql mysql -u root -proot123 docker_demo < backup.sql
```

## 📊 数据库管理

### 用户管理

```sql
-- 创建用户
CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password';

-- 授权
GRANT ALL PRIVILEGES ON docker_demo.* TO 'newuser'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES;

-- 查看用户
SELECT User, Host FROM mysql.user;

-- 删除用户
DROP USER 'newuser'@'localhost';
```

### 数据库操作

```sql
-- 创建数据库
CREATE DATABASE new_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 删除数据库
DROP DATABASE new_database;

-- 查看数据库信息
SHOW CREATE DATABASE docker_demo;

-- 查看数据库大小
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
GROUP BY table_schema;
```

### 表操作

```sql
-- 创建表
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 修改表结构
ALTER TABLE users ADD COLUMN email VARCHAR(100);
ALTER TABLE users MODIFY COLUMN age INT UNSIGNED;
ALTER TABLE users DROP COLUMN email;

-- 创建索引
CREATE INDEX idx_name ON users(name);
CREATE UNIQUE INDEX idx_email ON users(email);

-- 查看索引
SHOW INDEX FROM users;

-- 删除索引
DROP INDEX idx_name ON users;
```

## 🔍 查询操作

### 基本查询

```sql
-- 查询所有数据
SELECT * FROM users;

-- 条件查询
SELECT * FROM users WHERE age > 25;
SELECT * FROM users WHERE name LIKE '张%';

-- 排序
SELECT * FROM users ORDER BY age DESC;
SELECT * FROM users ORDER BY created_at ASC;

-- 限制结果
SELECT * FROM users LIMIT 5;
SELECT * FROM users LIMIT 5, 10;  -- 跳过5条，取10条

-- 去重
SELECT DISTINCT age FROM users;
```

### 聚合查询

```sql
-- 计数
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM users WHERE age > 25;

-- 统计
SELECT 
    COUNT(*) as total,
    AVG(age) as avg_age,
    MIN(age) as min_age,
    MAX(age) as max_age
FROM users;

-- 分组
SELECT age, COUNT(*) FROM users GROUP BY age;
SELECT age, COUNT(*) FROM users GROUP BY age HAVING COUNT(*) > 1;
```

### 连接查询

```sql
-- 内连接
SELECT u.name, p.product_name 
FROM users u 
INNER JOIN purchases p ON u.id = p.user_id;

-- 左连接
SELECT u.name, p.product_name 
FROM users u 
LEFT JOIN purchases p ON u.id = p.user_id;

-- 右连接
SELECT u.name, p.product_name 
FROM users u 
RIGHT JOIN purchases p ON u.id = p.user_id;
```

## 📝 数据操作

### 插入数据

```sql
-- 插入单条记录
INSERT INTO users (name, age) VALUES ('新用户', 30);

-- 插入多条记录
INSERT INTO users (name, age) VALUES 
('用户1', 25),
('用户2', 30),
('用户3', 35);

-- 插入时忽略重复键
INSERT IGNORE INTO users (id, name, age) VALUES (1, '重复用户', 25);
```

### 更新数据

```sql
-- 更新单条记录
UPDATE users SET age = 26 WHERE id = 1;

-- 更新多条记录
UPDATE users SET age = age + 1 WHERE age < 30;

-- 使用子查询更新
UPDATE users SET age = (
    SELECT AVG(age) FROM users
) WHERE id = 1;
```

### 删除数据

```sql
-- 删除单条记录
DELETE FROM users WHERE id = 1;

-- 删除多条记录
DELETE FROM users WHERE age < 25;

-- 清空表
TRUNCATE TABLE users;

-- 删除表
DROP TABLE users;
```

## 🔒 事务管理

### 事务操作

```sql
-- 开始事务
START TRANSACTION;

-- 执行操作
INSERT INTO users (name, age) VALUES ('事务用户', 30);
UPDATE users SET age = 31 WHERE name = '事务用户';

-- 提交事务
COMMIT;

-- 回滚事务
ROLLBACK;
```

### 事务隔离级别

```sql
-- 查看当前隔离级别
SELECT @@transaction_isolation;

-- 设置隔离级别
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SET GLOBAL TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```

## 📊 性能优化

### 索引优化

```sql
-- 查看表索引
SHOW INDEX FROM users;

-- 分析表
ANALYZE TABLE users;

-- 优化表
OPTIMIZE TABLE users;

-- 查看查询执行计划
EXPLAIN SELECT * FROM users WHERE age > 25;
```

### 查询优化

```sql
-- 使用LIMIT限制结果
SELECT * FROM users LIMIT 100;

-- 避免SELECT *
SELECT id, name, age FROM users;

-- 使用适当的WHERE条件
SELECT * FROM users WHERE id = 1;  -- 使用主键
SELECT * FROM users WHERE name = '张三';  -- 使用索引字段

-- 使用EXISTS代替IN
SELECT * FROM users u WHERE EXISTS (
    SELECT 1 FROM orders o WHERE o.user_id = u.id
);
```

## 🔍 监控和日志

### 查看状态

```sql
-- 查看服务器状态
SHOW STATUS;

-- 查看变量
SHOW VARIABLES;

-- 查看进程列表
SHOW PROCESSLIST;

-- 查看当前连接
SHOW STATUS LIKE 'Connections';
SHOW STATUS LIKE 'Threads_connected';
```

### 日志分析

```bash
# 查看错误日志
docker-compose logs mysql

# 查看慢查询日志
docker-compose exec mysql cat /var/log/mysql/slow.log

# 查看通用日志
docker-compose exec mysql cat /var/log/mysql/general.log
```

## 🛠️ 故障排除

### 常见问题

1. **连接失败**
   ```bash
   # 检查MySQL服务状态
   docker-compose ps mysql
   
   # 检查端口是否开放
   netstat -tlnp | grep 3306
   ```

2. **字符集问题**
   ```sql
   -- 检查字符集设置
   SHOW VARIABLES LIKE 'character%';
   
   -- 检查数据库字符集
   SHOW CREATE DATABASE docker_demo;
   ```

3. **权限问题**
   ```sql
   -- 查看用户权限
   SHOW GRANTS FOR 'docker_user'@'%';
   
   -- 重新授权
   GRANT ALL PRIVILEGES ON docker_demo.* TO 'docker_user'@'%';
   FLUSH PRIVILEGES;
   ```

### 性能问题

```sql
-- 查看慢查询
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time';

-- 查看表大小
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'docker_demo';
```

## 📚 学习资源

### 官方文档
- [MySQL官方文档](https://dev.mysql.com/doc/)
- [MySQL 8.0参考手册](https://dev.mysql.com/doc/refman/8.0/en/)

### 推荐教程
- [MySQL Tutorial](https://dev.mysql.com/doc/refman/8.0/en/tutorial.html)
- [MySQL Performance Tuning](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)

### 实用工具
- [MySQL Workbench](https://www.mysql.com/products/workbench/)
- [phpMyAdmin](https://www.phpmyadmin.net/)
- [Adminer](https://www.adminer.org/)

## 🎯 实践练习

### 练习1: 基础操作
1. 创建新的数据库和表
2. 插入、查询、更新、删除数据
3. 练习基本的SQL语句

### 练习2: 高级查询
1. 使用JOIN连接多个表
2. 练习子查询和聚合函数
3. 优化查询性能

### 练习3: 数据库设计
1. 设计合理的表结构
2. 创建适当的索引
3. 实现数据完整性约束

---

**Happy MySQL Learning! 🐬**
