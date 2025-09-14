FROM nginx:alpine

# 复制自定义配置文件
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# 复制前端文件
COPY frontend/ /usr/share/nginx/html/

# 创建日志目录
RUN mkdir -p /var/log/nginx

# 暴露端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]
