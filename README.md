# Zichen Sun — personal website

白底、黑色正文、蓝色链接的学术个人主页。普通静态网站，源码和内容归你所有；运行不需要 ChatGPT、Sites、账户登录、数据库、付费服务或外部字体。

- 主页：https://sunzichen-2004.github.io/
- CV：https://sunzichen-2004.github.io/cv.html
- 内容编辑器：https://sunzichen-2004.github.io/editor.html
- 在 GitHub 编辑内容：https://github.com/SunZichen-2004/SunZichen-2004.github.io/edit/main/content.json

日常更新只需修改根目录的 `content.json` 并提交。发布流程会自动生成并部署新版主页和 CV。

## 先预览

直接在浏览器打开 `site/index.html`。完整 CV 在 `site/cv.html`，可点击 **Print / Save as PDF** 打印或保存当前版本的 PDF。打印时可关闭浏览器的页眉页脚。

`site/` 已包含生成好的文件，因此预览不需要安装 Node.js，也不需要运行服务器。不要只复制 index.html，样式等文件也需要保留。

## 发布到 GitHub Pages（只需设置一次）

目标账户：`SunZichen-2004`。

1. 创建一个 **Public** 仓库，名称必须是 **SunZichen-2004.github.io**，默认分支为 `main`。
   创建入口：https://github.com/new?name=SunZichen-2004.github.io&description=Personal+academic+website+of+Zichen+Sun
2. 将本文件所在目录的所有内容上传到仓库**根目录**。根目录应直接包含 `content.json`、`build.mjs`、`src/` 和 `.github/workflows/pages.yml`，不要再套一层 `personal-website/`。
3. 在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
4. 在 **Actions → Publish personal website** 查看构建；如需手动触发，点击 **Run workflow**。
5. 部署成功后，访问 **https://sunzichen-2004.github.io/**。通常需要几分钟。

注意：`.github/` 是隐藏目录，手动拖拽上传时容易漏掉。可先显示隐藏文件（macOS Finder：Command + Shift + .），或用 Git 一次上传整个目录。若由助手上传，也应包含该目录。

仓库未创建前，以上地址只是目标网址，并不表示网站已经上线。

## 以后如何修改

### 方法一：直接在 GitHub 编辑（推荐）

打开仓库根目录的 `content.json` → 点击铅笔 → 修改文字 → **Commit changes**。GitHub Actions 会重新生成并发布主页和 CV，通常几分钟后生效。只需保留 JSON 的双引号、逗号、方括号等格式。

- `bio`：英文简介，每一项是一段。
- `interests`：研究兴趣。
- `photo`：个人照片路径；图片文件放在 `assets/` 目录。
- `publications`：已发表论文，可添加、删除、调整顺序。
- `manuscripts`：未发表稿件，状态应自行保持最新。
- `education` / `experience` / `awards` / `skills`：CV 内容。
- `updated`：页面底部的更新月份。

论文的 `abstract`、`code` 可留空；填入后自动显示相应入口。`url` 留空时不会生成假链接。

### 方法二：使用可视化编辑器

打开 `site/editor.html`（部署后为 `https://sunzichen-2004.github.io/editor.html`）：

1. 在左侧修改简介、论文、经历等内容，在右侧看实时预览。
2. 点击 **下载 content.json**。
3. 回到 GitHub 仓库，使用 **Add file → Upload files**，上传这个文件，替换根目录的 `content.json`，然后提交。
4. 等待 Actions 发布完成。

编辑器的草稿仅保存在当前浏览器，**下载后上传到 GitHub 才会更新网站**。它不是在线管理后台；访客即使打开编辑页，也只能编辑自己的本地草稿，无法修改你的线上网站。没有登录令牌或密钥放在网页里。

### 修改布局和配色

编辑 `src/style.css`；主要颜色为 `--ink: #111`、`--blue: #1456a0`。页面结构在 `src/render.js`。

### 本地重新生成

如果安装了 Node.js 22 或更高版本，在本目录运行：

```sh
node build.mjs
```

输出覆盖到 `site/`。无需 npm install，也没有第三方构建依赖。`site/` 是生成结果，长期编辑请改 `content.json` 或 `src/`，否则下次构建会覆盖手工修改。

## 内容来源与编辑说明

- 简历内容依据用户提供的 PDF；当前研究和简介依据用户本次补充。没有把“graduate student”写成在读硕士/博士，采用“a chemistry graduate of Peking University”。
- 简介经过轻度润色，Gábor Csányi 的姓名拼写已修正。没有将未来研究兴趣写成已完成成果。
- Google Scholar 于 2026-11-14 可读取的列表包含 3 篇论文：https://scholar.google.com/citations?user=5xdHA14AAAAJ&hl=en
- 酶动力学综述的卷期年份为 2027，已于 2026-11-03 在线发表，页面同时标注两个时间：https://pubmed.ncbi.nlm.nih.gov/42976647/
- ML/MM 论文 DOI：https://doi.org/10.1021/acs.jctc.6c00761
- 金属有机层综述 DOI：https://doi.org/10.1007/s11426-023-1784-8
- 2 篇稿件的作者、标题、状态来自提供的 CV，尚未从公开记录独立核实；与已发表论文分栏显示。没有编造预印本、代码链接或引用次数。
- 版式参考：https://lxzcpro.github.io/ 。页面为重新实现，没有复制该网站的文字、照片或资源。
- 个人照片由本人提供，保存在 `assets/zichen-sun.png`，按原图比例显示。`photo` 字段可修改照片路径。

GitHub Pages 官方指南：https://docs.github.com/en/pages/quickstart

GitHub Actions 发布配置：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
