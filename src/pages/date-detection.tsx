import { useCallback, useState } from "react";
import { DetectionResponse } from "./api/date-detection";

export default function App() {
  const [text, setText] = useState<string>("stop by the post office wednesday");

  const [response, setResponse] = useState<DetectionResponse>({
    detection: "",
  });

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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-96">
        <textarea
          className="w-full h-32 p-4 border border-gray-300 rounded-md"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          type="submit"
          className="flex flex-row justify-center gap-2 items-center px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Loading..." : "Detect"}
          <div className="text-blue-300">⌘+⏎</div>
        </button>

        <div className="relative group whitespace-pre-wrap w-full min-h-[8rem] p-4 border border-gray-300 rounded-md">
          {response.detection}
          <CopyButton text={response.detection} />
        </div>
      </form>
    </main>
  );
}

function CopyButton(props: { text: string }) {
  const [copyLabel, setCopyLabel] = useState<string>("Copy");

  return (
    <button
      type="button"
      className="absolute top-0 right-0 px-2 py-2 text-gray-500 text-xs opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
      onClick={() => {
        setCopyLabel("Copied!");
        setTimeout(() => setCopyLabel("Copy"), 1000);
        navigator.clipboard.writeText(props.text);
      }}
    >
      {copyLabel}
    </button>
  );
}
