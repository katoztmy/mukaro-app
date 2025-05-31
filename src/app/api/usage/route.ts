import { NextResponse } from "next/server";
import { getUserApiUsage } from "@/utils/apiLimits";
import { createClient } from "@supabase/supabase-js";

// Supabaseクライアント初期化
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
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

    // ユーザーのAPI使用回数を取得
    const { usageCount, maxDailyLimit, remainingCalls, isLimitReached } =
      await getUserApiUsage(user.id);

    // クライアントに使用状況を返す
    return NextResponse.json({
      success: true,
      limit: {
        usageCount,
        maxDailyLimit,
        remainingCalls,
        isLimitReached,
        resetTime: "翌日0時",
      },
    });
  } catch (error) {
    console.error("API使用状況の取得中にエラーが発生しました:", error);

    // エラーメッセージを取得
    let errorMessage = "APIエラーが発生しました";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    // クライアントにエラーレスポンスを返す
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
