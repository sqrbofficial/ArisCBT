import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Globe, Mic, Users, Video } from "lucide-react";
import Link from "next/link";

const resources = [
  {
    title: "National Suicide Prevention Lifeline",
    description:
      "Free and confidential support for people in distress, prevention and crisis resources for you or your loved ones.",
    icon: Mic,
    href: "https://988lifeline.org/",
  },
  {
    title: "Crisis Text Line",
    description:
      "Text HOME to 741741 from anywhere in the US, anytime, about any type of crisis.",
    icon: Users,
    href: "https://www.crisistextline.org/",
  },
  {
    title: "NAMI (National Alliance on Mental Illness)",
    description:
      "The nation's largest grassroots mental health organization dedicated to building better lives for millions of Americans.",
    icon: Globe,
    href: "https://www.nami.org/",
  },
  {
    title: "The Trevor Project",
    description:
      "The leading national organization providing crisis intervention and suicide prevention services to LGBTQ young people.",
    icon: Users,
    href: "https://www.thetrevorproject.org/",
  },
  {
    title: "Headspace",
    description:
      "Guided meditations, animations, articles and videos to help with mindfulness and stress reduction.",
    icon: Video,
    href: "https://www.headspace.com/",
  },
  {
    title: "Psychology Today",
    description:
      "Find detailed listings for mental health professionals, and explore articles and research on mental health topics.",
    icon: Globe,
    href: "https://www.psychologytoday.com/us",
  },
];

export default function ResourcesPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="font-headline text-2xl font-bold">Helpful Resources</h1>
      </div>
      <p className="text-muted-foreground">
        While ArisCBT can be a helpful guide, these resources can provide
        additional support. If you are in crisis, please contact a hotline or
        emergency services immediately.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <Card
            key={resource.title}
            className="transition-all hover:shadow-md"
          >
            <Link href={resource.href} target="_blank" rel="noopener noreferrer" className="block h-full">
              <CardHeader className="flex flex-row items-center gap-4">
                <resource.icon className="h-8 w-8 text-accent" />
                <div>
                  <CardTitle>{resource.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {resource.description}
                  </CardDescription>
                </div>
              </CardHeader>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
