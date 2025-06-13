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

    // URLパラメータを解析
    const url = new URL(request.url);
    const year = parseInt(url.searchParams.get("year") || "");
    const month = parseInt(url.searchParams.get("month") || "");

    if (!year || !month || month < 1 || month > 12) {
      return NextResponse.json(
        { error: "有効な年月を指定してください" },
        { status: 400 }
      );
    }

    // 対象月の開始日と終了日を計算
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const startDateString = startDate.toISOString().split('T')[0];
    const endDateString = endDate.toISOString().split('T')[0];

    console.log(`カレンダーデータ取得: ${year}年${month}月`);
    console.log(`期間: ${startDateString} - ${endDateString}`);
    console.log(`ユーザーID: ${user.id}`);

    // 対象期間の投稿データを取得
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("id, created_at, labeled_emotions")
      .eq("user_id", user.id)
      .gte("created_at", startDateString + "T00:00:00.000Z")
      .lte("created_at", endDateString + "T23:59:59.999Z")
      .order("created_at", { ascending: true });

    console.log(`取得された投稿数: ${posts?.length || 0}`);

    if (postsError) {
      console.error("投稿データの取得に失敗しました:", postsError);
      return NextResponse.json(
        { error: "投稿データの取得に失敗しました" },
        { status: 500 }
      );
    }

    // 日別データを集計
    const dailyData: Record<string, {
      postCount: number;
      emotions: string[];
    }> = {};

    let totalPosts = 0;
    const activeDays = new Set<string>();
    const emotionCount: Record<string, number> = {};

    posts?.forEach((post) => {
      // 日本時間での日付を取得
      const postDate = new Date(post.created_at).toLocaleDateString('ja-JP', {
        timeZone: 'Asia/Tokyo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '-');
      
      if (!dailyData[postDate]) {
        dailyData[postDate] = {
          postCount: 0,
          emotions: []
        };
      }

      dailyData[postDate].postCount += 1;
      totalPosts += 1;
      activeDays.add(postDate);

      // 感情データの集計
      if (post.labeled_emotions && Array.isArray(post.labeled_emotions)) {
        post.labeled_emotions.forEach((emotion: string) => {
          dailyData[postDate].emotions.push(emotion);
          emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
        });
      }
    });

    // 最も多い感情トップ3を取得
    const topEmotions = Object.entries(emotionCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([emotion, count]) => ({ emotion, count }));

    // 月間統計データ
    const monthStats = {
      totalPosts,
      activeDays: activeDays.size,
      topEmotions
    };

    // 成功レスポンスを返す
    return NextResponse.json({
      success: true,
      dailyData,
      monthStats,
      year,
      month
    });

  } catch (error) {
    console.error("カレンダーデータ取得エラー:", error);

    // エラーメッセージを取得
    let errorMessage = "APIエラーが発生しました";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}