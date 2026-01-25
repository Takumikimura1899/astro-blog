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
```

## 技術スタック

- **フレームワーク**: Astro 4.x（静的サイトジェネレーター）
- **UI**: React 18 + Tailwind CSS
- **CMS**: microCMS（ヘッドレス CMS）
- **Linter/Formatter**: Biome（タブインデント、ダブルクォート）

## アーキテクチャ

### コンテンツソース

- **ブログ記事**: microCMS API から取得（`src/lib/microcms.ts`）
  - 環境変数 `MICROCMS_SERVICE_DOMAIN` と `MICROCMS_API_KEY` が必要
- **フラッシュカード**: ローカルデータ（`src/data/flashcards/`）

### ディレクトリ構成

```
src/
├── components/      # Astro/Reactコンポーネント
│   ├── ui/          # 再利用可能なUIコンポーネント（shadcn/ui系）
│   └── flashcard/   # フラッシュカード用Reactコンポーネント
├── pages/           # ルーティング（Astroファイルベースルーティング）
├── layouts/         # ページレイアウト
├── lib/             # ユーティリティ・API クライアント
├── types/           # TypeScript型定義
├── constants/       # 定数
└── data/            # ローカルデータ（フラッシュカード等）
```

### パスエイリアス

`@/*` → `./src/*`（tsconfig.json で設定）
