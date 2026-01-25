# Astro Blog

Astro + React + Tailwind CSS で構築した技術ブログサイト。microCMS をヘッドレス CMS として使用。

## 技術スタック

- **Astro 4.x** - 静的サイトジェネレーター
- **React 18** - UI コンポーネント
- **Tailwind CSS** - スタイリング
- **microCMS** - ヘッドレス CMS（ブログ記事管理）
- **Biome** - Linter / Formatter

## セットアップ

```bash
bun install
```

### 環境変数

`.env` ファイルを作成し、以下を設定:

```
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key
```

microCMS の管理画面から取得してください。

## コマンド

| コマンド          | 説明                                |
| ----------------- | ----------------------------------- |
| `bun run dev`     | 開発サーバー起動 (`localhost:4321`) |
| `bun run build`   | 本番ビルド（型チェック含む）        |
| `bun run preview` | ビルド結果のプレビュー              |
| `bun run check`   | Biome Lint                          |
| `bun run format`  | Biome Format                        |

## 機能

- ブログ記事一覧・詳細ページ
- ページネーション
- サイトマップ
- ダークモード切り替え
- フラッシュカード学習機能
