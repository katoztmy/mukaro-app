# Supabase 設定手順

## 1. Supabase プロジェクトの作成

1. [Supabase](https://supabase.com/)にアクセスし、アカウントを作成またはログインします。
2. 「New Project」をクリックして新しいプロジェクトを作成します。
3. プロジェクト名（例: mukaro-app）を入力し、データベースパスワードを設定します。
4. リージョンを選択し（アジア圏の場合は東京がおすすめ）、「Create new project」をクリックします。

## 2. 環境変数の設定

1. プロジェクトが作成されたら、プロジェクトダッシュボードの「Settings」→「API」に移動します。
2. 表示される URL と API キーを`.env.local`ファイルに以下のように設定します：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 3. データベーステーブルの作成

Supabase ダッシュボードの「Table Editor」から以下のテーブルを作成します。
**重要: テーブルは以下の順序で作成してください。**

### categories テーブル（カテゴリ）

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  UNIQUE(name)
);

-- カテゴリはログインユーザーなら誰でも閲覧可能
CREATE POLICY "カテゴリはログインユーザーのみ閲覧可能" ON categories
  FOR SELECT USING (auth.role() = 'authenticated');
```

### profiles テーブル

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT
);

-- RLS (Row Level Security) ポリシー
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 自分のプロフィールのみ閲覧可能
CREATE POLICY "プロフィールは本人のみ閲覧可能" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- 自分のプロフィールのみ更新可能
CREATE POLICY "プロフィールは本人のみ更新可能" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 新規ユーザー登録時にプロフィールを自動作成するトリガー
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### posts テーブル（投稿）

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  result TEXT NOT NULL,
  style TEXT NOT NULL CHECK (style IN ('ogiri', 'senryu')),
  category_id UUID REFERENCES categories(id)
);

-- RLS ポリシー
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 自分の投稿のみ閲覧可能
CREATE POLICY "投稿は本人のみ閲覧可能" ON posts
  FOR SELECT USING (auth.uid() = user_id);

-- 自分の投稿のみ作成可能
CREATE POLICY "投稿は本人のみ作成可能" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 自分の投稿のみ更新可能
CREATE POLICY "投稿は本人のみ更新可能" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

-- 自分の投稿のみ削除可能
CREATE POLICY "投稿は本人のみ削除可能" ON posts
  FOR DELETE USING (auth.uid() = user_id);
```

### reactions テーブル（リアクション）

```sql
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('like', 'dislike')),
  UNIQUE(post_id, user_id)
);

-- RLS ポリシー
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- 自分のリアクションのみ閲覧可能
CREATE POLICY "リアクションは本人のみ閲覧可能" ON reactions
  FOR SELECT USING (auth.uid() = user_id);

-- 自分のリアクションのみ作成可能
CREATE POLICY "リアクションは本人のみ作成可能" ON reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 自分のリアクションのみ更新可能
CREATE POLICY "リアクションは本人のみ更新可能" ON reactions
  FOR UPDATE USING (auth.uid() = user_id);

-- 自分のリアクションのみ削除可能
CREATE POLICY "リアクションは本人のみ削除可能" ON reactions
  FOR DELETE USING (auth.uid() = user_id);
```

## 4. 初期カテゴリデータの挿入

```sql
INSERT INTO categories (name, color) VALUES
  ('交通・通勤', '#EFF6FF'),
  ('人間関係・職場', '#FAF5FF'),
  ('買い物・消費', '#FFF7ED'),
  ('生活・日常', '#F0F9FF'),
  ('その他', '#F5F5F4');
```

## 5. トークンの有効期限設定

1. Supabase ダッシュボードの「Authentication」→「Settings」に移動します。
2. 「JWT Expiry」を適切な値に設定します（例: 604800 秒 = 7 日）。

## 6. メール設定

1. Supabase ダッシュボードの「Authentication」→「Email Templates」に移動します。
2. 各種メールテンプレート（確認メール、パスワードリセットなど）をカスタマイズします。

## 7. API 操作テスト

### 環境変数の設定

1. プロジェクトのルートディレクトリに`.env.local`ファイルを作成します：

```bash
cd /path/to/mukaro-app
touch .env.local
```

2. 以下の内容を`.env.local`ファイルに追加します（Supabase プロジェクトの値に置き換えてください）：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 認証機能のテスト

1. プロジェクトを起動します：

```bash
npm run dev
```

2. ブラウザで以下の URL にアクセスして、アプリケーションが起動することを確認します：

   - http://localhost:3001

3. 次のテストを実施します：
   - `/signup`ページにアクセスして新規アカウント登録をテスト
   - `/login`ページでログインをテスト
   - ログイン後、保護されたページ（`/`や`/history`など）にアクセスできることを確認
   - ログアウト後、保護されたページにアクセスするとログインページにリダイレクトされることを確認

### Supabase ダッシュボードでの確認

1. Supabase ダッシュボードの「Authentication」→「Users」で、登録したユーザーが表示されることを確認します。

2. 「Table Editor」→「profiles」テーブルで、ユーザー登録時に自動作成されたプロフィールレコードを確認します。

### トラブルシューティング

登録やログインに問題がある場合：

1. ブラウザのコンソールでエラーメッセージを確認

2. 一般的な問題と解決策：

   - **「Invalid login credentials」**: メールアドレスまたはパスワードが間違っています
   - **「Email not confirmed」**: メール確認が必要です（Supabase ダッシュボードから手動で確認することも可能）
   - **「密度見積もりを実行できません」**: RLS ポリシーに問題があります。テーブルの RLS 設定を確認してください

3. Supabase ダッシュボードの「Authentication」→「Logs」でエラーログを確認
