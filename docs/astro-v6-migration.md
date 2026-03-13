# Astro v6.0 移行ガイド

## 1. 概要

| 項目 | 内容 |
|------|------|
| 移行前バージョン | Astro 5.16.15 |
| 移行後バージョン | Astro 6.0.4 (`^6.0.0`) |
| 移行日 | 2026-03-13 |
| 対応PR | [#11](https://github.com/t-kimura/astro-blog/pull/11) - Astro v6.0 / Vite 8.0 移行, [#12](https://github.com/t-kimura/astro-blog/pull/12) - 環境変数を astro:env API に移行 |

## 2. 依存関係アップグレード

### Node.js 22.12.0 以上が必須

Astro v6 では Node.js 18 および 20 のサポートが廃止され、**Node.js 22.12.0 以上**が必須となった。

本プロジェクトでは CI ワークフロー（`.github/workflows/ci.yml`）に `actions/setup-node@v4` を追加し、`node-version: "22"` を明示的に指定して対応した（PR #11）。

### Vite 7.0 同梱

Astro v6 には Vite 7.0 が同梱されている。Vite の Environment API が導入され、クライアント・サーバー・プリレンダー環境の管理方式が変更された。本プロジェクトでは Vite プラグインとして `@tailwindcss/vite` を使用しているが、互換性に問題はなかった。

### Zod 4

Zod がメジャーバージョン 4 にアップグレードされた。`z.string().email()` が `z.email()` に変更されるなどの破壊的変更がある。本プロジェクトでは Zod を直接使用するコンテンツコレクションのスキーマ定義がないため、**影響なし**。

### Shiki 4.0

シンタックスハイライトライブラリ Shiki が 4.0 にアップグレードされた。本プロジェクトではシンタックスハイライトに `highlight.js` を使用しており、Shiki の API を直接利用していないため、**影響なし**。

## 3. 本プロジェクトで対応した破壊的変更

### 3.1 `import.meta.env` の常時インライン化と `astro:env` API 移行

#### 背景

Astro v6 では実験的フラグ `staticImportMetaEnv` がデフォルト動作として安定化された。これにより `import.meta.env` の値がビルド時に常にインライン化されるようになった。サーバー専用の秘匿情報（API キー等）が誤ってクライアントバンドルに含まれるリスクがあるため、`astro:env` API への移行が推奨されている。

#### 対応内容（PR #11 → PR #12 の2段階で実施）

**PR #11（暫定対応）**: `import.meta.env` を `process.env` に変更

```typescript
// Before (Astro v5)
const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

// After (PR #11 - 暫定)
const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN ?? "",
  apiKey: process.env.MICROCMS_API_KEY ?? "",
});
```

**PR #12（正式対応）**: `astro:env` API に移行

1. `astro.config.mjs` に環境変数スキーマを定義:

```javascript
import { defineConfig, envField } from "astro/config";

export default defineConfig({
  // ...
  env: {
    schema: {
      MICROCMS_SERVICE_DOMAIN: envField.string({
        context: "server",
        access: "secret",
      }),
      MICROCMS_API_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
});
```

2. `src/lib/microcms.ts` で型安全なインポートに変更:

```typescript
import { MICROCMS_API_KEY, MICROCMS_SERVICE_DOMAIN } from "astro:env/server";

const client = createClient({
  serviceDomain: MICROCMS_SERVICE_DOMAIN,
  apiKey: MICROCMS_API_KEY,
});
```

この対応により以下のメリットが得られた:

- 環境変数の型安全性が確保された
- `context: "server"` / `access: "secret"` により、クライアントバンドルへの漏洩が防止される
- `process.env` の空文字フォールバック（`?? ""`）が不要になった

### 3.2 CI の Node.js バージョン引き上げ（PR #11）

CI ワークフローの全ジョブ（lint, build, knip）に `actions/setup-node@v4` を追加し、Node.js 22 を明示的にセットアップするようにした。

変更箇所（`.github/workflows/ci.yml`）:

```yaml
steps:
  - uses: actions/checkout@v4

  # 追加
  - uses: actions/setup-node@v4
    with:
      node-version: "22"

  - uses: oven-sh/setup-bun@v2
    with:
      bun-version: "1.3.3"
```

### 3.3 Cheerio API の互換性対応（PR #11）

`src/utils/blog.ts` の目次抽出処理で、Cheerio の `element.tagName` プロパティへのアクセス方法を安全な形に修正した。

```typescript
// Before
const level = element.tagName === "h2" ? 2 : 3;

// After
const tagName = ("tagName" in element && element.tagName) || "";
const level = tagName === "h2" ? 2 : 3;
```

### 3.4 依存パッケージのアップグレード（PR #11）

| パッケージ | 移行前 | 移行後 |
|-----------|--------|--------|
| `astro` | `^5.16.15` | `^6.0.0` |
| `@astrojs/mdx` | `^4.3.13` | `^5.0.0` |
| `@astrojs/react` | `^4.4.2` | `^5.0.0` |
| `@astrojs/sitemap` | `^3.7.0` | `^3.7.1` |
| `@astrojs/check` | `^0.9.6` | `^0.9.7` |
| `@astrojs/partytown` | `^2.1.4` | `^2.1.5` |

## 4. 主要な破壊的変更一覧

| 破壊的変更 | 本プロジェクトへの影響 |
|-----------|---------------------|
| `import.meta.env` の常時インライン化 | **対応済み** - `astro:env` API に移行（PR #12） |
| Node.js 22.12.0 以上が必須 | **対応済み** - CI に setup-node 追加（PR #11） |
| `getStaticPaths()` 内の `Astro` オブジェクト非推奨 | **該当なし** - `getStaticPaths()` 内で `Astro` オブジェクトを使用していない |
| レガシーコンテンツコレクション（`legacy.collections`）削除 | **該当なし** - コンテンツコレクションを使用していない（microCMS を利用） |
| `<ViewTransitions />` の削除、`<ClientRouter />` に統一 | **該当なし** - View Transitions を使用していない |
| `Astro.glob()` 削除 | **該当なし** - `Astro.glob()` を使用していない |
| CommonJS 設定ファイル（`.cjs` / `.cts`）非サポート | **影響なし** - `astro.config.mjs` を使用している |
| スクリプト/スタイルタグの順序保持がデフォルト化 | **影響なし** - ソースコード順で問題ない構成になっている |
| エンドポイントの末尾スラッシュ付きアクセス不可 | **該当なし** - カスタムエンドポイントを定義していない |
| レスポンシブ画像のスタイル変更（インライン → `data-*` 属性） | **影響なし** - Astro のレスポンシブ画像機能を使用していない |
| 見出し ID 生成ロジックの変更 | **影響なし** - 独自の見出し ID 生成処理を使用している（`heading-${index}`） |
| `getStaticPaths()` の params に `number` 型不可 | **該当なし** - params は文字列で返している |
| i18n ルーティングのデフォルト変更 | **該当なし** - i18n 機能を使用していない |
| `emitESMImage()` 削除、`emitImageMetadata()` に変更 | **該当なし** - 該当 API を使用していない |
| パーセントエンコードされたルート（`%25`）の非サポート | **該当なし** - 該当するファイル名を使用していない |
| `astro:schema` 非推奨、`astro/zod` に変更 | **該当なし** - `astro:schema` を使用していない |
| `import.meta.env.ASSETS_PREFIX` 非推奨 | **該当なし** - 該当する環境変数を使用していない |

## 5. 非推奨化された機能

| 非推奨機能 | 代替 | 本プロジェクトへの影響 |
|-----------|------|---------------------|
| `astro:schema` からの Zod インポート | `astro/zod` を使用 | 該当なし |
| `import.meta.env.ASSETS_PREFIX` | `build.assetsPrefix`（`astro:config/server`） | 該当なし |
| `NodeApp` クラス | `createApp()` + `createRequest()` + `writeResponse()` | 該当なし（静的サイト生成） |
| `app.render()` のポジショナル引数 | オブジェクト形式で引数を渡す | 該当なし |
| セッションの `test` ドライバー | 削除 | 該当なし |

## 6. 実験的フラグの安定化・削除

以下の実験的フラグが安定化され、デフォルト動作となった。設定ファイルから削除する必要がある。

| フラグ | 状態 | 本プロジェクトへの影響 |
|-------|------|---------------------|
| `experimental.staticImportMetaEnv` | デフォルト動作として安定化 | **関連あり** - `astro:env` API 移行の背景（PR #12） |
| `experimental.preserveScriptOrder` | デフォルト動作として安定化 | 影響なし - フラグを使用していなかった |
| `experimental.headingIdCompat` | デフォルト動作として安定化 | 影響なし - 独自の見出し ID 生成を使用 |
| `experimental.csp` | 安定化 | 該当なし - CSP 機能を使用していない |
| `experimental.fonts` | 安定化 | 該当なし - Astro のフォント機能を使用していない |
| `experimental.liveContentCollections` | 安定化 | 該当なし - コンテンツコレクションを使用していない |
| `experimental.failOnPrerenderConflict` | `prerenderConflictBehavior` 設定に移行 | 該当なし - 該当設定を使用していない |

## 7. 参考リンク

- [Astro v6 公式アップグレードガイド](https://docs.astro.build/en/guides/upgrade-to/v6/)
- [Vite 7.0 移行ガイド](https://vite.dev/guide/migration)
- [Shiki 4.0 リリースノート](https://shiki.style/blog/v4)
- [Zod v3 → v4 コードmod](https://github.com/nicoespeon/zod-v3-to-v4)
- [astro:env API ドキュメント](https://docs.astro.build/en/guides/environment-variables/)
- [PR #11: Astro v6.0 / Vite 8.0 に移行](https://github.com/t-kimura/astro-blog/pull/11)
- [PR #12: 環境変数を astro:env API に移行](https://github.com/t-kimura/astro-blog/pull/12)
