# 五子棋游戏 (Gomoku Game)

一个简单而优雅的前端五子棋游戏，支持人机对战。使用纯HTML、CSS和JavaScript构建，无需任何外部依赖。

## 功能特性

- **人机对战**：与AI对手进行游戏
- **简洁界面**：现代化设计，响应式布局
- **游戏控制**：重新开始、难度调整
- **实时反馈**：显示当前玩家和游戏状态
- **胜利判定**：自动检测五子连珠

## 游戏规则

1. 玩家使用黑子，AI使用白子
2. 点击棋盘空位放置棋子
3. 先连成五子（横、竖、斜）的一方获胜
4. 棋盘大小为15x15

## 技术栈

- **前端**：HTML5、CSS3、JavaScript (ES6+)
- **构建工具**：无外部依赖，纯原生实现
- **AI算法**：基于评分系统的简单AI

## 快速开始

### 在线体验

直接在浏览器中打开 `index.html` 文件即可开始游戏。

### 本地运行

1. 克隆项目：
```bash
git clone https://github.com/lizhihui2010/gomoku-game.git
cd gomoku-game
```

2. 打开 `index.html` 文件：
```bash
# 在浏览器中打开
start index.html  # Windows
open index.html   # macOS
xdg-open index.html  # Linux
```

## 项目结构

```
gomoku-game/
├── index.html      # 主页面
├── game.js         # 游戏逻辑
├── style.css       # 样式文件
├── package.json    # 项目配置
├── CLAUDE.md       # 开发说明
├── .gitignore      # Git忽略文件
└── README.md       # 项目说明
```

## 游戏操作

- **放置棋子**：点击棋盘上的空位
- **重新开始**：点击"重新开始"按钮
- **调整难度**：通过AI设置调整游戏难度

## 开发说明

### 构建项目

```bash
npm run build
```

### 类型检查

```bash
npm run typecheck
```

### 代码风格

- 使用ES模块语法
- 代码添加中文注释
- 遵循现有代码结构

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 作者

- lizhihui2010

## 链接

- [GitHub仓库](https://github.com/lizhihui2010/gomoku-game)
- [在线演示](https://lizhihui2010.github.io/gomoku-game/)