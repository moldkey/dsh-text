<p align="center"><strong>文本工具：全角转半角</strong></p>

全角字符转半角

## 安装（任选一种）

**1）插件市场（推荐）**：在 https://deepseekbase.com/zh/tools/ 搜索 text_fullwidth_to_half，点安装。

**2）命令行**：

    dsh plugin --profile web add dsh-text-fullwidth-to-half

**3）GitHub monorepo（不经 npm 也能装）**：

    dsh plugin --profile web add github:moldkey/dsh-text#path:/plugins/dsh-text-fullwidth-to-half

## 能做什么

- 全角字符转半角
- 本地执行，输入不出机器
- 只注册一个工具，不常驻进程、无需网络

## 用法

在会话里直接说「用全角转半角处理这段文本」，或调用工具 text_fullwidth_to_half。

    工具: text_fullwidth_to_half
    参数: text（必填）

## 示例

输入：

    Hello World
hello world
Hello World

工具会返回处理结果，末尾带全部工具入口。

## 兼容

- DSH >= 0.2.0-rc.2
- Node 18+
- 无外部依赖

## 更多

- 全部工具：https://deepseekbase.com/zh/tools/
- 同类插件：github.com/moldkey/dsh-text

## 许可

MIT
