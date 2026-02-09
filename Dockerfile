# 选择轻量的 Nginx 镜像（Docker Desktop 会自动下载）
FROM nginx:alpine

# 将本地所有文件复制到 Nginx 容器的默认网页目录
COPY . /usr/share/nginx/html/

# 暴露 80 端口（Nginx 默认端口）
EXPOSE 80

# 启动 Nginx（镜像自带，这行可省略，仅作说明）
CMD ["nginx", "-g", "daemon off;"]