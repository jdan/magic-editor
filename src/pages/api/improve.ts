// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import dedent from "dedent";
import { Diff, diff_match_patch as DiffMatchPatch } from "diff-match-patch";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

interface Request extends NextApiRequest {
  body: {
    text: string;
  };
}

export type ImproveResponse = {
  improvement: string;
  diff: Diff[];
};

export default async function handler(
  req: Request,
  res: NextApiResponse<ImproveResponse>
) {
  const { text } = req.body;

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: dedent`
          You are an assistant helping to improve my writing.
          Output the user's text with:
          - Improved spelling and grammar
          - Correct punctuation

          Text: ${text}
        `,
      },
    ],
  });

  const improvement =
    completion.data.choices[0].message?.content ?? "[empty response]";

  const dmp = new DiffMatchPatch();
  const diff = dmp.diff_main(text, improvement);

  res.status(200).json({
    improvement,
    diff,
  });
}
