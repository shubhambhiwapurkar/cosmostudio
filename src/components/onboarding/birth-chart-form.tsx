"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { createBirthChart } from "@/lib/chart-api";
import { useRouter } from "next/navigation";
import CalculatingChart from "./calculating-chart";

const formSchema = z.object({
  dateOfBirth: z.date({
    required_error: "A date of birth is required.",
  }),
  timeOfBirth: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in HH:mm format.",
  }),
  latitude: z.coerce.number().min(-90).max(90, {
    message: "Latitude must be between -90 and 90.",
  }),
  longitude: z.coerce.number().min(-180).max(180, {
    message: "Longitude must be between -180 and 180.",
  }),
  timezone: z.string().min(1, {
    message: "Timezone is required.",
  }),
});

type BirthChartFormProps = {
  onChartCreated: () => void;
};

export default function BirthChartForm({ onChartCreated }: BirthChartFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      latitude: 0,
      longitude: 0,
      timezone: "",
    },
  });

  async function handleFormSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await createBirthChart({
        birth_date: format(values.dateOfBirth, "yyyy-MM-dd"),
        birth_time: values.timeOfBirth,
        latitude: values.latitude,
        longitude: values.longitude,
        timezone: values.timezone,
      });
      toast({
        title: "Your chart is ready!",
        description: "Your cosmic blueprint has been generated.",
      });
      onChartCreated();
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error creating chart",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading && <CalculatingChart />}
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-sm shadow-2xl shadow-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl">Unlock Your Cosmic Blueprint</CardTitle>
            <CardDescription>
              Welcome! To begin, I just need a few details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
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
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
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
                  name="timeOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time of Birth</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormDescription>
                        For the most accurate reading.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.0001" placeholder="e.g., 34.0522" {...field} />
                      </FormControl>
                      <FormDescription>
                        Geographic latitude (-90 to 90).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.0001" placeholder="e.g., -118.2437" {...field} />
                      </FormControl>
                      <FormDescription>
                        Geographic longitude (-180 to 180).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., America/Los_Angeles" {...field} />
                      </FormControl>
                      <FormDescription>
                        IANA Time Zone Database name (e.g., America/New_York).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Generating Chart..." : "Generate Chart"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
