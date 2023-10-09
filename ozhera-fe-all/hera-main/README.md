# qiankun-main HERA项目主应用

## 项目安装
```
npm install
```

### 开发环境编译&热更新
```
npm run serve
```

### 生产环境编译&压缩
```
npm run build
```

## 项目部署


### 场景1： 主应用和微应用部署在同一个服务器

我们有一个主应用和5个子应用qiankun-target-monitor、qiankun-milog、qiankun-tracing、qiankun-config。
需将跟根目录下的publicPath: 分别配置为"/qiankun-target-monitor"、"/qiankun-milog"、"/qiankun-tracing"、"/qiankun-config"。
将编译好的dist文件放到服务器上，文件目录如下：
```
└── html/                     # 根文件夹
    |
    ├── qiankun-target-monitor/ # 存放微应用 qiankun-target-monitor 的文件夹
    ├── qiankun-milog/          # 存放微应用 qiankun-log 的文件夹
    ├── qiankun-tracing/        # 存放微应用 qiankun-tracing 的文件夹
    ├── qiankun-config/         # 存放微应用 qiankun-config 的文件夹
    ├── index.html              # 主应用的index.html
    ├── css/                    # 主应用的css文件夹
    ├── js/                     # 主应用的js文件夹
```
nginx配置文件如下：
```
server {
        listen 7001;
        # server_name xxx.xxx.com;
        location /qiankun-target-monitor {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
            try_files $uri $uri/ /project-target-monitor/index.html;
        }

        location /qiankun-milog {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
            try_files $uri $uri/ /project-milog/index.html;
        }

        location /qiankun-tracing {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
            try_files $uri $uri/ /project-hera-tracing/index.html;
        }

        location /qiankun-config {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
            try_files $uri $uri/ /project-config/index.html;
        }

        location /qiankun-alarm {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
            try_files $uri $uri/ /project-alarm/index.html;
        }

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
            try_files $uri /index.html;
        }

        location ^~ /api-log/ {
            proxy_pass http://service-log-ip:port/;
        }

        location ^~ /api-trace/ {
            proxy_pass http://service-trace-ip:port/;
        }

        location ^~ /api-monitor/ {
            proxy_pass http://service-monitor-ip:port/;
        }

    }
```


### 场景2： 主应用和微应用部署在不同服务器

我们有一个主应用和5个子应用qiankun-target-monitor、qiankun-milog、qiankun-tracing、qiankun-config，打包后如下放置
需将跟根目录下的publicPath配置为"/"即可


nginx配置如下
```
location / {
    rewrite ^/qiankun-tracing/(.*)$ /static-fe/production/hera-tracing/index.html break;
    rewrite ^/qiankun-target-monitor/(.*)$ /static-qiankun/production/stasi-fe/index.html break;
    rewrite ^/qiankun-milog/(.*)$ /static-qiankun/production/mione-log/index.html break;
    rewrite ^/qiankun-config/(.*)$ /static-qiankun/production/qiankun-config/index.html break;
    rewrite ^/qiankun-alarm/(.*)$ /static-qiankun/production/qiankun-alarm/index.html break;
    rewrite ^/(.*)$ /static-qiankun/production/qiankun-main/index.html break;
    proxy_pass  http://fds.api.test.net;
    proxy_set_header Host $proxy_host;
    proxy_set_header Connection "";
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
location ^~ /api-log/ {
    proxy_pass http://service-log-ip:port/;
}
location ^~ /api-trace/ {
    proxy_pass http://service-trace-ip:port/;
}
location ^~ /api-monitor/ {
    proxy_pass http://service-monitor-ip:port/;
}
```
