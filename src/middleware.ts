// 認証機能は一時的に無効化しています
// 実際のSupabase連携が完了したら、この実装を本来の実装に置き換えてください

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 空のミドルウェア関数をエクスポート（無効化した状態）
export function middleware(request: NextRequest) {
  // 認証チェックは行わず、すべてのリクエストを通過させる
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};
