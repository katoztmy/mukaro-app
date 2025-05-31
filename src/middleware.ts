// 認証機能は一時的に無効化しています - デバッグ用の単純バージョン

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 認証が不要なパス
const publicPaths = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  // リクエストURLのパス名を取得
  const { pathname } = request.nextUrl;

  console.log("ミドルウェア実行:", pathname); // デバッグログ

  // 一時的に認証をバイパス - すべてのリクエストを許可
  return NextResponse.next();

  // 本来の認証コードはコメントアウト
  /*
  // パブリックパスの場合は認証チェックをスキップ
  if (publicPaths.includes(pathname)) {
    console.log("パブリックパス - 認証スキップ:", pathname);
    return NextResponse.next();
  }

  // ここに認証コードが入ります
  */
}

export const config = {
  matcher: [
    /*
     * 以下のパスを除外:
     * - _next/static（静的ファイル）
     * - _next/image（Next.js Image Optimization API）
     * - favicon.ico（ブラウザが自動的にリクエストするファビコン）
     * - public（公開ディレクトリ内のファイル）
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
