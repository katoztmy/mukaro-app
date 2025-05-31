"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";

// 認証コンテキストの型定義
type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string
  ) => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  refreshSession: () => Promise<void>;
};

// デフォルト値を持つ認証コンテキストの作成
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signUp: async () => ({ error: null, success: false }),
  signIn: async () => ({ error: null, success: false }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null, success: false }),
  refreshSession: async () => {},
});

// 認証プロバイダーの型定義
type AuthProviderProps = {
  children: ReactNode;
};

// 認証プロバイダーコンポーネント
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // セッション更新関数
  const refreshSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      if (session) {
        setSession(session);
        setUser(session.user);
      }
    } catch (error) {
      console.error("セッション更新エラー:", error);
    }
  };

  useEffect(() => {
    // 現在のセッションを取得
    const setData = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("セッション取得エラー:", error.message);
        }

        if (session) {
          // セッションがある場合のみセット
          setSession(session);
          setUser(session.user);
        } else {
          // セッションがない場合は明示的にnullをセット
          setSession(null);
          setUser(null);
        }
      } finally {
        // 処理完了後、ローディング状態を終了
        setLoading(false);
      }
    };

    // 初期セッション取得を実行
    setData();

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        setUser(session.user);
      } else {
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    });

    // クリーンアップ関数
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // サインアップ機能
  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { error, success: false };
      }

      // サインアップ成功後にセッションを更新
      await refreshSession();

      return { error: null, success: true };
    } catch (error) {
      return { error: error as Error, success: false };
    }
  };

  // サインイン機能
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error, success: false };
      }

      // 認証成功時はセッションとユーザー情報を更新
      if (data.session) {
        setSession(data.session);
        setUser(data.user);

        // セッションがちゃんと設定されたことを確認するための遅延処理
        setTimeout(async () => {
          await refreshSession();
        }, 500);
      }

      return { error: null, success: true };
    } catch (error) {
      console.error("ログインエラー:", error);
      return { error: error as Error, success: false };
    }
  };

  // サインアウト機能
  const signOut = async () => {
    await supabase.auth.signOut();
    // サインアウト後は明示的にnullをセット
    setSession(null);
    setUser(null);
  };

  // パスワードリセット機能
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { error, success: false };
      }

      return { error: null, success: true };
    } catch (error) {
      return { error: error as Error, success: false };
    }
  };

  // コンテキスト値の定義
  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 認証コンテキストを使用するためのカスタムフック
export const useAuth = () => useContext(AuthContext);
