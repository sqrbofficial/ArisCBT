"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import type { MoodEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  date: z.date(),
  mood: z.number().min(1).max(10),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ProgressPage() {
  const [moodData, setMoodData] = useLocalStorage<MoodEntry[]>("moodData", []);
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      mood: 5,
      notes: "",
    },
  });

  useEffect(() => {
    if (selectedDate) {
      const entry = moodData.find((d) => isSameDay(new Date(d.date), selectedDate));
      form.reset({
        date: selectedDate,
        mood: entry?.mood || 5,
        notes: entry?.notes || "",
      });
    }
  }, [selectedDate, moodData, form]);

  const onSubmit = (values: FormData) => {
    const newEntry: MoodEntry = {
      date: format(values.date, "yyyy-MM-dd"),
      mood: values.mood,
      notes: values.notes || "",
    };

    setMoodData((prev) => {
      const existingIndex = prev.findIndex((d) => d.date === newEntry.date);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = newEntry;
        return updated;
      }
      return [...prev, newEntry];
    });

    toast({
      title: "Entry Saved",
      description: `Your mood for ${format(values.date, "PPP")} has been saved.`,
    });
  };

  const sortedData = useMemo(() => {
    return [...moodData]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((d) => ({ ...d, formattedDate: format(new Date(d.date), "MMM d") }));
  }, [moodData]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="font-headline text-2xl font-bold">Your Progress</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Log Your Mood</CardTitle>
            <CardDescription>
              Select a day and record how you're feeling.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="grid gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setSelectedDate(date);
                            }}
                            disabled={(date) =>
                              date > new Date() || date < addDays(new Date(), -365)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mood: {field.value}/10</FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={10}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any thoughts or feelings to note?"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" /> Save Entry
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Mood Over Time</CardTitle>
            <CardDescription>
              A visualization of your mood entries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sortedData.length > 1 ? (
              <ChartContainer
                config={{
                  mood: { label: "Mood", color: "hsl(var(--primary))" },
                }}
                className="h-[300px] w-full"
              >
                <LineChart data={sortedData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="formattedDate"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 6)}
                  />
                  <YAxis
                    dataKey="mood"
                    domain={[1, 10]}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line
                    dataKey="mood"
                    type="monotone"
                    stroke="var(--color-mood)"
                    strokeWidth={2}
                    dot={true}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
                <p className="text-sm text-muted-foreground">
                  Not enough data to display a chart. Please add at least two
                  mood entries.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
