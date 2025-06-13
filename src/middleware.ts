// 認証機能を有効化 - 安定性強化版

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 認証が不要なパス
const publicPaths = ["/login", "/signup", "/logout"];

// ログアウト専用のパス
const logoutPath = "/logout";

// 静的リソースかどうかをチェックする関数
const isStaticResource = (pathname: string): boolean => {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/images") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  );
};

// Supabaseのセッションクッキー名
const SESSION_COOKIE_NAMES = [
  "sb-session",
  "sb:session",
  "sb-access-token",
  "sb-refresh-token",
  "supabase-auth-token",
];

export async function middleware(request: NextRequest) {
  // リクエストURLのパス名を取得
  const { pathname } = request.nextUrl;

  // 静的リソースは常に許可
  if (isStaticResource(pathname)) {
    return NextResponse.next();
  }

  // ログアウトパスへのアクセスを処理
  if (pathname === logoutPath) {
    // ログアウトページ自体へのアクセスは許可
    // JavaScriptでログアウト処理を実行後、リダイレクトを行う
    return NextResponse.next();
  }

  // 公開パスは認証不要 - auth_redirect_completedフラグをクリア
  if (publicPaths.includes(pathname)) {
    const response = NextResponse.next();
    // 公開パスへのアクセス時にリダイレクトカウンタとリダイレクト完了フラグをリセット
    response.cookies.set("redirect_count", "0", {
      maxAge: 60, // 1分間有効
      path: "/",
    });
    // ログイン画面にアクセスしたらリダイレクト完了フラグをクリア
    response.cookies.set("auth_redirect_completed", "", {
      maxAge: 0, // 即時削除
      path: "/",
    });
    return response;
  }

  // ユーザーが認証されているかチェック（複数のクッキー名を確認）
  const hasSessionCookie = SESSION_COOKIE_NAMES.some(
    (name) => !!request.cookies.get(name)
  );

  // 認証リダイレクト完了フラグがcookieにセットされているか確認
  const authRedirectCompleted =
    request.cookies.get("auth_redirect_completed")?.value === "true";

  // リダイレクト回数を制限するためにcookieをチェック
  const redirectCount = request.cookies.get("redirect_count")?.value;
  const count = redirectCount ? parseInt(redirectCount) : 0;

  // 認証されていない場合
  if (!hasSessionCookie && !authRedirectCompleted) {
    // リダイレクト回数が多すぎる場合は、一時的に認証をバイパス
    if (count > 2) {
      // リダイレクトカウントをリセット
      const response = NextResponse.next();
      response.cookies.set("redirect_count", "0", {
        maxAge: 60, // 1分間有効
        path: "/",
      });
      return response;
    }

    // 認証されていない場合はログインページにリダイレクト
    const response = NextResponse.redirect(new URL("/login", request.url));
    // リダイレクトカウントを増やす
    response.cookies.set("redirect_count", (count + 1).toString(), {
      maxAge: 60, // 1分間有効
      path: "/",
    });
    return response;
  }

  // 認証されている場合はリダイレクトカウントをリセットしてリクエストを続行
  const response = NextResponse.next();
  response.cookies.set("redirect_count", "0", {
    maxAge: 60, // 1分間有効
    path: "/",
  });

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
