import Link from "next/link";
import Image from "next/image";
import { SecondaryButton } from "@repo/ui/SecondaryButton";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="flex justify-center">
          <Image
            src="/assets/error-pages/401-error.png"
            alt="401 Unauthorized"
            width={120}
            height={120}
            sizes="120px"
            priority
            className="opacity-80 hover:opacity-100 transition-opacity duration-200"
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-medium text-[var(--text-heading)]">
            401
          </h1>
          <p className="text-[var(--text-muted)] text-sm">
            Please log in to access this page.
          </p>
        </div>
        <SecondaryButton asChild>
          <Link href="/login">Go to Login</Link>
        </SecondaryButton>
      </div>
    </div>
  );
}
