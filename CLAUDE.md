# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## コマンド

```bash
# 開発サーバー起動
bun run dev

# ビルド（型チェック含む）
bun run build

# プレビュー（本番ビルド確認）
bun run preview

# Lint
bun run check

# フォーマット
bun run format

# 未使用コード検出
bun run knip

# Git hooks セットアップ（初回のみ）
bunx lefthook install
```

## 開発環境

- **Git hooks**: lefthookによりpre-commitでBiomeチェックが自動実行される
- **未使用コード検出**: knipで未使用のエクスポート、依存関係、ファイルを検出できる

## 技術スタック

- **フレームワーク**: Astro 5.x（静的サイトジェネレーター）
- **UI**: React 19 + Tailwind CSS 4
- **CMS**: microCMS（ヘッドレス CMS）
- **Linter/Formatter**: Biome 2.x（タブインデント、ダブルクォート）

## アーキテクチャ

### コンテンツソース

- **ブログ記事**: microCMS API から取得（`src/lib/microcms.ts`）
  - 環境変数 `MICROCMS_SERVICE_DOMAIN` と `MICROCMS_API_KEY` が必要
- **フラッシュカード**: ローカルデータ（`src/data/flashcards/`）

### ディレクトリ構成

```
src/
├── features/            # 機能（ドメイン）別モジュール
│   ├── blog/
│   │   ├── components/  # BlogCard, CategoryBadge
│   │   └── types.ts     # Blog, Category型
│   └── flashcard/
│       └── components/  # FlashcardItem, FlashcardPlayer
├── shared/              # 共有リソース
│   └── components/
│       ├── layout/      # Header, Footer, BaseHead
│       └── ui/          # 汎用UI（shadcn/ui系）
├── config/              # 設定・定数（site, blog, social）
├── data/                # ローカルデータ（フラッシュカード等）
├── layouts/             # ページレイアウト
├── lib/                 # 外部サービス連携（microCMS等）
├── pages/               # ルーティング
└── utils/               # ユーティリティ関数
```

### パスエイリアス

`@/*` → `./src/*`（tsconfig.json で設定）

## Orchestration Mode

Claudeはオーケストレーターとして振る舞い、直接実装を行わない。

### 基本原則

- **実装禁止**: コードの編集・作成は全てエージェントに委譲する
- **委譲徹底**: Task toolを使用してエージェントに作業を依頼する
- **品質管理**: エージェントからのフィードバックをレビューし、品質を担保する

### ワークフロー

1. ソースコードに差分が発生する場合、作業前にgit-worktree-branchエージェントでブランチを作成
2. タスクを分析し、適切なエージェントに委譲
3. エージェントからの結果をレビュー
4. 品質基準を満たさない場合:
   - 問題点を具体的に指摘
   - 修正を依頼
   - 品質を満たすまで繰り返す
5. 品質を満たした場合、ユーザーに報告

### エージェント選択ガイドライン

| タスク                   | 使用エージェント       | 備考                                          |
| ------------------------ | ---------------------- | --------------------------------------------- |
| PRコメント対応           | pr-comment-handler     | 1コメント=1コミット、コミットをコメントに返信 |
| コードレビュー           | code-review-specialist | 書いたコードの包括的レビュー                  |
| 探索・調査               | Explore                | コードベースの理解、ファイル検索              |
| ブランチ作成             | git-worktree-branch    | git worktreeでブランチ作成                    |
| PRマージ後クリーンアップ | pr-merge-cleanup       | worktree/ブランチ削除                         |
| 実装作業                 | general-purpose        | 上記に該当しない実装タスク                    |

### エージェントの問題報告

エージェントが期待通りに動作しない場合は、以下を報告する:

- 何を依頼したか
- 何が返ってきたか
- 何が問題か

## Git Commit Rules

- コミットメッセージに絵文字を含めない（Cloudflare Workers APIがUTF-8エラーを起こすため）
- Co-Authored-Byの署名も絵文字なしで記載する

## Pull Request Rules

- PRのタイトル・Summary・Test planは全て日本語で記述する
- 以下のフォーマットに従う:

```markdown
## 概要

- 変更内容を箇条書きで記述

## テスト計画

- [x] テスト項目をチェックリスト形式で記述

Closes #<issue番号>
```
