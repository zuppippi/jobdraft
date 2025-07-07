import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { position, employmentType, requiredSkills, appealPoints } = req.body;

    const prompt = `
以下の情報をもとに、求人票の文章をビジネス調で作成してください。

職種: ${position}
雇用形態: ${employmentType}
必須スキル: ${requiredSkills}
魅力ポイント: ${appealPoints}

500文字程度でお願いします。
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    });

    const result = completion.choices[0].message.content;
    res.status(200).json({ result });
  } catch (error: any) {
    console.error('❌ OpenAI API Error:', error);

    // エラー詳細も返すようにする
    const message =
      error?.response?.data?.error?.message || error?.message || 'Unknown error';

    res.status(500).json({
      result: `サーバーエラー：${message}`,
    });
  }
}
