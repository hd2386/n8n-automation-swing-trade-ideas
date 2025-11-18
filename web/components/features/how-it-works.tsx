"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WORKFLOW_STEPS } from "@/lib/constants";
import { UserCheck, Database, Workflow, Send, Clock } from "lucide-react";

const icons = [UserCheck, Database, Workflow, Send];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            How It Works
          </h2>
          <p className="mb-12 text-lg text-muted-foreground">
            Our n8n automation runs daily after market close, analyzing stocks
            and generating technical trading signals.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {WORKFLOW_STEPS.map((step, index) => {
            const Icon = icons[index] || Clock;
            return (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
