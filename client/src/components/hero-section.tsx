import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BarChart2,
  Brain,
  HeartPulse,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const features = [
  {
    title: "Advanced AI-Powered Analysis",
    description:
      "Utilize AI to evaluate key health metrics and identify critical factors for stem cell therapy.",
    icon: Brain,
  },
  {
    title: "Personalized Health Recommendations",
    description:
      "Receive tailored suggestions to optimize your suitability for stem cell therapy.",
    icon: HeartPulse,
  },
  {
    title: "Risk and Impact Assessment",
    description:
      "Identify potential health risks with severity and impact analysis for better decision-making.",
    icon: ShieldCheck,
  },
  {
    title: "Therapy Suitability Score",
    description:
      "Get a detailed score reflecting your readiness and potential for stem cell therapy success.",
    icon: BarChart2,
  },
  {
    title: "Comprehensive Insights",
    description:
      "Understand the full scope of your health with clear, actionable insights from critical metrics.",
    icon: Zap,
  },
  {
    title: "Data Security",
    description:
      "Your data is protected with industry-standard encryption and data protection measures.",
    icon: ShieldCheck,
  },
];

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-background/80">
      <div className="container px-4 md:px-6 flex flex-col items-center max-w-6xl mx-auto">
        <Link
          href={"/dashboard"}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "px-4 py-2 mb-4 rounded-full hidden md:flex"
          )}
        >
          <span className="mr-3 hidden md:block">
            <Zap className="size-3.5" />
          </span>
          Introducing Advanced Stem Cell Therapy Metrics
        </Link>
        <div className="text-center mb-12 w-full">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
            Revolutionize Your Stem Cell Therapy Journey
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Leverage cutting-edge AI to analyze your health, identify risks, and
            optimize your readiness for stem cell therapy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              className="inline-flex items-center justify-center text-lg"
              size={"lg"}
            >
              Get Started
              <ArrowRight className="ml-2 size-5" />
            </Button>
            <Button
              className="inline-flex items-center justify-center text-lg"
              size={"lg"}
              variant={"outline"}
            >
              Learn More
              <Zap className="ml-2 size-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12">
            {features.map((feature) => (
              <Card key={feature.title} className="h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
