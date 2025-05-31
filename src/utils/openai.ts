import OpenAI from "openai";

// OpenAIクライアントのインスタンスを作成
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// テキストを大喜利スタイルに変換する関数
export async function convertToOgiri(text: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "あなたは皮肉で笑えるコメントを生成する専門家です。ユーザーのムカつく出来事に対して、皮肉を込めた大喜利のような面白いコメントを一言で返してください。長すぎず、短すぎず、最適な長さで返してください。",
        },
        {
          role: "user",
          content: `以下のムカつく出来事に対して、皮肉を込めた大喜利風の面白いコメントを一言で返してください：\n${text}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 100,
    });

    return response.choices[0].message.content?.trim() || "変換に失敗しました";
  } catch (error) {
    console.error("OpenAI API エラー:", error);
    throw new Error("変換処理中にエラーが発生しました");
  }
}

// テキストを川柳スタイルに変換する関数
export async function convertToSenryu(text: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "あなたは川柳の専門家です。ユーザーのムカつく出来事に対して、5・7・5のリズムで皮肉を込めた川柳を作成してください。必ず5・7・5の形式を守り、改行を入れてください。",
        },
        {
          role: "user",
          content: `以下のムカつく出来事に対して、5・7・5の川柳を作成してください。必ず改行を入れてください：\n${text}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 100,
    });

    return response.choices[0].message.content?.trim() || "変換に失敗しました";
  } catch (error) {
    console.error("OpenAI API エラー:", error);
    throw new Error("変換処理中にエラーが発生しました");
  }
}
