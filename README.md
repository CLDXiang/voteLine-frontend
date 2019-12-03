# voteLine frontend

这是一个《数据库引论》课程项目的前端部分。后端部分在[这里](https://github.com/CLDXiang/voteLine-backend)。

voteLine frontend是一个基于[React](https://reactjs.org/)+[AntD](https://ant.design)+[AntV.G2](https://antv.alipay.com)的Web投票应用，目前仅仅实现了一些基础功能，其余功能尚待完善。

界面展示：

![homepage](./document_images/voteLine_homepage.jpg)

## 快速开始

在开始之前，你可能需要安装[yarn](https://github.com/yarnpkg/yarn/)。

首先进入你准备存放项目文件的根目录，如`repo`：

```
cd repo
```

下载项目源码：

```
git clone https://github.com/CLDXiang/voteLine-frontend.git
cd voteLine-frontend
```

配置：

使用VIM或你喜欢的编辑器打开`voteLine-frontend/src/config.js`，修改其中的项目并保存（如果你只是在本地测试，可以直接使用默认配置）：

* url_back: 后端服务器地址
* port_back: 后端服务器端口号
* port_front: 前端端口号
* salt: 盐（用于密码加密）

后端的配置与启动见[voteLine-backend](https://github.com/CLDXiang/voteLine-backend)。

安装依赖：

```
yarn install
```

开始运行：

```
yarn start
```

稍等片刻便会在浏览器中自动打开Web页面，你也可以手动访问`https://localhost:你的前端端口号`。

如果希望在生产环境中部署，可以使用

```
yarn build
```

并将生成的文件部署在服务器。

## 设计文档

参见[document.md](https://github.com/CLDXiang/voteLine-frontend/blob/master/document.md)

## 外部资源

页面背景图片来自[Pixiv](https://www.pixiv.net/member_illust.php?mode=medium&illust_id=62288977)。