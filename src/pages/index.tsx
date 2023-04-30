import { useCallback, useState } from "react";

export default function App() {
  const [text, setText] = useState<string>("");
  const [output, setOutput] = useState<string>("");
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

      const { improvement } = await res.json();
      setOutput(improvement);

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
        <textarea
          className="w-full h-32 p-4 border border-gray-300 rounded-md"
          value={output}
          readOnly
        />
      </form>
    </main>
  );
}
