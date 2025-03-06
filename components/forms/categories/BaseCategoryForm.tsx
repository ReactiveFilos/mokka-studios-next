import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { EntityFormMode } from "@/components/table/types";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  slug: z.string()
    .min(1, { message: "Identifier is required." })
    .regex(/^[a-z0-9-]+$/, {
      message: "Identifier can only contain lowercase letters, numbers, and hyphens.",
    })
    .refine(val => !val.startsWith("-") && !val.endsWith("-"), {
      message: "Identifier cannot start or end with a hyphen."
    }),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

// Field definitions for rendering
const categoryFields: { name: keyof CategoryFormValues; label: string; placeholder: string }[] = [
  { name: "name", label: "Category Name", placeholder: "Electronics" },
  { name: "slug", label: "Identifier", placeholder: "electronics" },
] as const;

interface BaseCategoryFormProps {
  defaultValues: CategoryFormValues;
  onSubmit: (data: CategoryFormValues) => Promise<void>;
  onCancel?: () => void;
  mode: EntityFormMode;
  className?: string;
}

export default function BaseCategoryForm({
  defaultValues,
  onSubmit,
  onCancel,
  mode,
  className = ""
}: BaseCategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues,
  });

  const isSubmitting = form.formState.isSubmitting;
  const submitLabel = mode === "add" ? "Create Category" : "Save Changes";

  // Optional: Add slug generation from name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special chars except spaces, underscores, hyphens
      .replace(/\s+/g, "-")     // Replace spaces with hyphens
      .replace(/--+/g, "-")     // Replace multiple hyphens with single hyphen
      .trim();
  };

  // Optional: For better UX, auto-generate slug from name
  const watchName = form.watch("name");
  const currentSlug = form.watch("slug");

  // Update slug when name changes and slug hasn't been manually edited
  useEffect(() => {
    // Only auto-generate slug in add mode or if slug is empty
    const newSlug = generateSlug(watchName);
    form.setValue("slug", newSlug);
  }, [watchName, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-4 ${className}`}>
        <div className="mt-3 grid grid-cols-1 gap-6">
          {categoryFields.map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
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