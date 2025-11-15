import { HeroSection } from "@/components/features/hero-section";
import { HowItWorks } from "@/components/features/how-it-works";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Zap, Shield, Mail } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "AI-Powered Analysis",
    description:
      "Leveraging Gemini 2.5 Pro to analyze technical indicators and generate trading signals.",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description:
      "Every signal includes entry, target, stop-loss, and risk/reward ratios.",
  },
  {
    icon: Mail,
    title: "Daily Delivery",
    description:
      "Receive your personalized report every weekday after market close.",
  },
  {
    icon: CheckCircle2,
    title: "Technical Focus",
    description:
      "Pure technical analysis based on RSI, MACD, Bollinger Bands, and more.",
  },
];

export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <section className="py-20 md:py-32 bg-muted/50">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Why Choose HD Signals?
            </h2>
            <p className="text-lg text-muted-foreground">
              Professional-grade technical analysis delivered automatically.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
