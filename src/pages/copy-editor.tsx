import { useCallback, useState } from "react";
import { ImproveResponse } from "./api/improve";
import { Diff } from "diff-match-patch";

type Mode = "text-only" | "diff" | "diff-overwrite";

export default function App() {
  const [text, setText] = useState<string>("Helo world!1");

  const [response, setResponse] = useState<ImproveResponse>({
    improvement: "",
    diff: [],
  });

  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [instructions, setInstructions] = useState<string>(
    ["Improved spelling and grammar", "Correct punctuation"].join("\n")
  );

  const [mode, setMode] = useState<Mode>("text-only");

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setLoading(true);

      const res = await fetch("/api/improve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, instructions }),
      });

      const response = await res.json();
      setResponse(response);

      setLoading(false);
    },
    [text, instructions]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && e.metaKey) {
        handleSubmit(e as any);
      }
    },
    [handleSubmit]
  );

  const handleInstructionsToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setShowInstructions((prev) => !prev);
  }, []);

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
          className="flex py-1 gap-2"
          type="button"
          onClick={handleInstructionsToggle}
        >
          <span
            className={`transition-transform ${
              showInstructions ? "rotate-90" : ""
            }`}
          >
            ▶
          </span>
          Instructions
        </button>
        {showInstructions && (
          <div className="flex flex-col gap-2">
            <p className="text-gray-500 text-sm">
              Explain your desired output. One instruction per line.
            </p>
            <textarea
              className="w-full h-32 p-4 border border-gray-300 rounded-md"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        )}

        <button
          type="submit"
          className="flex flex-row justify-center gap-2 items-center px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Loading..." : "Improve"}
          <div className="text-blue-300">⌘+⏎</div>
        </button>

        <div className="relative group whitespace-pre-wrap w-full min-h-[8rem] p-4 border border-gray-300 rounded-md">
          {mode === "text-only" ? (
            response.improvement
          ) : (
            <Diff diff={response.diff} mode={mode} />
          )}

          <CopyButton text={response.improvement} />
        </div>

        {/* a segmented control to switch between modes */}
        <div className="flex gap-px">
          <button
            type="button"
            className={`px-4 py-2 text-white rounded-l-md ${
              mode === "text-only" ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => setMode("text-only")}
          >
            Text
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-white ${
              mode === "diff" ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => setMode("diff")}
          >
            Diff
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-white rounded-r-md ${
              mode === "diff-overwrite" ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => setMode("diff-overwrite")}
          >
            Over
          </button>
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

function Diff(props: { diff: Diff[]; mode: "diff" | "diff-overwrite" }) {
  const additionClassName =
    props.mode === "diff"
      ? "bg-green-200"
      : "bg-yellow-200 underline decoration-yellow-400";
  const deletionClassName = "bg-red-200";

  return (
    <div>
      {props.diff.map((d, i) => {
        if (props.mode === "diff-overwrite" && d[0] === -1) return null;

        const style =
          d[0] === 1 ? additionClassName : d[0] === -1 ? deletionClassName : "";
        return (
          <span key={i} className={style}>
            {d[1]}
          </span>
        );
      })}
    </div>
  );
}
