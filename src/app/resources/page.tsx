import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Search, Heart } from "lucide-react";
import Link from "next/link";

const resources = [
  {
    title: "Suicide & Crisis",
    icon: Phone,
    details: "Call 988",
    action: "Call",
    href: "tel:988",
    info: "24/7 Confidential",
  },
  {
    title: "Crisis Text Line",
    icon: MessageSquare,
    details: "Text HELLO to 741741",
    action: "Text",
    href: "sms:741741",
    info: "24/7 Confidential",
  },
  {
    title: "Domestic Violence Hotline",
    icon: Phone,
    details: "Call 1-800-799-SAFE (7233)",
    action: "Call",
    href: "tel:1-800-799-7233",
    info: "24/7 Confidential",
  },
  {
    title: "International Crisis Directory",
    icon: Search,
    details: "Find a local crisis center anywhere in the world.",
    action: "Find Local Help",
    href: "https://findahelpline.com/",
    info: "Global directory",
  },
];

export default function ResourcesPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="flex items-center gap-2 font-headline text-3xl font-bold">
          Crisis Resources <Heart className="text-primary" />
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          If you're in crisis or need immediate help, these resources are here
          for you 24/7. ArisCBT is not a substitute for professional care.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:px-20 xl:px-40">
        {resources.map((resource) => (
          <Card
            key={resource.title}
            className="flex flex-col text-center transition-all hover:shadow-lg"
          >
            <CardHeader className="items-center">
              <div className="flex items-center gap-2">
                <resource.icon className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-xl">{resource.title}</CardTitle>
              </div>
              <CardDescription>{resource.details}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <Button asChild className="rounded-full px-8 py-6 text-lg">
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
