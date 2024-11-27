# ChatGPT Clone

一个使用 React + TypeScript + Vite 构建的 ChatGPT 克隆项目，使用 OpenRouter API 实现 AI 对话功能。

## 功能特点

- 💬 实时流式对话响应
- 🎨 高度还原 ChatGPT 界面
- 🔑 支持 OpenRouter API key 配置
- 📱 响应式设计，支持移动端
- ✏️ 支持编辑历史消息
- 🌙 暗色主题
- ⌨️ 支持快捷键操作

## 技术栈

- React 18
- TypeScript
- Vite
- Material UI
- OpenRouter API

## 本地运行

1. 克隆项目

```bash
git clone https://github.com/lod61/chatgpt-clone.git
cd chatgpt-clone
```

2. 安装依赖

```bash
yarn
```

3. 启动开发服务器

```bash
yarn dev
```

4. 打开浏览器访问 http://localhost:5173

## 使用说明

1. 首次使用需要配置 OpenRouter API key

   - 访问 [OpenRouter](https://openrouter.ai/keys) 获取 API key
   - 点击界面右上角的设置图标
   - 输入 API key 并保存

2. 开始对话

   - 在底部输入框输入消息
   - 按回车键或点击发送按钮发送消息
   - 支持 Shift + Enter 换行

3. 编辑历史消息
   - 鼠标悬停在用户消息上
   - 点击编辑图标进行修改
   - 修改后的消息会重新生成 AI 回复

## 项目结构

```
src/
├── components/          # 组件目录
│   ├── Chat/           # 聊天相关组件
│   ├── Layout/         # 布局组件
│   └── Settings/       # 设置相关组件
├── hooks/              # 自定义 Hooks
├── services/           # API 服务
├── types/              # TypeScript 类型定义
└── utils/              # 工具函数
```

## 开发规范

- 使用 Function Components 和 Hooks
- 使用 TypeScript 进行类型检查
- 使用 Material UI 组件库
- 遵循 ESLint 规范
- 代码格式化使用 Prettier

## 已知问题

- 刷新页面会清空对话历史
- API 请求可能受到速率限制

## 后续优化计划

- [ ] 添加本地存储支持，保存对话历史
- [ ] 添加对话导出功能
- [ ] 支持多个对话会话
- [ ] 添加更多 AI 模型选择
- [ ] 优化移动端体验
- [ ] 添加国际化支持

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 提交 Pull Request

## 许可证

[MIT License](LICENSE)

## 部署方案

### 1. Vercel 部署（推荐）

最简单的部署方式，自动构建和部署：

1. Fork 本项目到你的 GitHub
2. 在 Vercel 中导入该仓库
3. 设置环境变量 `VITE_OPENROUTER_API_KEY`
4. 完成部署

### 2. Docker 部署

```bash
# 构建镜像
docker build -t chatgpt-clone .

# 运行容器
docker run -d -p 5173:80 \
  -e VITE_OPENROUTER_API_KEY=your_api_key \
  chatgpt-clone
```

### 3. 静态托管

构建后可部署到任何静态托管服务：

```bash
# 构建项目
npm run build

# 生成的 dist 目录可部署到：
- GitHub Pages
- Nginx
- Apache
- Netlify
- Cloudflare Pages
```

### 4. Node.js 环境部署

```bash
# 安装依赖
npm install

# 构建
npm run build

# 使用 serve 等工具启动
npx serve dist
```
