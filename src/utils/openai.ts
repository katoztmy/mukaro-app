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

// 季節限定スタイル変換関数
export async function convertToSeasonalStyle(text: string, season: 'spring' | 'summer' | 'autumn' | 'winter'): Promise<string> {
  const seasonPrompts = {
    spring: {
      system: "あなたは春の季節感を表現する専門家です。ユーザーのムカつく出来事を、桜、新緑、新生活、花見、暖かな風といった春らしい要素を使って、詩的で美しい表現に変換してください。",
      example: "例：「桜舞う中、君の心も軽やかに」「新緑のように、新たな気持ちで」"
    },
    summer: {
      system: "あなたは夏の季節感を表現する専門家です。ユーザーのムカつく出来事を、夏祭り、花火、海、蝉の声、青空といった夏らしい要素を使って、爽やかで力強い表現に変換してください。",
      example: "例：「夏祭りの太鼓のように、心も躍動せよ」「花火のように一瞬で散らせ」"
    },
    autumn: {
      system: "あなたは秋の季節感を表現する専門家です。ユーザーのムカつく出来事を、紅葉、読書、食欲の秋、月見、涼しい風といった秋らしい要素を使って、落ち着いた知的な表現に変換してください。",
      example: "例：「紅葉のように美しく散りゆけ」「読書の秋、心も静かに」"
    },
    winter: {
      system: "あなたは冬の季節感を表現する専門家です。ユーザーのムカつく出来事を、雪、お正月、こたつ、温もり、静寂といった冬らしい要素を使って、温かく包容力のある表現に変換してください。",
      example: "例：「雪のように純白な心で」「こたつのような温もりで包もう」"
    }
  };

  try {
    const prompt = seasonPrompts[season];
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: prompt.system + " " + prompt.example,
        },
        {
          role: "user",
          content: `以下のムカつく出来事を${season === 'spring' ? '春' : season === 'summer' ? '夏' : season === 'autumn' ? '秋' : '冬'}らしく美しい表現に変換してください：\n${text}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 150,
    });

    return response.choices[0].message.content?.trim() || "変換に失敗しました";
  } catch (error) {
    console.error("OpenAI API エラー:", error);
    throw new Error("変換処理中にエラーが発生しました");
  }
}
