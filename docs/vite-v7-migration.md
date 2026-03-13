# Vite 7 マイグレーションガイド

## 1. 概要

Astro 6.0.4 は内部的に Vite 7.3.1 を使用している。一方、プロジェクトルートにインストールされている vite 6.4.1 は `@tailwindcss/vite` の依存として存在する。Astro が自身の `node_modules` 配下に Vite 7 をネストしてインストールしているため、プロジェクトルートの Vite 6 と共存している状態である。

### バージョン関係

| パッケージ | バージョン | 備考 |
|---|---|---|
| astro | 6.0.4 | `vite: ^7.3.1` を依存として指定 |
| vite (Astro内部) | 7.3.1 | `node_modules/astro/node_modules/vite/` に配置 |
| vite (ルート) | 6.4.1 | `node_modules/vite/` に配置 |
| @tailwindcss/vite | 4.1.18 | `vite: ^5.2.0 \|\| ^6 \|\| ^7` をpeer dependencyとして指定 |

`@tailwindcss/vite` は Vite 5/6/7 いずれにも対応しているため、ルートに Vite 6 がインストールされている現状でも問題なく動作する。

## 2. 主要な破壊的変更

### Node.js 20.19+ / 22.12+ 必須（18サポート終了）

Node.js 18 は 2025年4月に EOL を迎えたため、Vite 7 ではサポートが終了した。Node.js 20.19 以上、または 22.12 以上が必要となる。この変更により、Vite 7.0 は ESM のみで配布されるようになった（ただし JavaScript API は CJS モジュールからの `require` にも対応）。

### デフォルトブラウザターゲットの引き上げ

`build.target` のデフォルト値が `'modules'` から `'baseline-widely-available'` に変更された。これは Baseline Widely Available（2025年5月時点）の基準に基づいている。

| ブラウザ | Vite 6 以前 | Vite 7 |
|---|---|---|
| Chrome | 87 | 107 |
| Edge | 88 | 107 |
| Firefox | 78 | 104 |
| Safari | 14.0 | 16.0 |

### Sass レガシー API 対応の削除

Dart Sass 1.45.0 でレガシー JS API が非推奨となり、Dart Sass v2.0 で完全に削除される予定である。これに合わせて、Vite 7.0 ではレガシー Sass API のサポートが削除され、モダン API のみがデフォルトとなった。`css.preprocessorOptions.sass.api` および `css.preprocessorOptions.scss.api` オプションは不要となり、削除可能。

### `splitVendorChunkPlugin` の削除

Vite 5.2.7 で非推奨となっていた `splitVendorChunkPlugin` が完全に削除された。チャンク分割の制御が必要な場合は、`build.rollupOptions.output.manualChunks` オプションを使用する。

### `transformIndexHtml` フックの変更

フックレベルの `enforce` プロパティと `transform` プロパティが削除された（Vite 4 で非推奨化済み）。それぞれ `order` と `handler` に置き換える必要がある。

### HMR API の変更

`import.meta.hot.accept` に URL を渡すことがサポートされなくなった。代わりに id を渡す必要がある。

### パッケージ解決の変更

`package.json` に `browser` フィールドと `module` フィールドの両方が存在する場合、Vite はこれまでファイル内容に基づいてヒューリスティックに解決していたが、Vite 7 ではこのヒューリスティックが廃止され、常に `resolve.mainFields` オプションの順序に従うようになった。

### `optimizeDeps.entries` の変更

`optimizeDeps.entries` はリテラルな文字列パスを受け付けなくなり、常に glob パターンとして扱われるようになった。

### その他の削除・変更

- `legacy.proxySsrExternalModules` の削除（Vite 6 で既に無効化されていた）
- `ModuleRunnerOptions.root` の削除
- `ViteDevServer._importGlobMap` の削除
- HMR 関連の型の削除: `HMRBroadcaster`, `HMRBroadcasterClient`, `ServerHMRChannel`, `HMRChannel`
- CSS プリプロセッサのピア依存バージョン範囲の指定
- 一部のミドルウェアが `configureServer` / `configurePreviewServer` フックより前に適用されるようになった

## 3. 新機能

### Environment API の継続開発

Vite 6 で導入された実験的な Environment API の開発が継続されている。Vite 7 では新たに `buildApp` フックが追加され、プラグインが複数の環境のビルドを協調して行えるようになった。

### Rolldown 統合の進行

VoidZero チームが開発する Rust ベースの次世代バンドラー Rolldown との統合が進行中である。現時点では `rolldown-vite` パッケージを `vite` の代わりに使用することで試すことができる。これはドロップイン置換として設計されており、将来的に Vite のデフォルトバンドラーとなる予定である。

なお、Vite 8 では実際に Rolldown と Oxc が esbuild と Rollup を置き換える形で統合された。

### Vite DevTools

VoidZero と NuxtLabs の協力により、Anthony Fu が Vite DevTools を開発中。全ての Vite ベースプロジェクトに対して、より深いデバッグと分析機能を提供する予定。

## 4. 本プロジェクトへの影響

### Node.js 要件

Astro 6 は Node.js 22 以上を推奨しており、本プロジェクトの CI/CD 環境も Node.js 22 を使用しているため、問題なし。

### Sass / splitVendorChunkPlugin

本プロジェクトでは Sass を使用しておらず（Tailwind CSS 4 を使用）、`splitVendorChunkPlugin` も未使用のため、これらの破壊的変更による直接的な影響はない。

### ブラウザターゲット

デフォルトブラウザターゲットの引き上げ（Chrome 107, Firefox 104, Safari 16.0）は、技術ブログとしての読者層を考えると問題ない範囲である。

### Tailwind CSS Vite プラグイン

`@tailwindcss/vite` 4.1.18 は `vite ^5.2.0 || ^6 || ^7` をピア依存として指定しているため、ルートにインストールされた Vite 6.4.1 との互換性に問題はない。Astro 内部の Vite 7.3.1 とも互換性がある。

### HMR / パッケージ解決の変更

Astro が Vite を内部的にラップしているため、`import.meta.hot.accept` の変更やパッケージ解決の変更は Astro プラグインやフレームワークレベルで吸収されており、本プロジェクトに直接的な影響はない。

## 5. 今後の展望

Vite 8 では Rolldown（Rust ベースバンドラー）と Oxc の統合が完了し、esbuild と Rollup を完全に置き換えた。主な変更点は以下の通り:

- `build.rollupOptions` が `build.rolldownOptions` にリネーム（旧名は非推奨）
- `optimizeDeps.esbuildOptions` が `optimizeDeps.rolldownOptions` に移行
- JavaScript の変換とミニファイに Oxc を使用
- CSS のミニファイに Lightning CSS をデフォルト使用

Astro 側でも Vite 8 への対応が進む見込みであり、その際には Rolldown ベースのビルドパイプラインに移行することになる。ビルド速度の大幅な改善が期待される。

## 6. 参考リンク

- [Vite 7.0 is out! (公式ブログ)](https://vite.dev/blog/announcing-vite7)
- [Migration from v6 (公式マイグレーションガイド)](https://v7.vite.dev/guide/migration)
- [Vite 7.0 - All Major Changes (syntackle.com)](https://syntackle.com/blog/vite-7-is-here/)
- [Breaking Changes (公式)](https://vite.dev/changes/)
- [Vite 8.0 is out! (公式ブログ)](https://vite.dev/blog/announcing-vite8)
- [Rolldown - Rust-based bundler for Vite](https://rolldown.rs/)
