# CAUC OJ V2
CAUC OJ V2 基于Hydro构建，在此感谢Hydro的贡献

# Hydro

Hydro 是一个高效信息学在线测评系统。易安装，跨平台，多功能，可扩展，有题库。

## 系统特点

### 模块化设计，插件系统，功能热插拔

Hydro 设计了一套模块化的插件系统，可以方便地扩展系统功能。  
使用插件系统，可以在修改功能后，仍然保证系统的可升级性。  
Hydro 的所有历史版本均可平滑升级到最新版本。  

插件使用和开发指南，请前往文档 [插件](https://docs.hydro.ac/plugins/) 和 [开发](https://docs.hydro.ac/dev/typescript/) 章节。

### 跨平台兼容，数据一键备份/导入

Hydro 支持所有主流的 Linux 发行版，兼容 x86_64 和 arm64 架构设备，且均可一键安装。  
Hydro 可在 树莓派 或是 Apple M1/M2 上正常运行。

使用 `hydrooj backup` 即可备份系统全部数据，使用 `hydrooj restore 文件名` 即可导入备份数据。
整个过程无需手工干预。

### 单系统多空间，不同班级/院校，分开管理

Hydro 提供了单系统多空间支持，可以方便地为不同的班级/年级/院校等创建独立的空间。  
不同空间内除用户外数据默认隔离，且可分配独立管理员，互不干扰。  
题目可跨域复制，在系统内仅占用一份空间。

### 粒度精细的权限系统，灵活调节

Hydro 的权限可以按比赛/作业分配给对应的用户，也可以将用户分组（班级），按组分配权限。
有关权限节点，可以查看 [介绍](https://docs.hydro.ac/docs/) 下方截图。

### 规模化支持，上千用户无压力，伸缩组秒级自动扩展

Hydro 系统本身是无状态的，这意味着你可以随意增删服务节点，而不会影响系统的正常运行。
评测队列会自动在当前在线的所有评测机间均衡分配。接入弹性伸缩组后，可根据服务器负载情况自动增删评测机。
不像其他系统，Hydro 会管理不同服务器间的测试数据缓存，按需拉取，做到评测机上线即用，无需手动同步数据。

### 全题型支持，跟随时代潮流

Hydro 支持所有题型。无论是传统题型，Special Judge，还是文件输入输出，提交答案题，IO 交互，函数交互，乃至选择填空题等，
Hydro 都有相应的支持。安装相关运行环境后，Hydro 甚至可以做到：

- 调用小海龟画图，与标准图片比对；
- 调用 GPU 进行机器学习模型的评测；

更多的样例可前往 [样例区](https://hydro.ac/d/system_test/) 查看并下载。

### 丰富的题库

Hydro 支持导入常见格式的题库文件，包括 Hydro 通用的 zip 格式，HUSTOJ 导出的 FPS (xml) 格式题目，QDUOJ 导出的压缩包。  
Hydro 同时支持 VJudge，这意味着你可以直接在系统内导入其他平台的题目，修改题面后编入自己的作业或比赛，快速搭建自己的题库体系。  

### 多赛制支持

Hydro 支持多种赛制，包括 ACM/ICPC 赛制（支持封榜），OI 赛制，IOI 赛制，乐多赛制，以及作业功能。  
在 IOI 和 OI 赛制下，支持订正题目功能，学生在赛后可以在题库中提交对应题目，其分数会在榜单旁边显示。  
在 IOI 和 OI 赛制下，支持灵活时间功能，学生可以在设定的时间范围内，自选 X 小时参赛。  

### 轻松添加其他编程语言

Hydro 的语言设置并非硬编码于系统中，而是使用了配置文件。
只要能写出对应语言的编译命令和运行命令，Hydro 都可以进行判题。

## 联系我们

Email：i@undefined.moe
Telegram [@undefinedmoe](https://t.me/undefinedmoe)  
Hydro 用户群：1085853538  

注：加入用户群请先阅读[《提问的智慧》](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way/blob/main/README-zh_CN.md)。  
同时群内可能存在部分令您感到不适或感到冒犯的内容。若对此有顾虑**请勿加群**。

<details>
<summary><h2>更新日志（点击展开）</h2></summary>

## Hydro 5.0.0-beta.0 / UI 4.58.0-beta.0

- judge: 添加 checker 编译缓存
- ui: 优化题目详情页面 OGP 信息
- core&ui: 升级 simplewebauthn
- register: 添加 tsdown 支持
- ui&judge: 支持指定 checker 语言
- core: 基于相对时间计算一血而非绝对时间
- ui&judge: 添加栈空间回显
- install: 在树莓派中自动启用 cgroup.memory
- install: 添加 shm 空间大小警告
- core: 升级到 cordis@4
- framework: 支持同时启用多个 renderer
- core: 分离 HMR 和 Watcher 组件
- core: i18n: 添加 interface 选项
- judge: 添加 kattis checker 支持
- migrate: 修复 hustoj 自动运行
- core: Settings: 支持使用 Schemastery
- ui: 更新系统设置页面样式
- import-qduoj: 修复 spj=null
- core: 修复文件复制
- core: 支持存储并显示提交记录重测历史
- core: 新的加域逻辑
- ui: UserSelect.Multi: 支持批量粘贴用户名
- ui: 修复在线 IDE 右键菜单
- ui: 修复未登录用户查看题目文件页
- core: oauth: 支持绑定/解绑三方平台账户 (#971)
- ui: 修复暗色模式表格边框 (#968)
- core: 优化 icpc 题目包导入 (#966)
- judge: 弃用 diff (#965)
- core: 支持设置加域时自动加入小组

### Breaking API Changes

- vjudge: 使用 vjudge.mount 表替代 domain.mount
- judge: breaking: 不再支持在 checker 等的编译阶段读取选手代码
- core: 强制要求使用 inject 声明插件依赖
- core: 移除旧版本 bus 调用
- core: 移除 global.Hydro.service
- core: 移除 global.Hydro.ui.template
- core: 移除 global.Hydro.lib
- core: 移除 String.prototype.translate (使用 ctx.i18n.translate)
- core: 升级至 Mongo Driver 6
- core: 移除 registerResolver, registerValue, registerUnion (使用 ctx.api.resolver/...)
- core: 移除 paginate, rank (使用 ctx.db.paginate, ctx.db.ranked)
- core: 移除 setting.yaml
- core: oauth: 改为使用 ctx.oauth.provide() 注册
- framework: 移除 ready 与 dispose 事件 (使用 ctx.effect 代替)
- core: 最低要求 node 22
- core: 弃用 AdmZip

## Hydro 4.19.0 / UI 4.57.0

- core&ui&judge: 添加通信题支持
- core: 优化语言列表筛选
- ui: builder: 支持 css 引入
- ui: 优化客观题题目导航样式
- ui: 在引用题目中添加显示来源按钮
- core: problem.export: 将 pidFilter 参数标记为可选
- onsite-toolkit: resolver: 区分打星队伍
- judge: 文件上传出错时重试
- framework: 文件自动回收
- core: DomainEdit: 添加 boolean 设置项支持
- ui: contest_boolean: 修复默认值
- ui: 修复排名分页
- core: RecordConnection: 支持 noTemplate 选项


</details>

## 开源许可

本项目中 framework/ examples/ install/ 下的内容采用 MIT 协议授权，您可自由使用。  
本项目中 packages/ui-default/ 下的内容仅采用 AGPL-3.0 进行授权。  
项目其余部分使用双重许可：

1. 您可以在遵守 AGPL-3.0 许可证和下述附加条款章节的前提下免费使用这些代码：  
2. 如确需闭源，您也可以联系我们购买其他授权。

### 附加条款

基于 AGPL3 协议第七条，您在使用本项目时，需要遵守以下额外条款：

1. 不可移除本项目的版权声明与作者/来源署名；（[AGPL3 7(b)](LICENSE#L356)）
2. 当重分发经修改后的本软件时，需要在软件名或版本号中采用可识别的方式进行注明；（[AGPL3 7(c)](LICENSE#L360)）
3. 除非得到许可，不得以宣传为目的使用作者姓名；（[AGPL3 7(d)](LICENSE#364)）

即：  
在您部署 Hydro 时，需要保留底部的 `Powered by Hydro` 字样，其中的 `Hydro` 字样需指向 `hydro.js.org/本仓库/fork` 之一的链接。  
若您对源码做出修改/扩展，同样需要以 AGPL-3.0-or-later 开源，您可以以 `Powered by Hydro, Modified by xxx` 格式在页脚注明。  

## 鸣谢

排名不分先后，按照链接字典序  

- [Github](https://github.com/) 为 Hydro 提供了代码托管与自动构建。  
- [criyle](https://github.com/criyle) 提供评测沙箱实现。  
- [Vijos](https://github.com/vijos/vj4) 为 Hydro 提供了 UI 框架。  

## Sponsors

- [云斗学院](https://www.yundouxueyuan.com)
