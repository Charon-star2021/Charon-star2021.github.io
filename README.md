# 王仔涵 · Jack Wang | 个人主页

学术极简风格的单页个人主页，纯手写 HTML / CSS / JavaScript，无框架、无构建步骤、无外部 CDN 依赖（字体走系统字体栈），可直接上传到 GitHub Pages。

## 目录结构

```
.
├── index.html              # 页面结构（所有文案都在这里，中文为默认，英文在 data-en 属性里）
├── assets/
│   ├── css/style.css       # 全部样式（含响应式与打印样式）
│   ├── js/main.js          # 中英切换 / 滚动高亮 / 移动端菜单 / 入场动画 / 点击复制
│   └── img/
│       ├── avatar.jpg      # 证件照（换照片时直接覆盖同名文件即可）
│       └── favicon.svg     # 站点图标
└── README.md
```

## 本地预览

直接双击 `index.html` 即可。若想用本地服务器（锚点行为更接近线上）：

```bash
python -m http.server 8000
# 打开 http://localhost:8000
```

## 内容在哪改

| 想改的东西 | 位置 |
| --- | --- |
| 姓名 / 身份 | `<h1 class="hero-title">`、`.brand`、页脚 |
| 一句话简介 | `.hero-desc` |
| 教育背景 | `.edu-card`（学校、学院、起止时间） |
| 基本信息 4 项 | `.facts`（出生年月 / 籍贯 / 现居 / 身份） |
| 技能分组 | `.skill-grid` 里的 4 个 `.skill-card` |
| 项目 / 规划 | `.project-grid` 里的 `.project` 卡片 |
| 联系方式 | `.contact-panel`（邮箱、电话、微信、QQ、地址） |
| 头像 | 覆盖 `assets/img/avatar.jpg`（建议 3:4 或 4:5 竖版、宽 800px 以上） |
| 主题色 | `assets/css/style.css` 顶部 `:root` 里的 `--accent` 等变量 |

**改中文时一定要同时改同一个标签的 `data-en`**，否则切换语言时会不对应。该标签内不要嵌套其他标签（切换用的是 textContent 替换）。

## 项目区怎么升级

现在 `.project` 卡片写的是「计划中 / 了解中」，用来占位。等你真的开始做事了：

1. 把 `status--plan`（琥珀色「计划中」）改成 `status--doing`（靛蓝色「进行中」），或直接换成 `.status--idle`（灰色「已结束」）。
2. 把 `.project-highlight` 那句「预计时间：…」换成实际结果（做了什么、产出了什么、得到什么反馈）。
3. 做完一件事就至少留一张卡片；不需要为了凑数编内容。

## 部署到 GitHub Pages

```bash
git init
git add .
git commit -m "feat: personal homepage"
git branch -M main
git remote add origin git@github.com:<你的用户名>/<仓库名>.git
git push -u origin main
```

推送后进入仓库 **Settings → Pages**，Source 选 `Deploy from a branch`，分支选 `main`、目录选 `/ (root)`，保存。一两分钟后访问 `https://<你的用户名>.github.io/<仓库名>/`。

> 如果仓库名就叫 `<你的用户名>.github.io`，则直接访问 `https://<你的用户名>.github.io/`。

## 导出 / 分发用的静态包

仓库根目录里的 `wangzaihan-site.zip` 是**可直接上传的成品包**：

```
wangzaihan-site.zip
├── index.html
├── README.md
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/  avatar.jpg · favicon.svg
```

`index.html` 就在压缩包最外层，解压后把内容全选上传到仓库根目录即可，不要再套一层文件夹。
`dist/` 是同样内容的解压版，可以直接拖拽上传。

> 注意：改了根目录的 `index.html` 或 `assets/` 之后，`dist/` 与 zip 不会自动同步，需要重新打包（把 `index.html`、`README.md`、`assets/` 重新压一次即可）。不想手动处理的话，直接按上面的 git 命令推根目录也行，效果完全一样。

## 已包含的细节

- 固定顶部导航 + 平滑锚点跳转（`#about` / `#skills` / `#projects` / `#contact`）+ 滚动自动高亮当前栏目
- 移动端汉堡菜单（≤860px 折叠，≤900px 单栏重排，≤560px 收紧间距）
- 中 / EN 切换按钮，选择记在 `localStorage`，刷新后保持；英文下主标题自动变 Jack Wang
- 微信号、QQ 号点击即复制，底部有「已复制」提示；不支持剪贴板时提示手动复制
- 滚动入场动画，自动尊重 `prefers-reduced-motion`
- 键盘可用：跳转正文链接、可见 focus 样式、`aria-current` / `aria-expanded`
- `Ctrl/Cmd + P` 打印时自动隐藏导航与按钮，可直接导出 PDF
- 无网络请求，断网也能完整显示
