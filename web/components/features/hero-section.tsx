"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background py-20 md:py-32">
      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="secondary"
            className="mb-6 inline-flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Powered by Gemini 2.5 Pro
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Daily AI Swing Trade Signals
          </h1>
          <p className="mb-8 text-lg text-muted-foreground sm:text-xl md:text-2xl">
            Get daily technical analysis reports for US stocks. Our AI-powered
            automation analyzes market data and delivers swing trading
            opportunities directly to your inbox.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/subscribe">
              <Button size="lg" className="w-full sm:w-auto">
                Start Receiving Signals
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn How It Works
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
