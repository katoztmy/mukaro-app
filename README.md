# ムカログ (Mukaro)

ムカログは、日常のちょっとしたムカつきを皮肉や川柳に変換し、笑いやスッキリ感に昇華する Web アプリケーションです。

## 機能

- ムカつきを入力して、AI による大喜利風や川柳形式への変換
- 変換結果の SNS シェア機能
- 過去の投稿履歴の閲覧
- リアクション機能（スッキリ/うーん）

## セットアップ手順

### 必要条件

- Node.js 18.x 以上
- npm または yarn
- Supabase アカウント
- OpenAI API キー

### インストール

1. リポジトリをクローン

```bash
git clone <リポジトリURL>
cd mukaro-app
```

2. 依存パッケージのインストール

```bash
npm install
# または
yarn install
```

3. 環境変数の設定

プロジェクトのルートに`.env.local`ファイルを作成し、以下の環境変数を設定:

```
# Supabase接続情報
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI API
OPENAI_API_KEY=your-openai-api-key
```

### Supabase のセットアップ

1. [Supabase](https://supabase.com/)でアカウントを作成し、新しいプロジェクトを作成
2. `docs/supabase-setup.md`の手順に従ってテーブル構造を設定
3. 取得した Supabase URL と匿名キーを`.env.local`に設定

### 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
```

ブラウザで http://localhost:3000 を開いてアプリケーションにアクセスできます。

## デプロイ

### Vercel でのデプロイ

1. [Vercel](https://vercel.com)でアカウントを作成し、GitHub リポジトリを連携
2. プロジェクトの環境変数に`.env.local`と同じ変数を設定
3. デプロイボタンをクリック

## 技術スタック

- [Next.js](https://nextjs.org/) - React フレームワーク
- [TypeScript](https://www.typescriptlang.org/) - 型安全な JavaScript
- [Supabase](https://supabase.com/) - バックエンド（認証・データベース）
- [OpenAI API](https://openai.com/) - テキスト生成 AI
- [Tailwind CSS](https://tailwindcss.com/) - スタイリング

## トラブルシューティング

### Supabase 接続エラー

環境変数が正しく設定されていない場合、以下の手順で確認してください：

1. `.env.local`ファイルが正しい場所（プロジェクトのルートディレクトリ）に存在するか確認
2. Supabase URL とアノニマスキーが正しいか確認（Supabase ダッシュボードの「Settings > API」で確認可能）
3. 開発サーバーを再起動

### OpenAI API エラー

OpenAI API のリクエスト上限や認証エラーが発生した場合：

1. OpenAI API キーが有効か確認
2. API キーの利用制限（クォータ）を確認
3. 必要に応じて OpenAI のアカウントをアップグレード

## 貢献方法

プルリクエストは歓迎します。大きな変更を行う場合は、まず issue を作成して変更内容を議論してください。

## ライセンス

[MIT](https://choosealicense.com/licenses/mit/)
