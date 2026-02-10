import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-900 font-sans dark:bg-zinc-950 dark:text-gray-100">
      <main className="flex flex-col items-center text-center px-4 md:px-8">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
          Research Collaboration Platform
        </h1>
        <p className="max-w-xl text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
          The unified workspace for seamless document editing, real-time collaboration, and project management.
        </p>

        <Link
          href="/auth/signin"
          className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Log In / Get Started
        </Link>
      </main>
    </div>
  );
}
