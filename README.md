# 甘肃足迹

以《甘肃足迹》演示文稿为大纲制作的 React 互动课程网站。包含首页风景轮播、甘肃地图、五个独立主题页面及五题知识自测。

网站使用 React 19 和 Vite，保留确认后的深色版式、左侧地图目录、居中长文、主题照片与固定课程底栏。所有图片、脚本和样式由网站自身提供，无运行时第三方资源依赖。每个主题都有独立 HTML 入口，可直接打开和刷新。

## 本地开发

```sh
npm ci
npm run dev
```

## 构建与检查

```sh
npm run build
npm run preview
```

在另一个终端运行 `npm test`，验证八页内容、地图跳转、轮播自动播放与暂停、减少动态效果、目录高亮、自测评分、手机导航和 320/390/768/1237px 布局。检查默认使用 `http://127.0.0.1:4174/`，可通过 `SITE_BASE_URL` 指定其他地址。

浏览器检查使用 Playwright；Windows 默认寻找已安装的 Chrome，其他环境可运行 `npx playwright install chromium` 或通过 `CHROME_PATH` 指定 Chrome 路径。

## 发布

发布地址：<https://nyxscheppen.github.io/gansu-footprints/>

运行 `npm run build` 生成 `docs/`，然后将代码与构建产物提交、推送到 `main`。GitHub Pages 使用 `main` 分支的 `/docs` 目录发布，不需要后端、API 密钥或额外的构建服务。构建使用相对资源路径，支持 GitHub Pages 的仓库子目录。

```sh
npm run build
git add react-site source assets package.json package-lock.json vite.config.js docs README.md .gitignore
git commit -m "Update Gansu Footprints"
git push
```

## 文件

- `react-site/src/components/`：导航、底栏、来源说明、地图与轮播。
- `react-site/src/pages/`：首页、五境探索、主题文章与自测。
- `react-site/src/questions.json`：自测内容。
- `source/chapters.json`：五个主题的介绍与正文。
- `source/site.css`：已确认的样式。
- `assets/`：五张本地 WebP 图片。
- `docs/`：提交到 Pages 的构建产物。

原来的离线 HTML 预览和 Python 预览生成器仍保留在本地，生成文件不进入生产站点。运行 `python source/build_preview.py` 可更新 HTML 预览。

## 内容与图片来源

内容依据用户提供的演示文稿整理。神话传说按文化叙事呈现，不将未注明年份的数字作为当前统计。青铜器博物院的宝鸡考察与甘肃青铜遗存分开介绍。

图片来源包括敦煌研究院、新甘肃客户端、天水市融媒体中心、华声在线、新浪新闻与 Unsplash。苹果图片作为主题配图，不作为花牛苹果品种或产地的证明。页面来源说明保留原链接，详细元数据见 `source/fuxi-photo-source.json` 和 `source/scenic-photo-sources.json`。地图依据阿里云 DataV 行政区划数据，仅用于主题导航。
