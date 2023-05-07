import Link from "next/link";

export default function App() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2 gap-8">
      <h1 className="text-4xl font-bold text-center">magic-editor</h1>

      <div className="flex flex-col items-center justify-center gap-2">
        <Card
          title="Copy Editor"
          subtitle="A copy editor that helps you improve your writing."
          href="/copy-editor"
        />
        <Card
          title="Date Detection"
          subtitle="A date detection tool that helps you extract dates from text."
          href="/date-detection"
        />
      </div>
    </main>
  );
}

function Card(props: { title: string; subtitle: string; href: string }) {
  const { title, subtitle, href } = props;

  return (
    <Link
      href={href}
      className="flex justify-center items-center w-96 gap-2 p-4 border border-gray-300 rounded-md hover:border-blue-500 hover:shadow-md transition-all"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-500">{subtitle}</p>
      </div>
      {/* add a chevron to the right side */}
      <div className="flex justify-end">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-300 hover:text-blue-500 transition-all"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
}
