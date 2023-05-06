// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import dedent from "dedent";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

interface Request extends NextApiRequest {
  body: {
    text: string;
    instructions: string;
  };
}

export type DetectionResponse = {
  detection: string;
};

export default async function handler(
  req: Request,
  res: NextApiResponse<DetectionResponse>
) {
  const { text } = req.body;

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: dedent`
          Tell me a joke.
        `,
      },
    ],
  });

  const detection =
    completion.data.choices[0].message?.content ?? "[empty response]";

  res.status(200).json({
    detection,
  });
}
