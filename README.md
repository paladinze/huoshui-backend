# Graphql 活水后端

活水后端负责给活水各客户端(Android, iOS & Webapp)提供数据接口支持(API)

## 准备条件

PosgreSQL - SQL 结构化数据储存 （主数据库）

```
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

## 本地安装

git clone repo 到本地之后，安装 npm 组件

```
npm install
```

## 部署

在 staging server 和 production server 安装 [Docker](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/)

## 主要功能

- [x] 课程信息 （课名，教师，作业，考试，标签等）
- [x] 点评信息 （点评内容，标签，各项指标等）
- [x] 教授档案 （更全的数据：格言，研究方向，头像，联系方式等）
- [x] 课程榜单 （综合最佳，院系推荐，选修课排名，不想上的课）
- [x] 课程推荐 （选修课板块，通识课等关注度高的课程类别）
- [x] 常规登录 （用户名密码登录）
- [ ] 课列系统 （用户自定义列表加简评，参考豆列）
- [ ] 评论功能 （对点评进行评论）

## 次要功能

- [ ] 邮件系统（密码重置，群发信息）
- [x] 自动数据接口文档生成

## 主要技术

- Apollo Client - graphql 客户端
- Apollo Server - graphql 应用层接口
- Prisma - ORM 对象关系映射
- PosgreSQL - SQL 结构化储存
- Nginx - 负载均衡 / 伺服
- Docker - 虚拟化 / 部署
- Cloud IaaS - 腾讯云

## 维护人员

- **游侠** - [paladinze github](https://github.com/paladinze)
