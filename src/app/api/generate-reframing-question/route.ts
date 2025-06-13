import { NextResponse } from "next/server";
import OpenAI from "openai";

// OpenAIクライアントのインスタンスを作成
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // リクエストボディを解析
    const body = await request.json();
    const { mukaText } = body;

    // 必須フィールドの検証
    if (!mukaText) {
      return NextResponse.json(
        { error: "mukaTextが必要です" },
        { status: 400 }
      );
    }

    // OpenAI APIを呼び出してリフレーミング質問を生成
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "あなたは認知行動療法の専門家です。ユーザーの怒りや不満の記述を読み、認知のリフレーミングを促す、穏やかで肯定的な質問を一つだけ生成してください。質問は相手を責めたり批判したりせず、建設的な視点を促すものにしてください。150文字以内で答えてください。"
        },
        {
          role: "user",
          content: `以下の『怒り』の記述を読み、認知のリフレーミングを促す、穏やかで肯定的な質問を一つだけ生成してください。例：「この経験から学べることがあるとしたら何ですか？」。記述：${mukaText}`
        }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const question = response.choices[0].message.content?.trim();

    if (!question) {
      return NextResponse.json(
        { error: "質問の生成に失敗しました" },
        { status: 500 }
      );
    }

    // 成功レスポンス
    return NextResponse.json({
      question: question
    });

  } catch (error) {
    console.error("リフレーミング質問生成エラー:", error);
    
    // エラーメッセージを取得
    let errorMessage = "質問生成中にエラーが発生しました";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}