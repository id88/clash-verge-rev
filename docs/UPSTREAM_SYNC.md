# 上游代码同步与冲突解决指南 (Upstream Sync Guide)

本文档记录本项目（基于 [clash-verge-rev](https://github.com/clash-verge-rev/clash-verge-rev) 的个性化定制/换肤版）在同步官方上游更新时的原理、常见问题及标准操作流程。

---

## 一、问题背景与原理解析

### 1. 为什么不能直接下载源码上传？
* **Git 历史割裂（Unrelated Histories）**：如果直接从 GitHub 下载 ZIP 压缩包并在本地 `git init` 上传，本地的提交历史树是一个全新的根节点，与官方数千个 commit 历史完全断开。后续执行 `git merge` 时 Git 会报 `refusing to merge unrelated histories` 且无法定位公共祖先。
* **正确做法**：必须通过 GitHub 官方的 **Fork** 机制建立仓库，让本地分支与官方仓库的历史树共享同一个提交基底（Commit Base）。

### 2. 为什么 GitHub 网页端的「Sync fork」会提示冲突？
当你进入 GitHub 仓库点击 **Sync fork** 时，经常会弹出警告：
> *"This branch has conflicts that must be resolved"*

**原因剖析**：
1. **GitHub 网页端限制**：GitHub 网页端的「Sync fork」仅支持**全自动零冲突合并**。只要有任意一个文件被双方同时修改且产生冲突，网页端就无法自动决断。
2. **本项目的微小冲突点**：
   * 本地定制版为了适配本机的开发环境与 CI 构建稳定性，在 `package.json` 中锁定了 `packageManager: pnpm@10.18.1`，并将部分插件源改为了 HTTPS 地址。
   * 官方几乎每次发版（如 `v2.5.7`、`v2.5.8`）都会升级其构建工具链（如升到 `pnpm@12.10.0`）并重新生成几万行的依赖锁文件 `pnpm-lock.yaml`。
   * **实质情况**：你的 UI 换肤、主题、业务功能代码与官方没有任何冲突，冲突仅存在于 `package.json` 的包管理器版本声明和锁文件。

---

## 二、GitHub 弹窗按钮的危险与含义

在 GitHub 网页端点击「Sync fork」弹出冲突窗口时，会出现两个按钮：

| 按钮 | 含义与风险 | 是否点击 |
| :--- | :--- | :--- |
| **🔴 Discard XX commits** | **【极度危险】** 直接丢弃你自己的所有修改和定制提交，强制将你的仓库重置为官方原版。一旦点击，所有换肤和功能定制全部丢失！ | **绝对不要点击** ❌ |
| **🟢 Open pull request** | 向 GitHub 申请开一个合并请求（PR），尝试在网页端对比并解冲突。但由于网页端无法高效解决几万行的锁文件冲突，且本项目为个人定制版不需要向上游提 PR。 | **无需点击** ❌ |

> **处理原则**：看到该弹窗时，直接**关闭或点叉退出**，在本地命令行执行标准同步流程。

---

## 三、标准本地同步工作流（推荐步骤）

每次官方发布新版本后，请在本地终端按以下 6 个标准步骤完成平滑升级：

### 第 1 步：备份当前分支（防意外）
```bash
git branch backup-before-sync
```

### 第 2 步：拉取官方上游最新代码
确保本地已配置 `upstream` 远程源（`https://github.com/clash-verge-rev/clash-verge-rev.git`）：
```bash
git fetch upstream
```

### 第 3 步：合并官方主分支
```bash
git merge upstream/main
```
*此时 Git 通常会提示 `package.json` 和 `pnpm-lock.yaml` 存在冲突。*

### 第 4 步：解决包管理器与锁文件冲突
1. 打开 `package.json`，在末尾的冲突标记中，保留本地的 `packageManager`（例如 `pnpm@10.18.1`）以及 `tauri-plugin-mihomo-api` 的 HTTPS 依赖地址（同时核对其 commit hash 是否与上游新版本一致），删掉冲突标记：
   ```json
   "type": "module",
   "packageManager": "pnpm@10.18.1"
   ```
2. 采用本地现有依赖为基础，让 pnpm 自动重新生成依赖锁文件：
   ```bash
   git checkout --ours pnpm-lock.yaml
   pnpm install
   ```
3. 暂存已解决的文件：
   ```bash
   git add package.json pnpm-lock.yaml
   ```

### 第 5 步：合并后必做检查（重要：避免无冲突合并导致的编译失败）
即使 `git merge` 没有报代码冲突，上游重命名函数、调整前后端类型契约或升级 Rust 工具链仍可能导致 CI 打包失败。提交和推送前务必完成以下轻量检查：

1. **对齐 CI 工具链版本**：核对上游的 `rust-toolchain.toml` 与本项目 `.github/workflows/macos-arm64.yml` 中的 `toolchain`（Rust 版本）是否一致；若上游升级了 Rust 版本，同步更新 `macos-arm64.yml`。
2. **仅在本地做前端静态检查（不要在本地执行 Tauri / Rust 完整打包）**：
   ```bash
   pnpm run typecheck
   pnpm test
   ```
   - `pnpm run typecheck`（`tsrs -p . --noEmit`）只需几秒即可捕获像上游重命名 API 或收紧 nullable 类型导致的定制代码报错（重点关注 `src/hooks/use-system-proxy-state.ts`、`src/pages/home.tsx`、`src/components/layout/layout-sidebar.tsx` 等定制文件）。
   - 安装包编译打包一律交给 GitHub Actions（`.github/workflows/macos-arm64.yml`），不要在本地运行 `pnpm build` / `tauri build`。
3. **提交合并**：
   ```bash
   git commit -m "chore: merge upstream/main vX.X.X"
   ```
   *（提交时会自动运行 pre-commit 钩子进行代码校验，推送前会自动运行 `typecheck` 和 `knip:check`，等待完成即可）*

### 第 6 步：推送到个人 GitHub 仓库并观察 Actions 构建
```bash
git push origin main
```
*推送完成后，GitHub Actions 会自动触发 `macOS arm64` 工作流编译并发布最新的 `.dmg` 到 `macos-arm64` rolling release。确认新版本安装验证无误后，再删除第 1 步创建的临时备份分支（`git branch -d backup-before-sync`）。*

---

## 四、故障应急与回滚指南

* **如果在合并过程中出现混乱，想完全撤销重来**：
  ```bash
  git merge --abort
  ```
* **如果合并后发现异常，想回滚到合并前的状态**：
  ```bash
  git reset --hard backup-before-sync
  ```
