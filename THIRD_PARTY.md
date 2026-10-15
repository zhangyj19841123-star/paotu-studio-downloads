# 第三方组件、对应源码与动态库替换

适用发行系列：跑图工坊 Windows x64 0.5.2、macOS Apple Silicon / Intel 0.5.1。本文面向希望修改第三方组件的开发者；普通用户无需安装 Python、编译器或执行下列命令。

## 许可与材料位置

跑图工坊使用 Qt、PySide、Shiboken 等组件。相应组件的开源许可路线包含 LGPLv3；各文件的准确许可、例外及版权声明以随包原文为准。跑图工坊业务代码保持闭源，不因此向业务代码授予开源许可。

发行包包含 `第三方许可证/` 和 `第三方库对应源码/`。前者保存完整声明、GPL / LGPL 原文及组件清单，后者保存 Qt / PySide 对应版本的上游源码原始归档和 `SHA256SUMS`。请保留这些材料；官网链接不能代替已经附带的源码与声明。

Mac 对应五个归档：QtBase、QtSvg、QtImageFormats、QtTranslations 和 PySide / Shiboken 6.8.3。Windows 对应六个归档：上述同名 Qt 5.15.2 模块、QtDeclarative 5.15.2，以及 PySide / Shiboken 5.15.2.1。Windows 的 PySide 公共运行库依赖 QtQml，因此即使软件没有导入 Qml Python 模块，也保留 Qt5Qml.dll 及其对应 QtDeclarative 源码。不能把 Mac 的五个归档用于代替 Windows 的六个归档。

| 发行平台 | Python / 绑定 / Qt | 应用内声明位置 |
| --- | --- | --- |
| Windows x64 | CPython 3.8.20、PySide2 / Shiboken2 5.15.2.1、Qt 5.15.2 | `PaotuStudio/_internal/legal/` |
| macOS 两架构 | CPython 3.12、PySide6-Essentials / Shiboken6 6.8.3、Qt 6.8.3 | `跑图工坊.app/Contents/Resources/legal/` |

其他组件（如 CPython、Pillow、NumPy、SciPy 及所含原生库）的许可证也在随包清单中。Windows 的 Microsoft 运行库受其自身许可和平台限制约束，不因 Qt 或 Python 的许可而取得其他授权。

