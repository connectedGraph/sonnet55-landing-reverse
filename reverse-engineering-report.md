# Claude Sonnet 5.5 Hero 前端逆向与设计报告

## 1. 结论与架构演进 (Executive Summary & Architecture Evolution)

在 Anthropic 官网的 Claude 落地页动效技术选型上，本项目发现了一个关键的**技术栈演进**：

- **Claude Fable 5.1 / Mythos 5.1**：基于 **Three.js + GLTFLoader** 的 WebGL 场景。包含骨骼动画山雀（`tit.glb`）、程序化树木生成算法（基于 PRNG）、实例化叶片系统、天空球与月球 Shader 以及径向散景景深后处理。
- **Claude Sonnet 5.5**：**彻底去除了 Three.js 依赖**，转向轻量级、超高性能的**自研原生 WebGL2 / GLSL 300 es 视穹引擎（代号 Cupola / MobyHero）**。整个场景由 15KB 的高度优化片段着色器直接绘制在全屏 Quad 上，配合专属二进制压缩包（`LCP1` 格式）与实时视频材质纹理混合，兼顾了航天级地球视穹（Cupola）、大气层散射、城市微光与多视角漫游动效。

本报告基于以下本地逆向提取证据：

- `site/_next/static/chunks/0pjggyb0zfktw.js`（模块 `630276`）：自研 WebGL2 视穹渲染引擎（Cupola Engine）
- `site/_next/static/chunks/37z3fdjldsrhc.js`（模块 `88481`）：React 装配与滚动响应层（`MobyHero`）
- `site/_next/static/chunks/1qexg3o4du98x.js`：媒体资源映射清单（`cupola.bin`、`rotary2` 与 `tach`）
- `site/_next/static/media/cupola.gz.3u6ev4phkp353.bin`（解压前 423KB，解压后 824KB）：`LCP1` 打包数据集
- `site/_next/static/media/rotary2.*`、`tach.*`：视频与图片贴图材质

---

## 2. 来源署名 (Source Attribution)

- **原始页面**：<https://www.anthropic.com/claude-sonnet-5-5>
- **页面标题**：Introducing Claude Sonnet 5.5 \ Anthropic
- **渲染核心 Bundle**：`/_next/static/chunks/0pjggyb0zfktw.js`（模块 `630276`，导出 `mountLaunchHero`）
- **动态资源加载清单**：`/_next/static/chunks/1qexg3o4du98x.js`
- **React 装配组件**：`/_next/static/chunks/37z3fdjldsrhc.js`（模块 `88481`）
- **核心数据集与素材**：
  - `cupola.1w4wtudy57vux.bin` / `cupola.gz.3u6ev4phkp353.bin`
  - `rotary2.20_lzi6r3olqw.mp4` / `rotary2.1vruayv9mptfd.webm` / `rotary2.0zsu4u_1fav2-.webp`
  - `tach.3kl7jl8vnvi-m.mp4` / `tach.37kg1b_g5jbu4.webm` / `tach.10lkzzgnomw3p.webp`

---

## 3. 运行时层次结构 (Runtime DOM & Rendering Stack)

```text
MobyHero React Component (module 88481)
  │
  ├─ DOM 结构与标题测量 (Eyebrow, TOC, Skip button)
  ├─ 滚动与视口观察器 (hero:nav 状态切换: over / away)
  │
  └─ mountLaunchHero(element, options) (module 630276)
       │
       ├─ canvas#mh-fx (WebGL2 上下文, 100lvh 全屏底层渲染)
       │    ├─ Vertex Shader (全屏大三角形 [-1, -1, 3, -1, -1, 3])
       │    └─ Fragment Shader (GLSL 300 es, 约 15KB)
       │         ├─ 贝塞尔曲线几何投影与视窗边缘轮廓 (uWin[96], tBez)
       │         ├─ 地球曲率模型与高程映射 (uLimb, uEarthR, tEarth, tDet)
       │         ├─ 程序化云层 (Worley Noise + 多频 FBM)
       │         ├─ 大气晨昏过渡与城市夜间灯光 (uDawn, cityAdd)
       │         ├─ 双通道视频采样混合 (tVidA, tVidB: rotary / tach)
       │         └─ ACES 胶片颗粒与暗角调色 (gradeF)
       │
       ├─ canvas#mh-c2 (2D Canvas, 尺寸自适应, 绘制指示器与动态标记)
       │
       └─ svg#mh-ov (SVG 顶层发光排版)
            ├─ filter#mh-title-glow (双重高斯模糊 + 柔和泛光合成)
            └─ g#mh-title-g -> text#mh-title ("Claude Sonnet 5.5")
```

---

## 4. `LCP1` 紧凑二进制数据集规范 (Packed Binary Dataset)

引擎首次启动时，通过 `DecompressionStream("gzip")` 解压 `cupola.gz.bin`（约 423KB），该文件为 Anthropic 自定义的紧凑打包格式 `LCP1`（Launch Cupola Packed v1）：

