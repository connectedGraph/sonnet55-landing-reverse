# Frontier 5.5 WebGL2 Hero Component Library

A high-performance, standalone WebGL2 Hero animation component reverse-engineered, extracted, and desensitized from frontier AI landing pages.

[Live Demo on GitHub Pages](https://connectedgraph.github.io/sonnet55-landing-reverse/)

---

## 概述 / Overview

本项目为一个高性能、轻量级、无外部 3D 库依赖的 **WebGL2 航天级空间站视穹（Cupola）地球光照 Hero 动效组件库**。

根据脱敏规范，原始专有模型与机构名称已全面替换为通用 AI 示例标识（`Frontier 5.5`），去除所有第三方分析探针与平台绑定，完整保留其顶尖的计算机图形学渲染算法与片元着色器管线，供学术研究与前端交互设计参考。

---

## 在线体验 / Live Pages

- **主入口体验 (Root)**: <https://connectedgraph.github.io/sonnet55-landing-reverse/>
- **独立组件纯净测试页 (Standalone)**: <https://connectedgraph.github.io/sonnet55-landing-reverse/standalone/>
- **全站完整布局副本 (Full Mirror)**: <https://connectedgraph.github.io/sonnet55-landing-reverse/dist/>

---

## 核心架构与技术亮点 / Technical Highlights

1. **零外部 3D 库依赖 (Zero 3D Library Overhead)**：
   - 彻底摆脱 Three.js / Babylon 等大型 3D 引擎，使用原生 WebGL2 全屏三角形光栅化管线；
   - 核心代码与着色器整体体积不足 70KB。
2. **LCP1 自定义紧凑数据集 (Packed Binary Dataset)**：
   - 使用浏览器原生 `DecompressionStream("gzip")` 流式解包 423KB 的 `cupola.gz.bin`（解包后 824KB）；
   - 一次性解析 96 边形空间站窗框 SDF 轮廓、地球高程纹理、轨道坐标与贝塞尔导轨。
3. **高保真 GLSL 300 es 物理着色器**：
   - **多频 FBM + 沃利噪声 (Worley Noise)** 实时生成多层带自阴影体积云；
   - **晨昏过渡与城市夜景光照**：根据太阳迎角动态计算 `uDawn`，暗部区域自动叠加地表城市群微光；
   - **双通道视频材质实时混合**（`tVidA` / `tVidB`）；
   - **自研 ACES 胶片调色、暗角与消除色带的动态微颗粒**。

---

## 仓库结构 / Layout

```text
sonnet55-landing-reverse/
├── index.html                        # GitHub Pages 门户入口
├── preview.png                       # 全屏渲染画面预览
├── standalone/                       # 纯净独立组件模块
│   ├── index.html                    # 独立挂载演示页
│   ├── moby-hero.esm.js              # 标准 ESM 导出模块 (mountLaunchHero)
│   ├── hero.css                      # 自包含样式表
│   └── assets/                       # 核心二进制数据集与视频/纹理材质
├── dist/                             # 完整版脱敏站点镜像副本
├── extracted/                        # 格式化后的逆向核心源码备份
├── tools/                            # 自动化构建与 CDP 验证工具集
├── .github/workflows/deploy.yml      # GitHub Pages 自动化部署工作流
├── reverse-engineering-report.md     # 逆向与图形学技术分析报告
├── package.json
└── README.md
```

---

## 快速使用 / Quick Start

### 1. 本地运行

```bash
# 启动本地开发服务
npm run serve
# 打开 http://127.0.0.1:4175/ 即可预览
```

### 2. 作为组件引入

```javascript
import { mountLaunchHero } from './standalone/moby-hero.esm.js';

// 获取挂载容器节点
const heroEl = document.querySelector('section[data-hero-nav]');

// 初始化挂载
const hero = mountLaunchHero(heroEl, {
  model: '5.5', // 渲染为 "Frontier 5.5"
  clips: [
    {
      mp4: './standalone/assets/rotary2.20_lzi6r3olqw.mp4',
      webm: './standalone/assets/rotary2.1vruayv9mptfd.webm',
      still: './standalone/assets/rotary2.0zsu4u_1fav2-.webp'
    }
  ]
});

// 监听着色器与数据集异步就绪
hero.started.then(() => {
  console.log('Frontier 5.5 WebGL2 Hero 运行中');
});

// 卸载与资源释放
// hero.destroy();
```

---

## 验证套件 / Verification

```bash
# 运行独立组件 CDP 自动化渲染回归测试
npm run verify

# 运行主入口页面自动化测试
npm run verify:site
```
