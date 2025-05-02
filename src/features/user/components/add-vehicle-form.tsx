import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";
import { InferOutput } from "valibot";
import { Button } from "@/components/ui/button";
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
import { addVehicle } from "@/features/user/actions/add-vehicle";

const formSchema = v.object({
  name: v.pipe(
    v.string("name is required"),
    v.minLength(1, "Needs to be at least 1 character"),
  ),
  mpg: v.pipe(
    v.number("mpg is required"),
    v.integer("needs to be integer"),
    v.minValue(0),
  ),
});

export const AddVehicleForm = () => {
  const form = useForm<InferOutput<typeof formSchema>>({
    resolver: valibotResolver(formSchema),
    defaultValues: {
      name: "",
      mpg: 0,
    },
  });

  function onSubmit(values: InferOutput<typeof formSchema>) {
    console.log(values);
    addVehicle(values);
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
                <Input placeholder="My car" {...field} />
              </FormControl>
              <FormDescription>This is your car name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mpg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MPG</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  {...form.register("mpg", { valueAsNumber: true })}
                />
              </FormControl>
              <FormDescription>This is the MPG of your car.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
