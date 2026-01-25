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
