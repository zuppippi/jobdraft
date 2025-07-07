import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ result: 'Method Not Allowed' });
  }

  try {
    const { position, employmentType, requiredSkills, appealPoints } = req.body;

    if (!position || !employmentType || !requiredSkills || !appealPoints) {
      return res.status(400).json({ result: 'すべての項目を入力してください。' });
    }

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

    const result = completion.choices?.[0]?.message?.content;
    if (!result) {
      return res.status(500).json({ result: '生成に失敗しました（空の応答）' });
    }

    res.status(200).json({ result });
  } catch (error: any) {
    console.error('❌ OpenAI API Error:', error);

    const message =
      error?.response?.data?.error?.message ||
      error?.message ||
      'Unknown server error';

    res.status(500).json({
      result: `サーバーエラー：${message}`,
    });
  }
}
