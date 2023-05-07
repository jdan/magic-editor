import { useState } from "react";

export function CopyButton(props: { text: string }) {
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
