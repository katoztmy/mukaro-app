import { supabase } from "./supabase";
import { createClient } from "@supabase/supabase-js";

// サーバーサイドでRLSをバイパスするための管理者クライアント
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * ユーザーのAPI使用回数を取得する
 */
export const getUserApiUsage = async (
  userId: string
): Promise<{
  usageCount: number;
  maxDailyLimit: number;
  remainingCalls: number;
  isLimitReached: boolean;
}> => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD形式

    // 今日のレコードを取得
    const { data, error } = await supabaseAdmin
      .from("api_usage_limits")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116はレコードが見つからないエラー
      console.error("API使用回数の取得に失敗しました:", error);
      throw error;
    }

    // レコードが存在しない場合は新規作成
    if (!data) {
      const { data: newData, error: insertError } = await supabaseAdmin
        .from("api_usage_limits")
        .insert([
          {
            user_id: userId,
            date: today,
            usage_count: 0,
            max_daily_limit: 5, // デフォルト値
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("API使用制限の作成に失敗しました:", insertError);
        throw insertError;
      }

      return {
        usageCount: 0,
        maxDailyLimit: 5,
        remainingCalls: 5,
        isLimitReached: false,
      };
    }

    // 既存のレコードから情報を返す
    const usageCount = data.usage_count || 0;
    const maxDailyLimit = data.max_daily_limit || 5;
    const remainingCalls = Math.max(0, maxDailyLimit - usageCount);

    return {
      usageCount,
      maxDailyLimit,
      remainingCalls,
      isLimitReached: usageCount >= maxDailyLimit,
    };
  } catch (error) {
    console.error("API使用制限の確認中にエラーが発生しました:", error);
    // エラーが発生した場合は安全策としてリミット到達と見なす
    return {
      usageCount: 0,
      maxDailyLimit: 5,
      remainingCalls: 0,
      isLimitReached: true,
    };
  }
};

/**
 * ユーザーのAPI使用回数をインクリメントする
 */
export const incrementApiUsage = async (userId: string): Promise<boolean> => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD形式

    // まず現在のレコードを取得
    const { data, error } = await supabaseAdmin
      .from("api_usage_limits")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("API使用回数の取得に失敗しました:", error);
      return false;
    }

    if (!data) {
      // レコードが存在しない場合は新規作成して1回使用済みとする
      const { error: insertError } = await supabaseAdmin
        .from("api_usage_limits")
        .insert([
          {
            user_id: userId,
            date: today,
            usage_count: 1,
            max_daily_limit: 5,
          },
        ]);

      if (insertError) {
        console.error("API使用制限の作成に失敗しました:", insertError);
        return false;
      }
    } else {
      // 既存のレコードの使用回数をインクリメント
      const { error: updateError } = await supabaseAdmin
        .from("api_usage_limits")
        .update({
          usage_count: data.usage_count + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id);

      if (updateError) {
        console.error("API使用回数の更新に失敗しました:", updateError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("API使用回数の更新中にエラーが発生しました:", error);
    return false;
  }
};
