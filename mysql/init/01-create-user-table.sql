-- 创建数据库，指定字符集
CREATE DATABASE IF NOT EXISTS docker_demo 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE docker_demo;

-- 创建用户表，指定字符集
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '用户姓名',
    age INT NOT NULL COMMENT '用户年龄',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 插入示例数据
INSERT INTO users (name, age) VALUES 
('张三', 25),
('李四', 30),
('王五', 28),
('赵六', 35),
('钱七', 22),
('孙八', 29),
('周九', 31),
('吴十', 27);
