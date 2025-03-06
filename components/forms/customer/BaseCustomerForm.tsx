import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { z } from "zod";

// Customer form schema with validation rules
export const customerFormSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required.",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  phone: z.string()
    .min(1, { message: "Phone number is required." })
    .regex(/^[0-9+\-\s]*$/, {
      message: "Phone number can only contain digits, +, - and spaces.",
    }),
  street: z.string().min(1, {
    message: "Street is required.",
  }),
  city: z.string().min(1, {
    message: "City is required.",
  }),
  state: z.string().min(1, {
    message: "State is required.",
  }),
  country: z.string().min(1, {
    message: "Country is required.",
  }),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;

// Field definitions for rendering
const customerFields: { name: keyof CustomerFormValues; label: string; placeholder: string }[] = [
  { name: "firstName", label: "First Name", placeholder: "John" },
  { name: "lastName", label: "Last Name", placeholder: "Doe" },
  { name: "email", label: "Email", placeholder: "john.doe@example.com" },
  { name: "phone", label: "Phone", placeholder: "+1 (555) 123-4567" },
  { name: "street", label: "Street", placeholder: "123 Main St" },
  { name: "city", label: "City", placeholder: "San Diego" },
  { name: "state", label: "State", placeholder: "California" },
  { name: "country", label: "Country", placeholder: "United States" },
] as const;

type CustomerFormMode = "add" | "edit";

interface BaseCustomerFormProps {
  defaultValues: CustomerFormValues;
  onSubmit: (data: CustomerFormValues) => Promise<void>;
  onCancel?: () => void;
  mode: CustomerFormMode;
  className?: string;
}

export default function BaseCustomerForm({
  defaultValues,
  onSubmit,
  onCancel,
  mode,
  className = ""
}: BaseCustomerFormProps) {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues,
  });

  const isSubmitting = form.formState.isSubmitting;
  const submitLabel = mode === "add" ? "Create Customer" : "Save Changes";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-4 ${className}`}>
        <div className="mt-3 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {customerFields.map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name as keyof CustomerFormValues}
              render={({ field: formField }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-left mb-2">{field.label}</FormLabel>
                  <FormControl>
                    <Input placeholder={field.placeholder} {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}