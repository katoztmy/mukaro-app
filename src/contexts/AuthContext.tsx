"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

// 認証コンテキストの型定義
type AuthContextType = {
  user: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

// 認証コンテキストの作成
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signOut: async () => {},
});

// コンテキストを使用するためのカスタムフック
export const useAuth = () => useContext(AuthContext);

// 認証プロバイダーコンポーネント
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>({
    id: "mock-user-id",
    email: "user@example.com",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // モック用のサインアウト処理
  const signOut = async () => {
    try {
      // 実際のSupabase連携時にはここを修正
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