本软件的使用条款不限制第三方许可证允许的复制、修改、替换以及为调试此类修改而进行的逆向工程。替换兼容第三方库无需软件提供者签发库修改密钥。跑图工坊正常业务使用仍适用已有授权；第三方许可证独立授予的权利优先适用于对应组件。参见 [LGPLv3 原文](https://doc.qt.io/qt-6.8/lgpl.html) 和随包完整许可。

## 选择兼容的替换版本

请先复制整个应用目录，在副本中操作，保留原安装包。仅从可信来源取得组件；修改库可能改变安全性、稳定性、最低操作系统要求和图像输出。

- 使用与目标包相同的 CPU 架构、Qt 主次版本和公开接口。建议从同一补丁版本源码开始修改，不混用 Qt 5 与 Qt 6。
- PySide 与 Shiboken 使用同一版本、同一 C++ ABI 和相容的 Python ABI。单独升级其中一个可能导致启动失败。
- Windows 使用 x64、Release、MSVC 兼容 ABI；不要用 MinGW 构建的 Qt 替换此 MSVC 系列的库，也不要把 Debug 库混入 Release 包。保持对 Python 3.8 的兼容。
- Mac 使用 `arm64` 或 `x86_64` 对应切片；也可使用同时包含所需切片的 universal2 库。保持框架构建方式、`@rpath` / `@loader_path` 链接关系及符号链接，最低部署目标不高于应用声明的 macOS 12.3。
- 插件必须与 Qt 库配套。若改变 Qt 构建选项或内部接口，连同所有相依 Qt 框架、PySide / Shiboken 动态库和插件一起替换，并检查它们的依赖。

同版本的预编译候选可从 [PySide2 5.15.2.1](https://pypi.org/project/PySide2/5.15.2.1/#files)、[Shiboken2 5.15.2.1](https://pypi.org/project/shiboken2/5.15.2.1/#files)、[PySide6-Essentials 6.8.3](https://pypi.org/project/PySide6-Essentials/6.8.3/#files) 和 [Shiboken6 6.8.3](https://pypi.org/project/shiboken6/6.8.3/#files) 取得。wheel 是 ZIP 格式，可在独立目录解包后提取兼容原生库，不需要改动系统 Python。应核对 PyPI 提供的 SHA-256 和 wheel 的 `RECORD`。

## Windows：实际动态库位置与启动

下列路径以完整解压的便携包为起点。不要只复制 EXE；其 `_internal` 目录和依赖必须保留。

| 组件 | 相对路径 |
| --- | --- |
| Qt 动态库 | `PaotuStudio/_internal/PySide2/Qt5Core.dll`、`Qt5Gui.dll`、`Qt5Network.dll`、`Qt5Widgets.dll`、`Qt5Svg.dll`、`Qt5Qml.dll`，以及同目录实际存在的相依 Qt DLL |
| PySide 绑定 | `PaotuStudio/_internal/PySide2/QtCore.pyd`、`QtGui.pyd`、`QtNetwork.pyd`、`QtWidgets.pyd`、`QtSvg.pyd`、`pyside2.abi3.dll` |
| Shiboken 运行组件 | `PaotuStudio/_internal/shiboken2/shiboken2.pyd`、`shiboken2.abi3.dll` |
| Qt 插件 | `PaotuStudio/_internal/PySide2/plugins/`；包括 `platforms/qwindows.dll` 及实际保留的图片、样式等插件 |

退出所有跑图工坊进程，将新库复制到副本中上表的原位置；不要更改文件名。仅修改 QtCore 且保持接口兼容时可以只替换 Qt5Core.dll；较大修改应替换配套组件。不要覆盖 Python、跑图工坊业务模块、系统运行库、授权资料或无关文件。保存替换前后文件摘要，便于恢复和识别实际加载的版本。

可在命令提示符使用以下方法在临时用户状态中检查授权窗口能否出现。将示例路径换成你的副本位置；这不会把正式授权复制到测试位置。

```bat
set "PAOTU_TEST_STATE=%TEMP%\PaotuLibraryTest-%RANDOM%"
mkdir "%PAOTU_TEST_STATE%\Roaming"
mkdir "%PAOTU_TEST_STATE%\Local"
set "APPDATA=%PAOTU_TEST_STATE%\Roaming"
set "LOCALAPPDATA=%PAOTU_TEST_STATE%\Local"
set "PYTHONHOME="
set "PYTHONPATH="
set "QT_PLUGIN_PATH="
set "QT_QPA_PLATFORM_PLUGIN_PATH="
set "QT_DEBUG_PLUGINS=1"
"C:\PaotuLibraryTest\PaotuStudio\PaotuStudio.exe"
```

新的临时状态按未激活处理；出现授权窗口只证明启动及界面加载，不代表已经完成批量出图验证。业务出图测试应在经许可的隔离测试环境完成，不要公开申请码或激活码。需核验 Windows 7 兼容性时，应使用有必要系统补丁的真实 Windows 7 SP1 x64 机器；在 Wine 或较新 Windows 启动不等于已验证 Windows 7。

## Mac：实际动态库位置、签名与启动

在 Finder 中复制整个 `.app`，保留框架与资源的符号链接。下面的路径从副本 `跑图工坊.app` 开始。

| 组件 | 相对路径 |
| --- | --- |
| Qt 框架 | `Contents/Frameworks/PySide6/Qt/lib/QtCore.framework/Versions/A/QtCore`；同目录还包括 QtGui、QtWidgets、QtNetwork、QtDBus、QtSvg 框架 |
| PySide 原生绑定 | `Contents/Frameworks/PySide6/QtCore.abi3.so`、`QtGui.abi3.so`、`QtWidgets.abi3.so`、`QtNetwork.abi3.so`、`QtDBus.abi3.so`、`libpyside6.abi3.6.8.dylib` |
| Shiboken 运行组件 | `Contents/Frameworks/shiboken6/Shiboken.abi3.so`、`libshiboken6.abi3.6.8.dylib` |
| Qt 插件 | `Contents/Frameworks/PySide6/Qt/plugins/`，包括 `platforms/libqcocoa.dylib` 及图片、样式、TLS 等插件 |

同名框架的 `Versions/Current`、框架顶层入口和 `Contents/Resources` 中相关链接均需保留。Qt 框架使用版本目录 `A`；不要只复制脱离框架目录的文件。

本应用打包时把 wheel 中形如 `@rpath/QtCore.framework/Versions/A/QtCore` 的引用重定位为 `@rpath/QtCore`，并保留应用框架目录中的入口链接。因此从 wheel 或自行构建结果复制库时，必须在副本内同步安装名称、依赖名称和运行搜索路径；不能原样覆盖后就假设能加载：

1. 替换前，对副本中每个目标文件记录 `otool -D`、`otool -L` 及 `otool -l` 中的 `LC_RPATH`；对照新文件，记录 CPU 架构与部署目标。
2. universal2 文件可保留所需两种切片，或先用 `lipo 新文件 -thin arm64 -output 临时文件` 提取目标切片（Intel 用 `x86_64`）。不要对已经只有一个切片的文件重复 thin。
3. 用 `install_name_tool -id` 设置动态库的 `LC_ID_DYLIB`，用 `-change 旧引用 新引用` 修改相依组件引用；针对不同的 `LC_RPATH` 用 `-rpath 旧路径 新路径` / `-add_rpath` / `-delete_rpath` 保持副本原布局可解析。只修改本次新库，不改系统文件。若预留头部空间不足，应以适当链接选项重建新库，而不是修改错误偏移。

例如，新的 QtCore 框架本体应采用 `@rpath/QtCore`；新的 QtGui 本体或 QtCore Python 绑定若仍引用完整框架名称，应作相应重定位。这里 `incoming` 是已准备的新库目录：

```sh
install_name_tool -id '@rpath/QtCore' incoming/QtCore
install_name_tool -change '@rpath/QtCore.framework/Versions/A/QtCore' \
  '@rpath/QtCore' incoming/QtGui
install_name_tool -change '@rpath/QtCore.framework/Versions/A/QtCore' \
  '@rpath/QtCore' incoming/QtCore.abi3.so
```

对 QtGui、QtWidgets、QtNetwork、QtDBus、QtSvg 及相依插件逐项应用同一对应关系。PySide / Shiboken 也需对照原文件的 `@rpath/libpyside6.abi3.6.8.dylib`、`@rpath/libshiboken6.abi3.6.8.dylib` 与搜索路径；例如原 PySide 绑定使用 `@loader_path/..` 搜索应用框架目录。以原副本中实际记录为准，不向不存在的目录添加搜索项。复制后再次用 `otool -L` / `otool -l` 检查，确认所有非系统依赖都能在副本内部解析，避免加载构建电脑上的绝对路径。

修改内容会使原签名失效。对于自行修改的本地测试副本，可用系统工具重新 ad-hoc 签名并检查；这无需跑图工坊签名私钥，也不会取得 Apple Developer ID 或公证。以下命令只作用于指定副本；`--deep` 在此用于本地修改验证，不是正式发行签名流程。

```sh
PAOTU_TEST_APP="$HOME/Desktop/PaotuLibraryTest/跑图工坊.app"
codesign --force --deep --sign - "$PAOTU_TEST_APP"
codesign --verify --deep --strict "$PAOTU_TEST_APP"
```

请在单独的 macOS 测试用户账户运行副本，避免触碰原账户的设置或授权。本版本使用用户目录内的应用支持位置保存授权状态，仅设置 XDG 环境变量不足以隔离这些资料。把副本放在该测试账户可写的目录中，不要直接修改只读 DMG。以下命令在该独立测试账户执行，仅清除本次进程的 Python / Qt 搜索变量，不改变系统配置。

```sh
env -u PYTHONHOME -u PYTHONPATH -u QT_PLUGIN_PATH -u QT_QPA_PLATFORM_PLUGIN_PATH \
  QT_DEBUG_PLUGINS=1 "$PAOTU_TEST_APP/Contents/MacOS/PaotuStudio"
```

此隔离副本通常会显示未激活的授权窗口。不要为加载修改版库而关闭系统整体安全保护，也不要在公开材料中放入授权状态。重新分发你修改的第三方组件时，应保留许可证、提供适用的对应源码及修改说明，并另外遵守完整应用的分发权限。

## 从随包源码修改、编译并安装第三方库

下面提供可执行的构建起点，针对第三方 Qt / PySide / Shiboken，不需要跑图工坊业务源码或签发私钥。构建环境需自行准备；它与普通软件的免 Python 安装使用方式不同。官方 wheel 的完整编译配置未全部复现，故这些命令不是逐字节复现原 wheel 的承诺。

先对归档执行 SHA-256 核验，再解包到独立目录。Mac 可在源码目录执行 `shasum -a 256 -c SHA256SUMS`。Windows 可用 PowerShell `Get-FileHash -Algorithm SHA256` 对照 `SHA256SUMS`。保留原始归档、修改补丁、实际配置输出及构建日志。

### Windows / Qt 5.15.2 与 PySide2 5.15.2.1

需要 x64 MSVC 开发命令提示符、相容 Windows SDK、Python 3.8 x64 开发环境、CMake、Ninja 或 NMake、Perl，以及 PySide2 源码要求的 libclang。具体依赖以归档中的 `README.pyside2.md`、`README.shiboken2.md`、CMakeLists 和帮助为准。不要混入 MinGW ABI。

1. 解包 `qtbase-everywhere-src-5.15.2.tar.xz`、`qtsvg-everywhere-src-5.15.2.tar.xz`、`qtimageformats-everywhere-src-5.15.2.tar.xz` 和 `qtdeclarative-everywhere-src-5.15.2.tar.xz`。在源码中完成你的修改。
2. 假设源码在 `C:\QtLibraryTest\src`，构建与安装均在此独立目录中。使用 x64 MSVC 命令提示符：

```bat
mkdir C:\QtLibraryTest\build-base
cd /d C:\QtLibraryTest\build-base
call C:\QtLibraryTest\src\qtbase-everywhere-src-5.15.2\configure.bat -opensource -confirm-license -release -shared -platform win32-msvc -prefix C:\QtLibraryTest\qt -nomake tests -nomake examples -opengl dynamic
nmake
nmake install
mkdir C:\QtLibraryTest\build-svg
cd /d C:\QtLibraryTest\build-svg
C:\QtLibraryTest\qt\bin\qmake.exe C:\QtLibraryTest\src\qtsvg-everywhere-src-5.15.2\qtsvg.pro
nmake
nmake install
mkdir C:\QtLibraryTest\build-imageformats
cd /d C:\QtLibraryTest\build-imageformats
C:\QtLibraryTest\qt\bin\qmake.exe C:\QtLibraryTest\src\qtimageformats-everywhere-src-5.15.2\qtimageformats.pro
nmake
nmake install
mkdir C:\QtLibraryTest\build-declarative
cd /d C:\QtLibraryTest\build-declarative
C:\QtLibraryTest\qt\bin\qmake.exe C:\QtLibraryTest\src\qtdeclarative-everywhere-src-5.15.2\qtdeclarative.pro
nmake
nmake install
```

3. 解包 `pyside-setup-opensource-src-5.15.2.1.tar.gz`。此归档顶层目录名是 `pyside-setup-opensource-src-5.15.2`，不能仅凭目录名把其版本判作 5.15.2。准备 Python 3.8 x64 的独立开发虚拟环境和 libclang 后，在该源码顶层运行：

```bat
set "LLVM_INSTALL_DIR=C:\QtLibraryTest\libclang"
python setup.py install --ignore-git --qmake=C:\QtLibraryTest\qt\bin\qmake.exe --parallel=4 --limited-api=yes --module-subset=Core,Gui,Widgets,Network,Svg
```

该构建入口会处理 PySide2 和 Shiboken2。先在独立 Python 开发环境测试导入及绘制，再把生成的相容原生组件按上表替换到完整应用副本。Qt `bin` 的 DLL、`plugins` 的实际使用插件以及绑定 / Shiboken 的 DLL、PYD 应一起匹配。QtDeclarative 构建可能还会生成 QtQuick 等组件；不要据此把原应用未使用的模块或插件加入发行副本，应按实际依赖闭包选择，包括 pyside2.abi3.dll 所需的 Qt5Qml.dll。依赖查看工具应确认只从副本和合法系统位置加载。

### Mac / Qt、PySide6 与 Shiboken6 6.8.3

需要 Qt 6.8 支持的 Xcode / macOS SDK、CMake、Ninja、Python 3.12 开发环境以及匹配的 libclang。分别构建 `arm64` 和 `x86_64`，或按官方说明构建 universal2；目标系统下限与所有相依库必须匹配。参考 [Qt macOS 构建说明](https://doc.qt.io/qt-6.8/macos-building.html) 及归档内 README。

假设工作目录为 `~/QtLibraryTest`，已将 QtBase、QtSvg、QtImageFormats 的 6.8.3 归档解包到 `src/`。下面以 `arm64` 为例；Intel 应改为 `x86_64`，并使用支持该架构的工具链。

```sh
PAOTU_QT_WORK="$HOME/QtLibraryTest"
PAOTU_QT_ARCH="arm64"
mkdir -p "$PAOTU_QT_WORK/build-base"
cd "$PAOTU_QT_WORK/build-base"
"$PAOTU_QT_WORK/src/qtbase-everywhere-src-6.8.3/configure" \
  -opensource -confirm-license -release -shared \
  -prefix "$PAOTU_QT_WORK/qt" -nomake tests -nomake examples \
  -- -DCMAKE_OSX_ARCHITECTURES="$PAOTU_QT_ARCH" -DCMAKE_OSX_DEPLOYMENT_TARGET=12.3
cmake --build . --parallel 4
cmake --install .
mkdir -p "$PAOTU_QT_WORK/build-svg"
cd "$PAOTU_QT_WORK/build-svg"
"$PAOTU_QT_WORK/qt/bin/qt-configure-module" \
  "$PAOTU_QT_WORK/src/qtsvg-everywhere-src-6.8.3"
cmake --build "$PAOTU_QT_WORK/build-svg" --parallel 4
cmake --install "$PAOTU_QT_WORK/build-svg"
mkdir -p "$PAOTU_QT_WORK/build-imageformats"
cd "$PAOTU_QT_WORK/build-imageformats"
"$PAOTU_QT_WORK/qt/bin/qt-configure-module" \
  "$PAOTU_QT_WORK/src/qtimageformats-everywhere-src-6.8.3"
cmake --build "$PAOTU_QT_WORK/build-imageformats" --parallel 4
cmake --install "$PAOTU_QT_WORK/build-imageformats"
```

在已准备好 Python 开发虚拟环境的 `pyside-setup-everywhere-src-6.8.3` 源码顶层：

```sh
export LLVM_INSTALL_DIR="$HOME/QtLibraryTest/libclang"
python setup.py install --ignore-git --standalone --limited-api=yes \
  --qtpaths="$HOME/QtLibraryTest/qt/bin/qtpaths6" --parallel=4 \
  --macos-arch=arm64 --macos-deployment-target=12.3 \
  --module-subset=Core,Gui,Widgets,Network,DBus
```

Intel 应对应修改架构参数。此入口生成匹配的 PySide6 与 Shiboken6；保留 QtSvg 框架及 qsvg 插件，即使应用包没有 QtSvg Python 绑定。构建后先测试第三方组件，再按上表替换副本内的组件、保持框架布局和符号链接、核对动态链接并重新 ad-hoc 签名。参见 [Qt for Python 源码构建说明](https://doc.qt.io/qtforpython-6.8/building_from_source/index.html)。

### 配置、插件和翻译材料

上面的最小构建没有启用所有可选系统库或复现 wheel 的所有配置。要保留某个图片插件，必须在 configure 阶段满足其编解码依赖，并检查配置摘要；缺失的可选依赖不能靠复制不匹配插件补救。Qt SVG 及图片插件应与同批 Qt 构建一起安装。

随包 QtTranslations 源归档供对应翻译材料使用；如需修改 `.ts` 并重新生成 `.qm`，使用匹配版本 QtTools 的 `lrelease`（该工具及其构建依赖可从 Qt 官方取得），保留源文件与修改记录。没有修改的翻译文件可以继续使用其对应原始材料。若增加包内原来没有的 Qt 模块，应同时补充该模块的对应源码、许可证和依赖材料。

### 运行验证与证据范围

动态库路径与同版本组件替换可分别验证；同字节文件覆盖只验证替换位置，没有证明修改源码重建成功。Python 第三方初始化支持代码可能存放在冻结归档中；本文的相容原生库替换步骤不表示已替换这些初始化代码。若修改初始化行为或公开接口，应另行安排冻结归档中的对应第三方代码重组及验证，而不是混入不兼容版本。

验证应包括实际加载路径、库版本、界面启动、授权状态保持、预览及 JPG / PNG 输出。只在临时状态启动和显示授权窗口，不足以证明生产出图或所有平台兼容；当前发行说明应如实列出已执行和未执行的测试，不以另一架构或 Wine 测试替代真实设备测试。

本说明不声称已从修改后的 Qt / PySide 源码重建出所有目标架构的发行库，也不声称逐字节复现官方 wheel。随包源码、许可、动态库布局和本文构建 / 替换步骤应整体保留；具体版本的验证结果以该 Release 说明为准。

## 官方来源

- [Qt 5.15.2 子模块源码](https://download.qt.io/archive/qt/5.15/5.15.2/submodules/)
- [PySide2 5.15.2.1 源码](https://download.qt.io/official_releases/QtForPython/pyside2/PySide2-5.15.2.1-src/)
- [Qt 6.8.3 子模块源码](https://download.qt.io/archive/qt/6.8/6.8.3/submodules/)
- [PySide6 6.8.3 源码](https://download.qt.io/official_releases/QtForPython/pyside6/PySide6-6.8.3-src/)
- [Qt 6.8 configure 选项](https://doc.qt.io/qt-6.8/configure-options.html)
- [Microsoft UCRT 部署说明](https://learn.microsoft.com/en-us/cpp/windows/universal-crt-deployment?view=msvc-170)
