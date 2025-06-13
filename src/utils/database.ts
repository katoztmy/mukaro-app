import { supabase } from "./supabase";

// 型定義
export type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type Post = {
  id: string;
  user_id: string;
  content: string;
  result: string;
  style: "ogiri" | "senryu";
  category_id: string | null;
  labeled_emotions?: string[] | null;
  reframing_answer?: string | null;
  created_at: string;
};

export type Reaction = {
  id: string;
  post_id: string;
  user_id: string;
  type: "like" | "dislike";
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  color: string;
  created_at: string;
};

// プロフィール関連の関数
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("プロフィール取得エラー:", error);
    return null;
  }

  return data;
}

export async function updateProfile(
  profile: Partial<Profile> & { id: string }
): Promise<boolean> {
  const { error } = await supabase
    .from("profiles")
    .update({
      username: profile.username,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
    })
    .eq("id", profile.id);

  if (error) {
    console.error("プロフィール更新エラー:", error);
    return false;
  }

  return true;
}

// 投稿関連の関数
export async function createPost(
  post: Omit<Post, "id" | "created_at">
): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .insert([post])
    .select()
    .single();

  if (error) {
    console.error("投稿作成エラー:", error);
    return null;
  }

  return data;
}

export async function getPosts(userId: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("投稿一覧取得エラー:", error);
    return [];
  }

  return data || [];
}

export async function getPostById(postId: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (error) {
    console.error("投稿取得エラー:", error);
    return null;
  }

  return data;
}

// リアクション関連の関数
export async function createReaction(
  reaction: Omit<Reaction, "id" | "created_at">
): Promise<Reaction | null> {
  // 既存のリアクションがあれば削除（UPSERTのような動作）
  await supabase
    .from("reactions")
    .delete()
    .match({ post_id: reaction.post_id, user_id: reaction.user_id });

  // 新しいリアクションを作成
  const { data, error } = await supabase
    .from("reactions")
    .insert([reaction])
    .select()
    .single();

  if (error) {
    console.error("リアクション作成エラー:", error);
    return null;
  }

  return data;
}

export async function getReaction(
  postId: string,
  userId: string
): Promise<Reaction | null> {
  const { data, error } = await supabase
    .from("reactions")
    .select("*")
    .match({ post_id: postId, user_id: userId })
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      // PGRST116は「結果が見つからない」エラー
      console.error("リアクション取得エラー:", error);
    }
    return null;
  }

  return data;
}

// カテゴリ関連の関数
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("カテゴリ一覧取得エラー:", error);
    return [];
  }

  return data || [];
}

// 統計情報取得
export async function getUserStats(
  userId: string
): Promise<{ total: number; liked: number }> {
  // 総投稿数を取得
  const { count: total, error: totalError } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (totalError) {
    console.error("投稿数取得エラー:", totalError);
    return { total: 0, liked: 0 };
  }

  // スッキリしたリアクション数を取得
  const { data: likedPosts, error: likedError } = await supabase
    .from("reactions")
    .select("post_id")
    .eq("user_id", userId)
    .eq("type", "like");

  if (likedError) {
    console.error("リアクション数取得エラー:", likedError);
    return { total: total || 0, liked: 0 };
  }

  return {
    total: total || 0,
    liked: likedPosts?.length || 0,
  };
}
