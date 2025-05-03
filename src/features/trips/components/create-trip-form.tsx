"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";
import { InferOutput } from "valibot";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createTrip } from "@/features/trips/actions/create-trip";

const formSchema = v.object({
  name: v.pipe(
    v.string("name is required"),
    v.minLength(1, "Needs to be at least 1 character"),
  ),
});

export const CreateTripForm = () => {
  const form = useForm<InferOutput<typeof formSchema>>({
    resolver: valibotResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: InferOutput<typeof formSchema>) {
    createTrip(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My trip" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create Trip</Button>
      </form>
    </Form>
  );
}; 