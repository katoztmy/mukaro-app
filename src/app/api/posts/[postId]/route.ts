import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabaseクライアント初期化（サーバーサイドで使用するため）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function PATCH(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;

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
    const { labeledEmotions, reframingAnswer } = body;

    // 投稿の存在確認と所有者チェック
    const { data: existingPost, error: fetchError } = await supabase
      .from("posts")
      .select("id, user_id")
      .eq("id", postId)
      .single();

    if (fetchError || !existingPost) {
      return NextResponse.json(
        { error: "投稿が見つかりません" },
        { status: 404 }
      );
    }

    if (existingPost.user_id !== user.id) {
      return NextResponse.json(
        { error: "この投稿を更新する権限がありません" },
        { status: 403 }
      );
    }

    // 更新データの準備
    const updateData: any = {};
    
    if (labeledEmotions !== undefined) {
      updateData.labeled_emotions = labeledEmotions;
    }
    
    if (reframingAnswer !== undefined) {
      updateData.reframing_answer = reframingAnswer;
    }

    // 少なくとも一つの更新フィールドがあることを確認
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "更新するデータがありません" },
        { status: 400 }
      );
    }

    // 投稿を更新
    const { data, error } = await supabase
      .from("posts")
      .update(updateData)
      .eq("id", postId)
      .select();

    if (error) {
      console.error("投稿の更新に失敗しました:", error);
      return NextResponse.json(
        { error: `投稿の更新に失敗しました: ${error.message}` },
        { status: 500 }
      );
    }

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