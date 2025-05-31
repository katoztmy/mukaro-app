import { createClient } from "@supabase/supabase-js";

// 環境変数からSupabaseの接続情報を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// 環境変数が設定されていない場合のエラーチェック
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase環境変数が設定されていません。.env.localファイルに以下の変数を設定してください：\n" +
      "NEXT_PUBLIC_SUPABASE_URL=あなたのSupabase URL\n" +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのSupabase匿名キー"
  );

  // 開発環境では警告を表示
  if (process.env.NODE_ENV === "development") {
    if (typeof window !== "undefined") {
      window.alert(
        "Supabase環境変数が設定されていません。\n\n" +
          ".env.localファイルを作成し、以下の変数を設定してください：\n" +
          "NEXT_PUBLIC_SUPABASE_URL=あなたのSupabase URL\n" +
          "NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのSupabase匿名キー\n\n" +
          "Supabaseダッシュボードから接続情報を取得できます。"
      );
    }
  }
}

// Supabaseクライアントの作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Supabaseの接続を初期化するときのメッセージ
console.log(
  `Supabase初期化: URL設定=${!!supabaseUrl}, Key設定=${!!supabaseAnonKey}`
);
