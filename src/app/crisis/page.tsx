import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Search, Siren } from "lucide-react";
import Link from "next/link";

const resources = [
  {
    title: "Suicide & Crisis Lifeline",
    icon: Phone,
    details: "Call or Text 988",
    action: "Call 988",
    href: "tel:988",
    info: "24/7 Confidential Support",
  },
  {
    title: "Crisis Text Line",
    icon: MessageSquare,
    details: "Text HOME to 741741",
    action: "Text HOME",
    href: "sms:741741?&body=HOME",
    info: "24/7 Confidential Support",
  },
  {
    title: "The Trevor Project",
    icon: Phone,
    details: "Call 1-866-488-7386",
    action: "Call",
    href: "tel:1-866-488-7386",
    info: "For LGBTQ Youth",
  },
  {
    title: "International Crisis Directory",
    icon: Search,
    details: "Find a local crisis center anywhere in the world.",
    action: "Find Local Help",
    href: "https://findahelpline.com/",
    info: "Global Directory",
  },
];

export default function CrisisPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="flex items-center gap-2 font-headline text-3xl font-bold text-destructive">
          Immediate Help <Siren className="h-7 w-7" />
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          If you are in crisis, you are not alone. Please use these resources to
          get immediate, confidential help. Your safety is the priority.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:px-20 xl:px-40">
        {resources.map((resource) => (
          <Card
            key={resource.title}
            className="flex flex-col border-destructive/50 text-center transition-all hover:shadow-lg dark:bg-destructive/10"
          >
            <CardHeader className="items-center">
              <div className="flex items-center gap-2">
                <resource.icon className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-xl">{resource.title}</CardTitle>
              </div>
              <CardDescription>{resource.details}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <Button
                asChild
                className="rounded-full px-8 py-6 text-lg"
                variant="destructive"
              >
                <Link href={resource.href} target="_blank">
                  {resource.action}
                </Link>
              </Button>
            </CardContent>
            <CardFooter className="justify-center text-sm text-muted-foreground">
              {resource.info}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
