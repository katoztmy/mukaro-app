import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase";

// スタイルの型定義
export type ConvertStyle =
  | "ogiri"
  | "senryu"
  | "manabi"
  | "total_affirmation"
  | "hissatsu_waza"
  | "news_bulletin"
  | "ijin"
  | "chuunibyou"
  | "high_consciousness"
  | "epic_tale";

// カテゴリの型定義
export type Category = {
  id: string;
  name: string;
  color: string;
};

// 投稿データの型定義
export type Post = {
  id: string;
  content: string;
  result: string;
  style: ConvertStyle;
  category_id?: string;
  created_at: string;
  updated_at?: string;
  user_id?: string;
  categories?: Category; // カテゴリデータ（JOINで取得した場合）
};

// リアクションの型定義
export type Reaction = {
  id: string;
  post_id: string;
  user_id: string;
  type: "like" | "dislike";
  created_at: string;
};

// Supabaseの接続状態を確認する関数
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("count")
      .limit(1);
    if (error) {
      console.error("Supabase接続エラー:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Supabase接続確認中にエラーが発生しました:", error);
    return false;
  }
};

// カテゴリ一覧を取得する関数
export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from("categories").select("*");

  if (error) {
    console.error("カテゴリの取得に失敗しました:", error);
    return [];
  }

  return data || [];
};

// 投稿を保存する関数
export const savePost = async (post: {
  content: string;
  result: string;
  style: ConvertStyle;
  categoryId?: string;
}): Promise<Post> => {
  // 現在のユーザーIDを取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("ユーザーがログインしていません");
  }

  // スタイルをデバッグ出力
  console.log("保存前のスタイル値:", post.style);
  console.log("スタイル値の型:", typeof post.style);
  console.log(
    "スタイル値のプロトタイプ:",
    Object.prototype.toString.call(post.style)
  );

  // スタイルの有効性を確認
  const validStyles: ConvertStyle[] = [
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

  if (!validStyles.includes(post.style)) {
    console.warn(
      `無効なスタイル値: ${post.style}, デフォルトのogiriを使用します`
    );
    post.style = "ogiri";
  }

  // カテゴリIDのフィールド名をDBの形式に合わせる
  const postData = {
    content: post.content,
    result: post.result,
    style: String(post.style), // 明示的に文字列に変換
    category_id: post.categoryId,
    user_id: user.id,
  };

  // 保存直前のデータをログ出力
  console.log("Supabaseに保存するデータ:", postData);
  console.log("🔍 Supabase insert実行前のスタイル:", postData.style);
  console.log("🔍 Supabase insert実行前のスタイルの型:", typeof postData.style);

  // Supabaseに投稿を保存
  const { data, error } = await supabase
    .from("posts")
    .insert([postData])
    .select();

  console.log("🔍 Supabase insert実行後:", error ? "エラー発生" : "成功");

  if (error) {
    console.error("Supabaseへの保存エラー:", error);
    console.error("エラーの詳細:", JSON.stringify(error, null, 2));
    throw new Error(`投稿の保存に失敗しました: ${error.message}`);
  }

  console.log("保存後の戻り値:", data?.[0]);
  console.log("🔍 保存されたスタイル値:", data?.[0]?.style);
  console.log("🔍 保存されたスタイル値の型:", typeof data?.[0]?.style);

  return data?.[0] as Post;
};

// 投稿の取得
export const getPosts = async (): Promise<Post[]> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("認証されていません");
    }

    // ユーザーの投稿を全て取得
    const { data, error } = await supabase
      .from("posts")
      .select("*, categories(*)")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("投稿の取得に失敗しました:", error);
    throw error;
  }
};

// リアクションが「スッキリ（like）」の投稿数を取得する関数
export const getLikedPostsCount = async (): Promise<number> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return 0;
  }

  // スッキリ（like）のリアクションを持つ投稿IDを取得
  const { data, error } = await supabase
    .from("reactions")
    .select("post_id")
    .eq("user_id", user.id)
    .eq("type", "like");

  if (error) {
    console.error("リアクションの取得に失敗しました:", error);
    return 0;
  }

  return data?.length || 0;
};

// 投稿のリアクションを更新または作成する関数
export const updatePostReaction = async (
  post_id: string,
  type: "like" | "dislike"
): Promise<void> => {
  // 現在のユーザーIDを取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("ユーザーがログインしていません");
  }

  // 既存のリアクションを確認
  const { data: existingReaction } = await supabase
    .from("reactions")
    .select("*")
    .eq("post_id", post_id)
    .eq("user_id", user.id)
    .single();

  if (existingReaction) {
    // 既存のリアクションを更新
    const { error } = await supabase
      .from("reactions")
      .update({ type })
      .eq("id", existingReaction.id);

    if (error) {
      console.error("リアクションの更新に失敗しました:", error);
      throw new Error(`リアクションの更新に失敗しました: ${error.message}`);
    }
  } else {
    // 新しいリアクションを作成
    const { error } = await supabase.from("reactions").insert([
      {
        post_id,
        user_id: user.id,
        type,
      },
    ]);

    if (error) {
      console.error("リアクションの作成に失敗しました:", error);
      throw new Error(`リアクションの作成に失敗しました: ${error.message}`);
    }
  }
};

// IDで投稿を取得
export const getPostById = async (
  id: string
): Promise<{ post: Post | null; reaction: Reaction | null }> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("認証されていません");
    }

    // 投稿を取得
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("*, categories(*)")
      .eq("id", id)
      .eq("user_id", session.user.id)
      .single();

    if (postError) {
      if (postError.code === "PGRST116") {
        return { post: null, reaction: null };
      }
      throw postError;
    }

    // リアクションを取得
    const { data: reaction, error: reactionError } = await supabase
      .from("reactions")
      .select("*")
      .eq("post_id", id)
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (reactionError) {
      throw reactionError;
    }

    return { post, reaction };
  } catch (error) {
    console.error("投稿の取得に失敗しました:", error);
    throw error;
  }
};
