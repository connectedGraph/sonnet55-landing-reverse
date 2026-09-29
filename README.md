# sonnet55-landing-reverse

Reverse engineering and componentization of the hero animation on Anthropic's
[Claude Sonnet 5.5 landing page](https://www.anthropic.com/claude-sonnet-5-5) —
extracted, formatted, verified, and componentized.

Anthropic 官网 Claude Sonnet 5.5 落地页顶部 hero 动画的逆向工程与本地组件化跑通。
沿用 [fable-landing-reverse](file:///C:/Users/18086/Desktop/个人项目/fable-landing-reverse) 的逆向分析流程，先完成原始代码的高保真复制与模块解耦，并在本地跑通独立的 WebGL 组件化渲染。

---

## Source attribution / 来源署名

本工作研究所依据的 Anthropic 公开客户端 Bundle：

- 原始页面：<https://www.anthropic.com/claude-sonnet-5-5>
- 渲染引擎 Bundle：`/_next/static/chunks/0pjggyb0zfktw.js`（模块 `630276`，函数 `mountLaunchHero`）
- 动态加载配置 Bundle：`/_next/static/chunks/1qexg3o4du98x.js`
- React 装配层 Bundle：`/_next/static/chunks/37z3fdjldsrhc.js`（模块 `88481`）
- 二进制数据集与素材：
  - `/_next/static/media/cupola.gz.3u6ev4phkp353.bin`（LCP1 二进制打包数据集，解压后 824KB）
  - `/_next/static/media/rotary2.*`（视频与背景材质）
  - `/_next/static/media/tach.*`（测速仪表视频材质）

所有原始代码、着色器和媒体素材均归 Anthropic 所有。本项目仅供技术分析与逆向学习。

---

## 结论与技术突破 / Findings

与之前 Claude Fable 5.1（采用 Three.js + Skinned Mesh + PRNG 树木生成）不同，Anthropic 在 Claude Sonnet 5.5 的落地页中**移除了 Three.js 库**，采用自研的 **纯原生 WebGL2 / GLSL 300 es 视穹引擎（代号 Cupola / MobyHero）**：

1. **零外部 3D 库依赖**：纯原生 WebGL2 全屏三角形光栅化，不依赖 Three.js、Babylon 或 Pixi，运行时体积减小约 700KB。
2. **LCP1 自定义紧凑数据集**：将地球几何高程、视穹 96 边形轮廓、网格坐标和贝塞尔导轨压缩为单个 `LCP1`（Launch Cupola Packed v1）二进制文件，经浏览器内置 `DecompressionStream("gzip")` 秒级流式解析为 GPU 纹理。
3. **空间站视穹（Cupola）地球光照着色器**：
   - 96 点闭合折线的多边形有符号距离场（SDF）高效裁切；
   - 基于多频 FBM 与 Worley 噪声的实时自阴影云层；
   - 太阳夹角计算、地球曲率、大气黎明晨昏过渡（`uDawn`）与地表城市群夜景暖光叠加；
   - 双通道视频材质实时混合（`tVidA` / `tVidB`）；
   - 自研 ACES 胶片调色、暗角与消除色带的动态微颗粒（Film Grain）。

完整技术细节请查阅 [reverse-engineering-report.md](file:///C:/Users/18086/Desktop/个人项目/sonnet55-landing-reverse/reverse-engineering-report.md)。

---

## 仓库结构 / Layout

```text
sonnet55-landing-reverse/
├── site/                     # 原始站点镜像 (page.html, _next/, media/)
├── extracted/                # 提取并使用 Prettier 格式化的核心源码 (纯代码复制，未混淆改名)
│   ├── moby-hero-engine.formatted.js     # WebGL2 视穹渲染引擎 (模块 630276)
│   ├── launch-hero-component.formatted.js # React 装配层与滚动检测 (模块 88481)
│   └── hero-assets.formatted.js           # 媒体映射字典
├── dist/                     # 本地可直接运行的完整站点副本
│   ├── index.html
│   ├── _next/
│   └── preview.png
├── standalone/               # 独立组件化运行环境 (脱离 Next.js 依赖的纯净模块)
│   ├── index.html            # 独立测试挂载页面
│   ├── moby-hero.esm.js      # 标准 ESM 导出模块 (mountLaunchHero)
│   └── assets/               # 独立运行所需的核心数据集与材质
├── reverse-engineering-report.md # 深度逆向与设计报告
├── package.json
└── README.md
```

---

## 本地运行 / Run

已启动本地服务（默认运行在端口 `4175`）：

```bash
# 启动本地服务器
python -m http.server 4175
```

打开浏览器访问：
- **完整镜像副本**：<http://127.0.0.1:4175/dist/>
- **独立组件化演示**：<http://127.0.0.1:4175/standalone/>

页面中可直接体验航天级地球视穹、SVG 柔和泛光标题、滚动过渡与鼠标视差效果。

---

## 组件化调用接口 / Component API

在任意现代前端项目中，引入 `standalone/moby-hero.esm.js` 即可直接挂载：

```javascript
import { mountLaunchHero } from './standalone/moby-hero.esm.js';

// 获取包含 .stage、#mh-ov 的容器节点
const heroElement = document.querySelector('section[data-hero-nav]');

// 挂载引擎
const instance = mountLaunchHero(heroElement, {
  model: 'Sonnet 5.5',
  clips: [
    {
      mp4: './assets/rotary2.20_lzi6r3olqw.mp4',
      webm: './assets/rotary2.1vruayv9mptfd.webm',
      still: './assets/rotary2.0zsu4u_1fav2-.webp'
    }
  ]
});

// 监听着色器与数据集加载完成
instance.started.then(() => {
  console.log('Hero engine is live!');
});

// 卸载与资源释放
// instance.destroy();
```

---

## 验证链 / Verification

自动化 CDP（Chrome DevTools Protocol）无头验证全部通过：

| 验证项 | 预期 | 实际状态 |
|---|---|---|
| `node --check` | 语法无误 | 全部通过 |
| WebGL2 上下文初始化 | 支持并正常获取 | 通过（`#mh-fx` 正常建立） |
| `LCP1` 数据集解压 | gzip 流式解包无损坏 | 通过（824KB 纹理表全量载入） |
| 双 Canvas DOM 挂载 | `#mh-fx` 与 `#mh-c2` 注入 | 通过（状态 `heroLive: true`） |
| 标题发光与文字排版 | SVG 滤镜与文字可见 | 通过（`titleOpacity: 1`） |
| 独立无 Next.js 运行 | `standalone/index.html` 独立跑通 | 通过（截图验证无误） |
