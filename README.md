```markdown
# 眼科疾病智能诊断系统

基于 Electron 和 React 的眼科疾病智能诊断桌面应用程序，支持单图像和批量图像诊断。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **UI 组件**: Material-UI (MUI)
- **桌面应用封装**: Electron

## 安装与运行

### 环境要求

- Node.js 14.0+
- npm 6.0+
# 眼科疾病智能诊断系统

基于 Electron 和 React 的眼科疾病智能诊断桌面应用程序，支持单图像和批量图像诊断。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **UI 组件**: Material-UI (MUI)
- **桌面应用封装**: Electron

## 安装与运行

### 环境要求

- Node.js 14.0+
- npm 6.0+

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/用户名/eye-diagnosis-system.git
   cd eye-diagnosis-system
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

### 运行与构建

- **本地运行**
  ```bash
  npm run electron:dev
  ```

- **构建应用**
  - 全平台版本
    ```bash
    npm run electron:build
    ```
  - Windows 版本
    ```bash
    npm run electron:build:win
    ```
  > 构建后的应用程序位于 `dist` 目录下。

## 项目结构

```
src/
├── components/       # 可复用组件
├── services/         # API 服务与业务逻辑
├── App.tsx           # 主应用组件
└── index.tsx         # 应用入口文件
public/
└── electron.js       # Electron 主进程文件
```

## 注意事项

1. 请将仓库 URL 中的 `用户名` 替换为实际 GitHub 用户名
2. 首次运行前需确保已安装所有依赖项
3. 生产环境构建时建议指定目标平台以减小包体积
```

---

### 建议补充内容（可根据需要添加）：
```markdown
## 功能特性

- 单图像眼部疾病诊断
- 批量图像异步处理
- 诊断历史记录
- 可视化报告生成

## 开发指南

### 代码规范
- 使用 ESLint + Prettier 规范代码格式
- 组件采用函数式组件 + Hooks 写法
- TypeScript 类型严格模式

### 调试模式
```bash
# 独立启动渲染进程
npm run start 

# 调试主进程
npm run electron:debug
```
