import { NextResponse } from "next/server";
import OpenAI from "openai";

// OpenAI APIクライアントの初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// テキストとスタイルを受け取り、変換結果を返すAPIエンドポイント
export async function POST(request: Request) {
  try {
    // リクエストのボディを解析
    const body = await request.json();
    const { text, style } = body;

    // 入力チェック
    if (!text) {
      return NextResponse.json(
        { error: "テキストが指定されていません" },
        { status: 400 }
      );
    }

    if (!style || (style !== "ogiri" && style !== "senryu")) {
      return NextResponse.json(
        { error: "有効なスタイルを指定してください (ogiri または senryu)" },
        { status: 400 }
      );
    }

    // 文字数制限チェック
    if (text.length < 10 || text.length > 200) {
      return NextResponse.json(
        { error: "テキストは10文字以上200文字以下である必要があります" },
        { status: 400 }
      );
    }

    // プロンプトの作成
    let prompt = "";
    if (style === "ogiri") {
      prompt = `
        次のムカついた内容を、皮肉たっぷりの面白いコメントに変換してください。
        - 大喜利のお題に対する回答のように、シニカルで皮肉なユーモアを含めてください
        - 回答は50文字以内で
        - 句読点は必要に応じて使用してください
        - 絵文字は使わないでください

        ムカついた内容: ${text}
      `;
    } else {
      prompt = `
        次のムカついた内容を、5-7-5の川柳に変換してください。
        - 日本語の川柳形式（5音-7音-5音の合計17音）を守ってください
        - 皮肉やユーモアを含めてください
        - 絵文字は使わないでください

        ムカついた内容: ${text}
      `;
    }

    // OpenAI APIにリクエスト
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "あなたは皮肉とユーモアのセンスがある文章変換のエキスパートです。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0.3,
      presence_penalty: 0.3,
    });

    // APIからの応答を整形
    const result =
      completion.choices[0].message.content?.trim() || "変換に失敗しました";

    // 結果をクライアントに返す
    return NextResponse.json({
      success: true,
      result,
      inputText: text,
      style,
    });
  } catch (error) {
    console.error("変換処理中にエラーが発生しました:", error);

    // エラーメッセージを取得
    let errorMessage = "APIエラーが発生しました";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    // クライアントにエラーレスポンスを返す
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
