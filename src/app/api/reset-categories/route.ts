import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// サーバーサイド用Supabaseクライアント（RLSをバイパス）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// カテゴリ分析結果をリセット
export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // ユーザーの全投稿のカテゴリ分析結果をリセット
    const { data, error: updateError } = await supabaseAdmin
      .from("posts")
      .update({
        category_id: null,
        ai_category_confidence: null,
        ai_analyzed_at: null,
      })
      .eq("user_id", user.id)
      .select("id");

    if (updateError) {
      throw updateError;
    }

    console.log(`${user.id}のカテゴリ分析をリセット: ${data?.length || 0}件`);

    return NextResponse.json({
      success: true,
      message: `${data?.length || 0}件の投稿をリセットしました`,
      resetCount: data?.length || 0,
    });

  } catch (error) {
    console.error("カテゴリリセットエラー:", error);
    return NextResponse.json(
      { error: "Reset failed" },
      { status: 500 }
    );
  }
}