"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">HD Signals</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/subscribe">
            <Button variant="outline" size="sm">
              Subscribe
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
