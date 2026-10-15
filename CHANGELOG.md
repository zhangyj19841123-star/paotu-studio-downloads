# 版本记录

软件各平台独立标注实际版本。本次发行修订沿用经核对的软件输入，保留历史安装包，不补造早期开发历史。

## Windows 0.5.2 / macOS 0.5.1

### Windows 0.5.2

- 发行修订 public-r1：新增中文启动检查与本地诊断入口，完善内置依赖及第三方材料。
- 清除发行副本中的本机构建路径，说明使用虚构示例；业务与离线授权逻辑不变。
- 便携目录发行，完整解压即可运行，内置 Python 与运行依赖。
- 改进离线申请码与激活流程，保持电脑绑定和到期续期。
- 沿用多模板、多表格、多工作表与多素材路径跑图能力。
- 包含 JPG / PNG 导出、SKU 命名、文案换行、居中和角标处理。

### macOS 0.5.1

- 发行修订 public-r2：清除本机构建路径，保留原版编译优化设置，补齐第三方构建与替换说明。
- 分别提供 Apple Silicon 和 Intel DMG，内置 Python 与运行依赖。
- 支持多模板、多表格与素材子文件夹匹配。
- 保留离线授权、JPG / PNG 导出、文案换行、居中和角标处理。

### 当前发行说明

Windows 0.5.2 与 macOS 0.5.1 是不同软件版本，不能把本 Release 的目录标签解释为三个包版本相同。当前 Windows 主程序未数字签名；Mac 尚未完成 Apple Developer ID 签名与公证。Windows 真机及所有 Mac 设备、系统组合仍需进一步验证。

对应 [中文 Release 说明](release-notes/v0.5.2.md) · [SHA-256](checksums/v0.5.2-SHA256SUMS.txt) · [历史 Release](https://github.com/zhangyj19841123-star/paotu-studio-downloads/releases)