### 4.1 头部与索引区 (Header & Table Index)
- **`0x00 - 0x03`**：4 字节魔数 ASCII `"LCP1"`
- **`0x04 - 0x07`**：32 位小端整数（uint32），表示 JSON 元数据头的字节长度 `headerLength`
- **`0x08 - (0x08 + headerLength)`**：UTF-8 编码的 JSON 元数据，包含所有子数据表的偏移量与维度：
  - `blobs.bez`：`[offset, length]`，贝塞尔导轨表（`bez.u * bez.d * keys * 3`）
  - `blobs.grid`：`[offset, length]`，网格坐标表（`grid.x * grid.y * keys * 3`）
  - `blobs.earth`：`[offset, length]`，地球球面高程纹理（`earth.a * earth.h * keys * 3`）
  - `blobs.det`：`[offset, length]`，细节噪声贴图（`det.a * det.h`）
  - `blobs.cld`：`[offset, length]`，云层密度表（`cld.w * cld.h`）
  - `blobs.tag`：`[offset, length]`，矢量标签贴图（`tag.w * tag.h * 4`）
  - `win`：192 个浮点数的视窗轮廓点数组（构成 96 点闭合多边形窗框）

### 4.2 纹理上传 (Texture Generation)
引擎将上述二进制数据依次提取为 `Uint8Array`，并使用 `gl.texImage2D` 构建为 WebGL2 贴图（使用 `gl.R8` 或 `gl.RGB8` 格式，`gl.LINEAR` 过滤），传递给片元着色器采样器。

---

## 5. WebGL2 片元着色器管线深入剖析 (Shader Pipeline)

### 5.1 视窗裁剪算法与轮廓有符号距离场 (Window SDF)
视穹拥有一个类似空间站穹顶窗的 96 边形轮廓。着色器中的 `win(vec2 p)` 函数实现了点到 96 段线段的高性能距离度量与绕数求交判断，返回 `vec2(signedDistance, cumulativeLength)`，从而在片元级别实现窗框边缘的自然抗锯齿与边缘光衰减。

### 5.2 程序化云层生成 (Procedural Cloud Deck)
摒弃了预烘焙模型，云层通过空间扭曲（Domain Warping）的多频分数布朗运动（FBM）结合沃利噪声（Worley Noise）实时计算：
- 低频 FBM 生成大尺度天气团与气压带；
- Worley 噪声（胞元距离采样）刻画对流云顶部的聚集泡状微观结构；
- 结合镜头视差动态移动（`uFlow`），并依据太阳迎光夹角计算双重散射（`lit`）与自阴影。

### 5.3 晨昏过渡与城市灯光 (Atmospheric Dawn & City Lights)
- `uDawn` 控制光线由夜间深蓝向黎明金橙色渐变；
- `cityAdd`：在夜间暗区（`lit < 0.5`）根据陆地遮罩（`land`）和云遮挡（`1.0 - gCloud * 0.85`）动态叠加暖色微光，模拟从太空俯瞰地表城市群的灯火辉煌效果。

### 5.4 胶片调色与光学特效 (Film Grade & Optics)
- 自研 ACES 风格 S 曲线映射：对高光和低饱和色域进行微对比度调整；
- 镜头暗角（Vignetting）与色散色差（Chromatic Aberration）；
- 伪随机高斯噪点（Film Grain）：利用片元坐标结合时变 Hash 消除色带条纹（Banding）。

---

## 6. 本地组件化封装设计 (Componentization Design)

为满足脱离 Next.js 整体站点、在任何独立项目中复用该动画的需求，我们在 `standalone/` 目录中完成了一站式组件化：

1. **ESM 适配器** (`standalone/moby-hero.esm.js`)：
   - 完整保留原生 `mountLaunchHero` 引擎代码（无任何破坏性改动，符合“代码复制”要求）；
   - 提供轻量的 Turbopack 模块运行时模拟环境；
   - 自动映射相对路径资产（`assets/cupola.gz.bin`、`assets/rotary2.*`、`assets/tach.*`）。
2. **极简调用接口**：
   ```javascript
   import { mountLaunchHero } from './moby-hero.esm.js';

   const heroInstance = mountLaunchHero(containerElement, {
     model: 'Sonnet 5.5',
     clips: [
       {
         mp4: './assets/rotary2.20_lzi6r3olqw.mp4',
         webm: './assets/rotary2.1vruayv9mptfd.webm',
         still: './assets/rotary2.0zsu4u_1fav2-.webp'
       }
     ]
   });

   // 销毁与资源释放
   heroInstance.destroy();
   ```
3. **验证结果**：
   - 在无头 Edge / Chromium 环境下测试，通过 CDP 验证 WebGL2 上下文激活、两层画布（`#mh-fx` 与 `#mh-c2`）挂载、标题 SVG 文本和辉光合成无误。
   - 静态截图与全屏动画帧渲染均已通过自动化校验。
