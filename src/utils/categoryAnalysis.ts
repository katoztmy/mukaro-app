import OpenAI from "openai";

// OpenAIクライアントのインスタンスを作成
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// カテゴリ分析の結果型
export type CategoryAnalysisResult = {
  categoryId: string;
  categoryName: string;
  confidence: number;
};

// 既存のカテゴリ定義（DBと同期）
const CATEGORY_DEFINITIONS = {
  "ad659df1-b73c-459f-bf35-ea39a8d69527": {
    name: "交通・通勤",
    keywords: ["電車", "バス", "渋滞", "遅延", "満員", "運転", "駅", "交通", "通勤", "帰宅", "ラッシュ", "車", "自転車", "タクシー", "道路"]
  },
  "23eb22ad-ce06-4b0b-a42b-99f604490eb4": {
    name: "人間関係・職場", 
    keywords: ["上司", "同僚", "部下", "会社", "職場", "友達", "恋人", "家族", "態度", "無視", "マナー", "人", "会議", "残業", "仕事"]
  },
  "c74f03b6-c6bb-41a6-84df-1d896665d555": {
    name: "買い物・消費",
    keywords: ["店員", "レジ", "商品", "値段", "サービス", "店", "購入", "支払い", "ポイント", "割引", "返品", "配送", "注文", "品切れ"]
  },
  "31bfe358-ffc6-4418-94df-5a14a14fa187": {
    name: "生活・日常",
    keywords: ["家", "近所", "騒音", "天気", "料理", "掃除", "洗濯", "睡眠", "健康", "体調", "病院", "ペット", "子供", "家事"]
  },
  "f4b550d0-6bb1-4c67-b02f-35efb687553d": {
    name: "その他",
    keywords: []
  }
};

// ムカつき内容をカテゴリ分析する関数
export async function analyzeCategory(content: string): Promise<CategoryAnalysisResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // より高精度なモデルを使用
      messages: [
        {
          role: "system",
          content: `あなたは日本人のムカつき・イライラ体験を正確に分類する専門家です。

以下の5つのカテゴリのうち、最も適切なものを1つ選択してください：

1. **交通・通勤** (ID: ad659df1-b73c-459f-bf35-ea39a8d69527)
   - 電車・バス・車の遅延、満員電車、運転マナー、駅での出来事、通勤・帰宅の問題
   - 必須キーワード：電車、バス、遅延、満員、運転、駅、渋滞、通勤、帰宅、ラッシュ、車、自転車、交通、道路、運転手、乗客、切符、改札
   - 例：「電車が遅延して会議に遅刻した」→交通・通勤（0.95）

2. **人間関係・職場** (ID: 23eb22ad-ce06-4b0b-a42b-99f604490eb4)
   - 上司・同僚・部下との関係、会社での人間関係、友人・恋人・家族との問題
   - 必須キーワード：上司、同僚、部下、会社、職場、友達、恋人、家族、態度、マナー、会議、仕事、先生、学校、クラス
   - 例：「上司が理不尽に怒ってきた」→人間関係・職場（0.95）

3. **買い物・消費** (ID: c74f03b6-c6bb-41a6-84df-1d896665d555)
   - 店員の対応、商品・サービスの問題、レジでの出来事、配送・注文関連
   - 必須キーワード：店員、レジ、商品、サービス、店、購入、支払い、ポイント、配送、注文、返品、品切れ、レストラン、カフェ
   - 例：「店員の態度が悪くて腹が立った」→買い物・消費（0.95）

4. **生活・日常** (ID: 31bfe358-ffc6-4418-94df-5a14a14fa187)
   - 家庭内の問題、近所トラブル、天気・気候、健康・体調、家事関連
   - 必須キーワード：家、近所、騒音、天気、雨、暑い、寒い、料理、掃除、洗濯、健康、体調、病院、ペット、子供、家事
   - 例：「隣の家がうるさくて眠れない」→生活・日常（0.95）

5. **その他** (ID: f4b550d0-6bb1-4c67-b02f-35efb687553d)
   - 上記4つに明確に当てはまらない場合のみ使用
   - インターネット、ゲーム、政治、芸能、スポーツなど

**分類手順：**
1. まず、テキスト内に上記1-4のキーワードが含まれているか確認
2. キーワードが見つかった場合、そのカテゴリに分類（信頼度0.8以上）
3. キーワードがない場合も、文脈を読んで1-4のどれかに分類を試みる
4. どうしても分類できない場合のみ「その他」を使用

**信頼度設定：**
- 0.9-1.0: 明確なキーワードがあり確実
- 0.8-0.9: キーワードまたは文脈から明確
- 0.6-0.7: 文脈から推測可能
- 0.4-0.5: 推測だが合理的
- 0.3以下: 「その他」のみ使用

必ずJSON形式で回答してください：
{
  "categoryId": "選択したカテゴリのID",
  "categoryName": "選択したカテゴリ名",
  "confidence": 0.85
}`
        },
        {
          role: "user",
          content: `次のムカつき体験を分析して、最適なカテゴリに分類してください：

「${content}」

この内容に最も適したカテゴリをJSON形式で回答してください。`
        }
      ],
      temperature: 0.1, // より一貫性を重視
      max_tokens: 200,
    });

    const responseText = response.choices[0].message.content?.trim();
    if (!responseText) {
      throw new Error("AIからの応答が空です");
    }

    try {
      const result = JSON.parse(responseText);
      
      // バリデーション
      if (!result.categoryId || !result.categoryName || typeof result.confidence !== 'number') {
        throw new Error("不正なレスポンス形式");
      }

      // カテゴリIDの存在確認
      if (!CATEGORY_DEFINITIONS[result.categoryId as keyof typeof CATEGORY_DEFINITIONS]) {
        throw new Error("存在しないカテゴリID");
      }

      return {
        categoryId: result.categoryId,
        categoryName: result.categoryName,
        confidence: Math.max(0, Math.min(1, result.confidence)) // 0-1の範囲に制限
      };

    } catch (parseError) {
      console.error("JSON解析エラー:", parseError, "応答:", responseText);
      // フォールバック: その他カテゴリ
      return {
        categoryId: "f4b550d0-6bb1-4c67-b02f-35efb687553d",
        categoryName: "その他",
        confidence: 0.5
      };
    }

  } catch (error) {
    console.error("カテゴリ分析エラー:", error);
    // エラー時はその他カテゴリを返す
    return {
      categoryId: "f4b550d0-6bb1-4c67-b02f-35efb687553d", 
      categoryName: "その他",
      confidence: 0.3
    };
  }
}