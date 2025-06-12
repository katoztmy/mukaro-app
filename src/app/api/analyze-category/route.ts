import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { analyzeCategory, CategoryAnalysisResult } from "@/utils/categoryAnalysis";

// サーバーサイド用Supabaseクライアント（RLSをバイパス）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// 単一投稿のカテゴリ分析
export async function POST(request: NextRequest) {
  try {
    // リクエストボディを取得
    const { content, postId } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "content is required" },
        { status: 400 }
      );
    }

    // AIでカテゴリ分析
    const analysisResult: CategoryAnalysisResult = await analyzeCategory(content);

    // 投稿IDが指定されている場合はDBも更新
    if (postId) {
      const { error: updateError } = await supabase
        .from("posts")
        .update({
          category_id: analysisResult.categoryId,
          ai_category_confidence: analysisResult.confidence,
          ai_analyzed_at: new Date().toISOString(),
        })
        .eq("id", postId);

      if (updateError) {
        console.error("カテゴリ更新エラー:", updateError);
        return NextResponse.json(
          { error: "Failed to update category" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      category: analysisResult,
    });

  } catch (error) {
    console.error("カテゴリ分析エラー:", error);
    return NextResponse.json(
      { error: "Category analysis failed" },
      { status: 500 }
    );
  }
}

// 未分析投稿の一括分析
export async function PATCH(request: NextRequest) {
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

    // デバッグ: ユーザーIDを確認
    console.log("分析対象ユーザーID:", user.id);

    // 未分析の投稿を取得（最大10件ずつ処理）
    const { data: posts, error: fetchError } = await supabaseAdmin
      .from("posts")
      .select("id, content, user_id, category_id")
      .eq("user_id", user.id)
      .is("category_id", null)
      .limit(10);

    // デバッグ: 取得結果を確認
    console.log("取得した未分析投稿:", posts);
    console.log("取得エラー:", fetchError);

    if (fetchError) {
      throw fetchError;
    }

    if (!posts || posts.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No posts to analyze",
        analyzed: 0,
      });
    }

    let analyzed = 0;
    const results = [];

    // 各投稿を順次分析
    for (const post of posts) {
      try {
        const analysisResult = await analyzeCategory(post.content);
        
        // DBを更新
        const { error: updateError } = await supabaseAdmin
          .from("posts")
          .update({
            category_id: analysisResult.categoryId,
            ai_category_confidence: analysisResult.confidence,
            ai_analyzed_at: new Date().toISOString(),
          })
          .eq("id", post.id);

        if (!updateError) {
          analyzed++;
          results.push({
            postId: post.id,
            category: analysisResult,
          });
        } else {
          console.error(`投稿 ${post.id} の更新エラー:`, updateError);
        }

        // API制限を考慮して少し待機
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`投稿 ${post.id} の分析エラー:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      analyzed,
      total: posts.length,
      results,
    });

  } catch (error) {
    console.error("一括分析エラー:", error);
    return NextResponse.json(
      { error: "Batch analysis failed" },
      { status: 500 }
    );
  }
}