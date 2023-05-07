interface Props {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function TextArea({ value, onChange, onKeyDown }: Props) {
  return (
    <textarea
      className="w-full h-32 p-4 border border-gray-300 rounded-md"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
    />
  );
}
