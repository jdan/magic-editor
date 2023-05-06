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
  text: string;
  // should this be an object?
  detection: string;
};

const EXAMPLES = [
  {
    currentDate: "Saturday, May 6, 2023",
    text: "I was born on 12/31/1999",
    output: {
      date: "1999/12/31",
      start: 14,
      end: 26,
    },
  },
  {
    currentDate: "Saturday, May 6, 2023",
    text: "Remind me to take out the trash on Tuesday.",
    output: {
      date: "2023/05/10",
      start: 35,
      end: 42,
    },
  },
  {
    currentDate: "Saturday, May 6, 2023",
    text: "Next friday I will write a paper on the history of Wednesday",
    output: {
      date: "2023/05/12",
      start: 0,
      end: 11,
    },
  },
];

const exampleTranscript = EXAMPLES.flatMap(({ currentDate, text, output }) => [
  {
    role: "user" as const,
    content: dedent`
      Current date: ${currentDate}
      Text: ${text}
    `,
  },
  {
    role: "assistant" as const,
    content: dedent`
      {
        "date": "${output.date}",
        "start": ${output.start},
        "end": ${output.end}
      }
    `,
  },
]);

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
          You are an assistant helping to extract dates from plain text.
          You will receive the current date and some text.
          You will output a JSON object with the date and the start and end indices of the date in the text.
          The date should be in the format YYYY/MM/DD.
          The start and end indices should be 0-indexed.
        `,
      },
      ...exampleTranscript,
      {
        role: "user",
        content: dedent`
          Current date: ${new Date().toLocaleDateString()}
          Text: ${text}
        `,
      },
    ],
  });

  const detection =
    completion.data.choices[0].message?.content ?? "[empty response]";

  res.status(200).json({
    text,
    detection,
  });
}
