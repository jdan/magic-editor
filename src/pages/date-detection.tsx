import { useCallback, useMemo, useState } from "react";
import { DetectionResponse } from "./api/date-detection";
import { TextArea } from "@/components/TextArea";
import { CopyButton } from "@/components/CopyButton";
import Head from "next/head";
import Link from "next/link";

export default function DateDetection() {
  const [text, setText] = useState<string>("stop by the post office wednesday");

  const [response, setResponse] = useState<DetectionResponse>({
    detection: "",
    text: "",
  });

  const extraction = useMemo(() => {
    try {
      return JSON.parse(response.detection) as ExtractionProps;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [response.detection]);

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setLoading(true);

      const res = await fetch("/api/date-detection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const response = await res.json();
      setResponse(response);
      setLoading(false);
    },
    [text]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && e.metaKey) {
        handleSubmit(e as any);
      }
    },
    [handleSubmit]
  );

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Date Detection</title>
      </Head>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-96">
        <TextArea value={text} onChange={setText} onKeyDown={handleKeyDown} />

        <button
          type="submit"
          className="flex flex-row justify-center gap-2 items-center px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Loading..." : "Detect date"}
          <div className="text-blue-300">⌘+⏎</div>
        </button>

        {extraction ? (
          <>
            <Extraction
              annotated={extraction.annotated}
              date={extraction.date}
            />
            <div className="relative group whitespace-pre-wrap w-full min-h-[8rem] p-4 border border-gray-300 rounded-md font-mono text-sm">
              {response.detection ? (
                response.detection
              ) : (
                <div className="text-gray-400">No response</div>
              )}
              <CopyButton text={response.detection} />
            </div>
          </>
        ) : (
          <div className="relative group whitespace-pre-wrap w-full p-4 border border-gray-300 rounded-md text-gray-400">
            No date detected
          </div>
        )}
      </form>
    </main>
  );
}

interface ExtractionProps {
  annotated: string;
  date: string;
}

export function Extraction(props: ExtractionProps) {
  const { annotated, date } = props;

  const chunks = useMemo(() => {
    const matches = annotated.match(/{{(.+?)}}/g);
    if (!matches) {
      return [];
    }

    const chunks = annotated.split(/{{.+?}}/g);
    return chunks.map((chunk, i) => {
      return (
        <span key={i} className="whitespace-pre-wrap">
          {chunk}
          {matches[i] &&
            (i === 0 ? (
              <span className="bg-blue-100 rounded-sm p-px">
                {matches[i].slice(2, -2)}
              </span>
            ) : (
              matches[i].slice(2, -2)
            ))}
        </span>
      );
    });
  }, [annotated]);

  // date in the format Day of week, Month Day, Year
  const formattedString = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <div className="whitespace-pre-wrap w-full min-h-[8rem] p-4 border border-gray-300 rounded-md">
        {chunks}
      </div>

      <div className="relative group flex flex-col items-start gap-2 whitespace-pre-wrap w-full p-4 border border-gray-300 rounded-md">
        <div>
          Detected date:{" "}
          <span className="bg-blue-100 rounded-sm p-px">{formattedString}</span>
        </div>
        <input
          type="date"
          value={
            // date in the format YYYY-MM-DD
            new Date(date).toISOString().split("T")[0]
          }
        />
        <CopyButton text={formattedString} />
      </div>
    </>
  );
}
