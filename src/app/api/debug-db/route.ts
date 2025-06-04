import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabaseクライアント初期化（サーバーサイドで使用するため）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  try {
    // 認証チェック（本番環境では必要に応じて認証を追加）

    // postsテーブルの情報を取得
    const { data: tableInfo, error: tableError } = await supabase.rpc(
      "get_table_info",
      { table_name: "posts" }
    );

    if (tableError) {
      console.error("テーブル情報の取得に失敗:", tableError);
      // RPC関数がない場合は代替方法で情報取得
      const { data: columns, error: columnsError } = await supabase
        .from("information_schema.columns")
        .select("*")
        .eq("table_name", "posts");

      if (columnsError) {
        console.error("カラム情報の取得に失敗:", columnsError);
        return NextResponse.json(
          { error: "データベース情報の取得に失敗しました" },
          { status: 500 }
        );
      }

      // テーブル制約情報の取得
      const { data: constraints, error: constraintsError } = await supabase
        .from("information_schema.table_constraints")
        .select("*")
        .eq("table_name", "posts");

      // カラム制約の詳細情報を取得
      const { data: checkConstraints, error: checkError } = await supabase.rpc(
        "exec_sql",
        {
          sql: `
            SELECT con.conname, con.contype, 
                  pg_get_constraintdef(con.oid) as definition
            FROM pg_constraint con
            JOIN pg_class rel ON rel.oid = con.conrelid
            JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
            WHERE rel.relname = 'posts'
          `,
        }
      );

      if (checkError) {
        console.error("制約詳細情報の取得に失敗:", checkError);
      }

      // style列の詳細情報を取得
      const { data: styleColumn, error: styleError } = await supabase.rpc(
        "exec_sql",
        {
          sql: `
            SELECT column_name, data_type, is_nullable, column_default, 
                   udt_name, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'posts' AND column_name = 'style'
          `,
        }
      );

      if (styleError) {
        console.error("style列情報の取得に失敗:", styleError);
      }

      // styleに関する特殊な型情報を取得
      const { data: styleTypeInfo, error: styleTypeError } = await supabase.rpc(
        "exec_sql",
        {
          sql: `
            SELECT t.typname, t.typtype, t.typcategory,
                   array_to_string(array_agg(e.enumlabel), ', ') as enum_values
            FROM pg_type t
            LEFT JOIN pg_enum e ON t.oid = e.enumtypid
            WHERE t.typname = 'style_type' OR t.typname = 'style_type_new'
               OR t.typname LIKE '%style%'
            GROUP BY t.typname, t.typtype, t.typcategory
          `,
        }
      );

      if (styleTypeError) {
        console.error("style型情報の取得に失敗:", styleTypeError);
      }

      // テーブルの全カラム情報を取得
      const { data: allColumns, error: allColumnsError } = await supabase.rpc(
        "exec_sql",
        {
          sql: `
            SELECT column_name, data_type, udt_name
            FROM information_schema.columns
            WHERE table_name = 'posts'
            ORDER BY ordinal_position
          `,
        }
      );

      if (allColumnsError) {
        console.error("全カラム情報の取得に失敗:", allColumnsError);
      }

      // postsテーブルのトリガー情報を取得
      const { data: triggers, error: triggerError } = await supabase.rpc(
        "exec_sql",
        {
          sql: `
            SELECT trigger_name, action_timing, event_manipulation, 
                  action_statement
            FROM information_schema.triggers
            WHERE event_object_table = 'posts'
          `,
        }
      );

      if (triggerError) {
        console.error("トリガー情報の取得に失敗:", triggerError);
      }

      return NextResponse.json({
        columns,
        constraints,
        checkConstraints: checkConstraints || null,
        styleColumn: styleColumn || null,
        styleTypeInfo: styleTypeInfo || null,
        allColumns: allColumns || null,
        triggers: triggers || null,
        message: "RPCメソッドがなかったため代替方法で取得しました",
      });
    }

    // 直近の投稿を1件取得
    const { data: recentPost, error: postError } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    if (postError) {
      console.error("最新の投稿取得に失敗:", postError);
    }

    return NextResponse.json({
      tableInfo,
      recentPost: recentPost?.[0] || null,
    });
  } catch (error) {
    console.error("データベース情報取得中のエラー:", error);
    return NextResponse.json(
      { error: "データベース情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}
