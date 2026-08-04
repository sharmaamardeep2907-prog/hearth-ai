import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-display font-extrabold text-gradient-gold mb-4 select-none">404</div>
        <h1 className="text-2xl font-display font-bold text-hearth-muted-foreground mb-2">Page Not Found</h1>
        <p className="text-hearth-muted-foreground/60 mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/"><Button variant="luxury" leftIcon={<Home className="h-4 w-4" />}>Back to Home</Button></Link>
          <Link href="/services"><Button variant="secondary" leftIcon={<Search className="h-4 w-4" />}>Browse Services</Button></Link>
        </div>
      </div>
    </div>
  );
}