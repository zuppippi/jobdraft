import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { position, employmentType, requiredSkills, appealPoints } = req.body;

  const prompt = `
以下の情報をもとに、求人票の文章をビジネス調で作成してください。

職種: ${position}
雇用形態: ${employmentType}
必須スキル: ${requiredSkills}
魅力ポイント: ${appealPoints}

500文字程度でお願いします。
`;

  const completion = await openai.createChatCompletion({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
  });

  const result = completion.data.choices[0].message?.content;
  res.status(200).json({ result });
}
