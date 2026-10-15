# 跑图工坊 · Paotu Studio

把 PSD / PSB 模板、Excel 需求表和产品素材串联起来，批量导出商品图片。

内置 Python 与运行依赖，无需安装 Photoshop。软件使用离线授权，公开下载不代表免费授权使用。

## 下载

[软件下载页面](https://zhangyj19841123-star.github.io/paotu-studio-downloads/) · [最新 Release](https://github.com/zhangyj19841123-star/paotu-studio-downloads/releases/latest) · [历史版本](https://github.com/zhangyj19841123-star/paotu-studio-downloads/releases)

| 平台 | 软件版本 | 发行形式 | 下载 |
| --- | --- | --- | --- |
| Windows x64 | 0.5.2 | 便携 ZIP，完整解压后运行 | [Windows 下载](https://github.com/zhangyj19841123-star/paotu-studio-downloads/releases/latest/download/PaotuStudio-windows-x64.zip) |
| Mac Apple Silicon | 0.5.1 | DMG | [Apple Silicon 下载](https://github.com/zhangyj19841123-star/paotu-studio-downloads/releases/latest/download/PaotuStudio-macos-arm64.dmg) |
| Mac Intel | 0.5.1 | DMG | [Intel 下载](https://github.com/zhangyj19841123-star/paotu-studio-downloads/releases/latest/download/PaotuStudio-macos-x86_64.dmg) |

各平台按实际软件版本标注。下载文件采用固定名称，实际版本、大小及 SHA-256 见 [版本清单](releases.json)。需要锁定旧版本时，请从历史 Release 下载。

## 主要功能

- 从 PSD / PSB 读取图层，结合表格替换文字和图片素材。
- 支持多个 Excel 文件、多工作表，以及多个素材目录。
- 根据“类型”等模板匹配字段选择同名模板，按模板生成输出子文件夹。
- 以 SKU 或商品名称匹配主品并命名输出，具体取决于表格字段。
- 文案中的 `/` 表示换行；支持文字居中和约定格式的角标。
- 导出 JPG 或 PNG，默认 JPG 白底、质量 100%。

## 使用前请阅读

[安装与使用说明](INSTALL.md) · [版本记录](CHANGELOG.md) · [版权及使用条款](TERMS.md)

Windows 当前公开提供测试版，仍待 Windows 10/11 故障电脑实机复测；请先小批量验证。公开发行修订包在解压根目录提供 `跑图工坊.exe` 启动入口和 `运行环境诊断.exe`。请保留整个目录，不要单独复制主程序。修改第三方组件的开发者另见 [第三方组件与替换说明](THIRD_PARTY.md)。

Mac 目标系统为 macOS 12.3 及以上，需选择匹配芯片的版本。当前 Mac 包未完成 Apple Developer ID 签名和公证，首次启动可能被系统拦截。Windows 目标为 Windows 7 SP1 x64 及之后版本，旧系统需必要更新；Windows 程序未签名。兼容目标不代表每个系统和设备均已实机验证，请先做小批量测试。

## 仓库范围

本仓库仅存放介绍、帮助文档、下载网页和公开版本信息。软件安装包通过 Releases 分发；软件业务源码和授权签发资料不在本仓库。

GitHub 自动生成的 “Source code” 压缩包只包含本下载站文件，不是软件安装包。下载软件请使用上述平台入口。

© 2026 曼陀罗。保留所有权利。软件业务代码采用闭源发布；第三方组件遵循各自许可证。

## 操作教程与文档

网站“操作教程”区域提供约 2 分 16 秒的点击播放视频，以及操作说明 PDF 的在线查阅和下载。

- [观看操作教程](https://zhangyj19841123-star.github.io/paotu-studio-downloads/#tutorial)
- [操作说明 PDF](assets/paotu-studio-operation-guide.pdf)
- [教程资料 SHA-256](checksums/tutorial-20261015-SHA256SUMS.txt)

视频保存在 v0.5.2 Release 的独立教程附件中，不加入普通 Git 历史。原有软件版本、安装包及授权要求保持不变。
