import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import AppShell from "@/components/layout/app-shell";
import { SidebarTrigger } from "@/components/ui/sidebar";

const resourceSections = [
    {
        title: "Understanding CBT",
        content: "Cognitive Behavioral Therapy (CBT) is a type of psychotherapy that helps individuals identify and change destructive or disturbing thought patterns that have a negative influence on behavior and emotions. It focuses on the idea that your thoughts, feelings, and actions are interconnected."
    },
    {
        title: "Common Cognitive Distortions",
        content: "Some common cognitive distortions include: \n- **Catastrophizing:** Expecting the worst-case scenario. \n- **Black-and-White Thinking:** Seeing things in all-or-nothing terms. \n- **Overgeneralization:** Drawing a broad conclusion from a single event. \n- **Personalization:** Blaming yourself for things you can't control."
    },
    {
        title: "Mindfulness and MBSR",
        content: "Mindfulness-Based Stress Reduction (MBSR) is a program that incorporates mindfulness to assist people with pain, stress, and anxiety. It uses a combination of mindfulness meditation, body awareness, and yoga to help people become more mindful of the present moment."
    },
    {
        title: "When to Seek Professional Help",
        content: "While ArisCBT can be a helpful tool, it is not a substitute for professional medical or psychological advice, diagnosis, or treatment. If you are experiencing a mental health crisis, severe symptoms, or have been diagnosed with a serious mental health condition, please seek help from a qualified professional."
    }
]

export default function ResourcesPage() {
  return (
    <AppShell>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 bg-app-gradient text-white">
        <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-4 self-start">
                <SidebarTrigger className="md:hidden" />
                <h1 className="flex items-center gap-2 font-headline text-3xl font-bold">
                    <BookOpen className="text-primary" /> Learning Resources
                </h1>
            </div>
          <p className="max-w-2xl text-white/80">
            Expand your knowledge about CBT, mindfulness, and mental wellness.
          </p>
        </div>

          <Card className="lg:mx-auto lg:max-w-4xl bg-black/30 border-white/20 text-white">
              <CardHeader>
                  <CardTitle>Resource Library</CardTitle>
                  <CardDescription className="text-white/80">Information to support your therapy journey.</CardDescription>
              </CardHeader>
              <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                      {resourceSections.map((section, index) => (
                          <AccordionItem value={`item-${index}`} key={index} className="border-white/20">
                              <AccordionTrigger className="text-lg hover:no-underline">{section.title}</AccordionTrigger>
                              <AccordionContent className="prose prose-stone dark:prose-invert max-w-none text-white/80 whitespace-pre-wrap">
                                  {section.content}
                              </AccordionContent>
                          </AccordionItem>
                      ))}
                  </Accordion>
              </CardContent>
          </Card>
      </div>
    </AppShell>
  );
}
