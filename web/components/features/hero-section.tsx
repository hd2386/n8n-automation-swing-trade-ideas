"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen overflow-hidden">
      {/* Full-screen Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/trade-bild.jpeg"
          alt="Professional trading desk with market charts"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark gradient overlay - stronger on text area */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
      </div>

      {/* Content */}
      <div className="container relative z-10 flex min-h-[90vh] md:min-h-screen items-center">
        <div className="max-w-2xl py-20 md:py-32">
          <Badge
            variant="secondary"
            className="mb-6 inline-flex items-center gap-2 bg-white/10 text-white border-white/20 backdrop-blur-sm"
          >
            <TrendingUp className="h-4 w-4" />
            Powered by Gemini 2.5 Pro
          </Badge>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Daily AI Swing Trade Signals
          </h1>

          <p className="mb-8 text-lg text-white/80 sm:text-xl md:text-2xl leading-relaxed">
            Get daily technical analysis reports for US stocks. Our AI-powered
            automation analyzes market data and delivers swing trading
            opportunities directly to your inbox.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/subscribe">
              <Button size="lg" className="w-full sm:w-auto text-base px-8">
                Start Receiving Signals
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base px-8 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                Learn How It Works
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
