import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ConvertStyle } from "@/utils/posts";
import { analyzeCategory } from "@/utils/categoryAnalysis";

// Supabaseクライアント初期化（サーバーサイドで使用するため）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 有効なスタイル一覧（型チェック用）
const validStyles = [
  "ogiri",
  "senryu",
  "manabi",
  "total_affirmation",
  "hissatsu_waza",
  "news_bulletin",
  "ijin",
  "chuunibyou",
  "high_consciousness",
  "epic_tale",
];

export async function POST(request: Request) {
  try {
    // 認証チェック
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "認証に失敗しました" },
        { status: 401 }
      );
    }

    // リクエストボディを解析
    const body = await request.json();
    const { content, result, style, categoryId } = body;

    // リクエストボディをログ出力
    console.log("APIリクエストボディ:", { content, result, style, categoryId });

    // 必須フィールドの検証
    if (!content || !result || !style) {
      return NextResponse.json(
        { error: "必須フィールドが不足しています" },
        { status: 400 }
      );
    }

    // スタイルの有効性をチェック
    if (!validStyles.includes(style)) {
      return NextResponse.json(
        { error: `無効なスタイル: ${style}` },
        { status: 400 }
      );
    }

    // AIカテゴリ分析を実行（並行処理）
    let categoryAnalysisResult = null;
    try {
      categoryAnalysisResult = await analyzeCategory(content);
      console.log("カテゴリ分析結果:", categoryAnalysisResult);
    } catch (error) {
      console.error("カテゴリ分析エラー:", error);
      // 分析に失敗してもエラーにはしない
    }

    // 投稿データの作成
    const postData = {
      content,
      result,
      style: String(style), // 明示的に文字列に変換
      category_id: categoryAnalysisResult?.categoryId || categoryId,
      ai_category_confidence: categoryAnalysisResult?.confidence,
      ai_analyzed_at: categoryAnalysisResult ? new Date().toISOString() : null,
      user_id: user.id,
    };

    // 保存直前のデータをログ出力（詳細版）
    console.log(
      "Supabaseに保存するデータ(API経由・詳細):",
      JSON.stringify(postData, null, 2)
    );
    console.log("スタイル値の型:", typeof postData.style);
    console.log(
      "スタイル値のプロトタイプ:",
      Object.prototype.toString.call(postData.style)
    );

    // Supabaseに保存（サービスロールキーでRLSをバイパス）
    console.log("🔍 Supabase insert実行前のスタイル:", style);
    const { data, error } = await supabase
      .from("posts")
      .insert([postData])
      .select();
    console.log("🔍 Supabase insert実行後:", error ? "エラー発生" : "成功");

    if (error) {
      console.error("投稿の保存に失敗しました:", error);
      console.error("エラーの詳細:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: `投稿の保存に失敗しました: ${error.message}` },
        { status: 500 }
      );
    }

    // 保存後のデータをログ出力（詳細版）
    console.log("保存成功(API経由・詳細):", JSON.stringify(data[0], null, 2));
    console.log("🔍 保存されたスタイル値:", data[0].style);
    console.log("🔍 保存されたスタイル値の型:", typeof data[0].style);

    // 成功レスポンスを返す
    return NextResponse.json({
      success: true,
      post: data[0],
    });
  } catch (error) {
    console.error("サーバーエラー:", error);

    // エラーメッセージを取得
    let errorMessage = "APIエラーが発生しました";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
