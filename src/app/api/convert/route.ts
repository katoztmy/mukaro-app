import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getUserApiUsage, incrementApiUsage } from "@/utils/apiLimits";
import { createClient } from "@supabase/supabase-js";

// OpenAI APIクライアントの初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Supabaseクライアント初期化（サーバーサイドで使用するため）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// テキストとスタイルを受け取り、変換結果を返すAPIエンドポイント
export async function POST(request: Request) {
  try {
    // 認証チェック
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "認証に失敗しました" },
        { status: 401 }
      );
    }

    // ユーザーのAPI使用回数をチェック
    const { isLimitReached, remainingCalls, maxDailyLimit } =
      await getUserApiUsage(user.id);

    if (isLimitReached) {
      return NextResponse.json(
        {
          error: "API使用回数の上限に達しました",
          limit: {
            maxDailyLimit,
            remainingCalls: 0,
            resetTime: "翌日0時",
          },
        },
        { status: 429 }
      );
    }

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

    // スタイル定義の拡張
    const validStyles = [
      "ogiri",
      "senryu",
      "manabi",
      "total_affirmation",
      "hissatsu_waza",
      "news_bulletin",
      "ijin",
      "chuunibyou",
      "high_consciousness",
      "epic_tale",
    ];

    if (!style || !validStyles.includes(style)) {
      return NextResponse.json(
        { error: "有効なスタイルを指定してください" },
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
    } else if (style === "senryu") {
      prompt = `
        次のムカついた内容を、5-7-5の川柳に変換してください。
        - 日本語の川柳形式（5音-7音-5音の合計17音）を守ってください
        - 皮肉やユーモアを含めてください
        - 絵文字は使わないでください

        ムカついた内容: ${text}
      `;
    } else if (style === "manabi") {
      prompt = `
        次のムカついた出来事を、ポジティブな「学び」や「成長の糧」に変換してください。
        - 経験から得られた教訓や、自己成長に繋がる視点を提示してください。
        - 相手を責めるのではなく、自分の捉え方を変えるような、前向きな言葉にしてください。
        - 回答は50文字以内で、優しい語り口にしてください。
        - 絵文字は使わないでください。

        ムカついた内容: ${text}
      `;
    } else if (style === "total_affirmation") {
      prompt = `
        次のムカついた内容に対して、ユーザーを全面的に肯定し、とにかく褒めて癒してください。
        - 「あなたは悪くない」「よく耐えたね」といった、ユーザーに寄り添う言葉を必ず含めてください。
        - 全力で甘やかすような、優しい口調でお願いします。
        - 回答は50文字以内でお願いします。
        - 絵文字は使わないでください。

        ムカついた内容: ${text}
      `;
    } else if (style === "hissatsu_waza") {
      prompt = `
        次のムカついた出来事に、RPGや漫画の「必殺技」や「スキル」のような名前を付けてください。
        - 出来事の特徴を捉えた、ユニークで面白い名前にしてください。
        - \`新技【〇〇】が炸裂！\` や \`【〇〇】の経験値を得た！\` のようなゲーム風のテキストにしてください。
        - 回答は50文字以内でお願いします。
        - 絵文字は使わないでください。

        ムカついた内容: ${text}
      `;
    } else if (style === "news_bulletin") {
      prompt = `
        次のムカついた出来事を、テレビのニュース速報のように大げさに伝えてください。
        - 必ず「【速報】」から始めてください。
        - まるで重大事件かのように、客観的かつ真面目なニュースキャスターの口調で描写してください。
        - 回答は50文字以内でお願いします。
        - 絵文字は使わないでください。

        ムカついた内容: ${text}
      `;
    } else if (style === "ijin") {
      prompt = `
        次のムカついた内容を、歴史上の偉人や哲学者が残した名言のように変換してください。
        - 普遍的な真理や教訓のような、深みのある言葉で表現してください。
        - 少し大げさで、荘厳な雰囲気を出してください。
        - 回答は50文字以内でお願いします。
        - 絵文字は使わないでください。

        ムカついた内容: ${text}
      `;
    } else if (style === "chuunibyou") {
      prompt = `
        次のムカついた出来事を、厨二病のキャラクターになりきって表現してください。
        - 「闇」「宿命」「世界の理（ことわり）」「禁断の力」といった単語を効果的に使用してください。
        - すべてを運命や見えざる敵のせいにするような、大げさで壮大なセリフにしてください。
        - 回答は50文字以内でお願いします。
        - 絵文字は使わないでください。

        ムカついた内容: ${text}
      `;
    } else if (style === "high_consciousness") {
      prompt = `
        次のムカついた出来事を、意識高い系ビジネスパーソンのように表現してください。
        - 「アサイン」「コミット」「PDCA」「マインドセット」等のカタカナビジネス用語を不必要に多用してください。
        - あらゆる問題を自己成長の機会（オポチュニティ）と捉える、ポジティブなスタンスでお願いします。
        - 回答は50文字以内でお願いします。
        - 絵文字は使わないでください。

        ムカついた内容: ${text}
      `;
    } else if (style === "epic_tale") {
      prompt = `
        次のムカついた出来事を、壮大な物語の始まり（プロローグ）のように表現してください。
        - 「それが全ての始まりだった」「まだ誰も知らなかった」のように、今後の展開を匂わせる一文にしてください。
        - 出来事のスケールを過剰に大きく、ドラマチックに描写してください。
        - 回答は50文字以内でお願いします。
        - 絵文字は使わないでください。

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

    // API使用回数をインクリメント
    await incrementApiUsage(user.id);

    // 残りの使用回数を取得（インクリメント後）
    const updatedUsage = await getUserApiUsage(user.id);

    // APIからの応答を整形
    const result =
      completion.choices[0].message.content?.trim() || "変換に失敗しました";

    // 結果をクライアントに返す
    return NextResponse.json({
      success: true,
      result,
      inputText: text,
      style,
      limit: {
        maxDailyLimit: updatedUsage.maxDailyLimit,
        remainingCalls: updatedUsage.remainingCalls,
        resetTime: "翌日0時",
      },
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
