import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-center">
      <p className="text-8xl font-black tracking-tight text-ink/10">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 max-w-sm text-ink/55">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="btn-primary">
          <Home className="h-4 w-4" /> Home
        </Link>
        <Link href="/community" className="btn-outline">
          <Search className="h-4 w-4" /> Browse creators
        </Link>
      </div>
    </div>
  );
}
