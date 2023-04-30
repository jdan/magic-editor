import { useCallback, useState } from "react";
import { ImproveResponse } from "./api/improve";
import { Diff } from "diff-match-patch";

type Mode = "text-only" | "diff" | "diff-overwrite";

export default function App() {
  const [text, setText] = useState<string>("");

  const [response, setResponse] = useState<ImproveResponse>({
    improvement: "",
    diff: [],
  });

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
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Loading..." : "Improve"}
        </button>

        {mode === "text-only" ? (
          <div className="w-full h-32 p-4 border border-gray-300 rounded-md">
            {response.improvement}
          </div>
        ) : (
          <div className="w-full h-32 p-4 border border-gray-300 rounded-md">
            <Diff diff={response.diff} mode={mode} />
          </div>
        )}

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

function Diff(props: { diff: Diff[]; mode: "diff" | "diff-overwrite" }) {
  const additionClassName =
    props.mode === "diff"
      ? "bg-green-200"
      : "bg-yellow-200 border-b-2 border-b-yellow-400";

  return (
    <div>
      {props.diff.map((d, i) => {
        if (props.mode === "diff-overwrite" && d[0] === -1) return null;

        const style =
          d[0] === 1 ? additionClassName : d[0] === -1 ? "bg-red-200" : "";
        return (
          <span key={i} className={style}>
            {d[1]}
          </span>
        );
      })}
    </div>
  );
}
