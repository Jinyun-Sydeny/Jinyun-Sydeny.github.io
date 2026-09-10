# 蔡昕益作品集网站

当前为静态内容稿，尚未最终视觉通过。详情见 design-qa.md。

页面：src/Portfolio.jsx；样式：src/portfolio.css；图片/视频：public/assets。

已实现六幕、响应式内容排版、图片放大、折叠详情与视频原生控件。人物旋转尚未实现。人物原图含棋盘格，待抠图。

本地开发：安装依赖后运行 `pnpm dev --host 127.0.0.1 --port 4173 --strictPort`。
构建：`pnpm build`。

GitHub Pages：推送到公开 GitHub 仓库的 `main` 分支后，仓库内的 Actions 工作流会自动运行 `npm run build:pages` 并发布 `dist/client`。首次发布时，在仓库 Settings → Pages → Build and deployment 中选择 Source: GitHub Actions。

本轮使用捆绑Node与pnpm安装，pnpm报告esbuild构建脚本被忽略，但已成功运行Vite开发与生产构建。

素材源于 ../素材/图片，来源信息见该目录使用说明与来源清单。网页只复制选择的素材，未暴露原始客户文件。AI真人编辑图不是原始摄影。发布前需完成内部信息审阅及视频兼容检查。

2026-09-09 更新：六张人物已改为真正 RGBA 透明素材（原图保留）；视频改为三张可放大截图；桌面加入缓冲转身和色卡联动。窄于701px使用纵向静态布局。完整抠图输出保存在 ../素材/图片/透明人物，处理脚本在 ../tmp/matte_characters.py。参考视频已通过浏览器观察，使用其居中人物与色卡组合思路，并非逐帧复刻。
