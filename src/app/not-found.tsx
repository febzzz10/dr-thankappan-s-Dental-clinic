import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center px-4 text-center">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-teal-50">
        <Image src="/images/tooht.png" alt="" width={56} height={56} className="object-contain p-2" />
      </div>
      <h1 className="mt-6 font-display text-fluid-h1 font-bold text-slate-900">404</h1>
      <p className="mt-2 text-fluid-body text-slate-600">
        Page not found. The link may be broken or the page was moved.
      </p>
      <p className="mt-1 text-fluid-sm text-slate-400">
        Try heading back to our homepage.
      </p>
      <Link href="/" className="mt-8">
          <Button variant="primary" size="lg">
            Back to Home
          </Button>
      </Link>
    </div>
  );
}
