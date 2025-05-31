import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase";

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
  style: "ogiri" | "senryu";
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
  style: "ogiri" | "senryu";
  category_id?: string;
}): Promise<Post> => {
  // 現在のユーザーIDを取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("ユーザーがログインしていません");
  }

  // 新しい投稿を作成
  const newPost = {
    ...post,
    user_id: user.id,
  };

  // Supabaseに投稿を保存
  const { data, error } = await supabase
    .from("posts")
    .insert([newPost])
    .select();

  if (error) {
    console.error("Supabaseへの保存エラー:", error);
    throw new Error(`投稿の保存に失敗しました: ${error.message}`);
  }

  return data?.[0] as Post;
};

// 全ての投稿を取得する関数
export const getPosts = async (): Promise<Post[]> => {
  // 現在のユーザーIDを取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("ユーザーがログインしていません");
  }

  // Supabaseから投稿を取得
  const { data, error } = await supabase
    .from("posts")
    .select("*, categories(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabaseからの取得エラー:", error);
    throw new Error(`投稿の取得に失敗しました: ${error.message}`);
  }

  return data || [];
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

// 単一の投稿とそのリアクションを取得する関数
export const getPostById = async (
  id: string
): Promise<{ post: Post; reaction?: Reaction }> => {
  // 現在のユーザーIDを取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Supabaseから特定のIDの投稿を取得
  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("*, categories(*)")
    .eq("id", id)
    .single();

  if (postError) {
    console.error("投稿の取得に失敗しました:", postError);
    throw new Error(`投稿の取得に失敗しました: ${postError.message}`);
  }

  // リアクションも取得（ログインしている場合のみ）
  if (user) {
    const { data: reaction, error: reactionError } = await supabase
      .from("reactions")
      .select("*")
      .eq("post_id", id)
      .eq("user_id", user.id)
      .single();

    if (reactionError && reactionError.code !== "PGRST116") {
      // PGRST116 = レコードなし
      console.error("リアクションの取得に失敗しました:", reactionError);
    }

    return {
      post: post as Post,
      reaction: reaction as Reaction,
    };
  }

  return { post: post as Post };
};
