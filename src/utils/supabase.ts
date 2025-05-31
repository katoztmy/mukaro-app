import { createClient } from "@supabase/supabase-js";

// 環境変数からSupabaseの接続情報を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// 環境変数が設定されていない場合のエラーチェック
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase環境変数が設定されていません。.env.localファイルを確認してください。"
  );
}

// Supabaseクライアントの作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
