FROM mysql:8.0

# 设置环境变量
ENV MYSQL_ROOT_PASSWORD=root123
ENV MYSQL_DATABASE=docker_demo
ENV MYSQL_USER=docker_user
ENV MYSQL_PASSWORD=docker_pass

# 设置字符集
ENV MYSQL_CHARSET=utf8mb4
ENV MYSQL_COLLATION=utf8mb4_unicode_ci

# 复制初始化脚本
COPY init/ /docker-entrypoint-initdb.d/

# 复制MySQL配置文件
COPY my.cnf /etc/mysql/conf.d/

# 暴露端口
EXPOSE 3306
