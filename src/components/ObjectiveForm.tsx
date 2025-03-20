
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const objectiveFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  kpi: z.string().min(3, {
    message: "KPI must be at least 3 characters.",
  }),
  weight: z.coerce.number().min(1).max(100),
  target: z.string().min(1, {
    message: "Target is required.",
  }),
  dueDate: z.string().min(1, {
    message: "Due date is required.",
  }),
  status: z.enum(["On Track", "At Risk", "Delayed", "Completed"]),
});

type ObjectiveFormValues = z.infer<typeof objectiveFormSchema>;

interface ObjectiveFormProps {
  defaultValues?: Partial<ObjectiveFormValues>;
  onSubmit: (values: ObjectiveFormValues) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const ObjectiveForm = ({
  defaultValues = {
    title: "",
    description: "",
    kpi: "",
    weight: 10,
    target: "",
    dueDate: new Date().toISOString().slice(0, 10),
    status: "On Track",
  },
  onSubmit,
  onCancel,
  isEditing = false,
}: ObjectiveFormProps) => {
  const form = useForm<ObjectiveFormValues>({
    resolver: zodResolver(objectiveFormSchema),
    defaultValues,
  });

  const handleSubmit = (values: ObjectiveFormValues) => {
    onSubmit(values);
    toast.success(
      isEditing ? "Objective updated successfully" : "Objective added successfully"
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Improve customer satisfaction score" {...field} />
              </FormControl>
              <FormDescription>
                A clear, concise title for the objective.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Increase the average customer satisfaction rating from 4.2 to 4.5"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Detailed description of what this objective aims to achieve.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="kpi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>KPI</FormLabel>
                <FormControl>
                  <Input placeholder="Customer Satisfaction Rating" {...field} />
                </FormControl>
                <FormDescription>
                  Key performance indicator to measure success.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (%)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" max="100" {...field} />
                </FormControl>
                <FormDescription>
                  Importance weight (1-100%). Total across all objectives should be 100%.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="target"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target</FormLabel>
                <FormControl>
                  <Input placeholder="4.5/5.0" {...field} />
                </FormControl>
                <FormDescription>
                  Specific measurable target to achieve.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  Target completion date.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="On Track">On Track</SelectItem>
                    <SelectItem value="At Risk">At Risk</SelectItem>
                    <SelectItem value="Delayed">Delayed</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Current progress status of the objective.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update Objective" : "Add Objective"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ObjectiveForm;
