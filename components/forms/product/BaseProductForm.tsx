import { useForm } from "react-hook-form";

import { CategorySelector } from "@/components/forms/product/CategorySelector";
import { EntityFormMode } from "@/components/table/types";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { z } from "zod";

export const productFormSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required.",
  }),
  description: z.string().min(1, {
    message: "Description is required.",
  }),
  categoryId: z.number().min(1, {
    message: "Category is required.",
  }),
  // Allow empty string and transform to undefined
  price: z.union([
    z.string().transform(val => val === "" ? undefined : parseFloat(val)),
    z.number()
  ])
    .refine(val => val === undefined || (typeof val === "number" && val > 0), {
      message: "Price must be a positive number.",
    }),
  image: z.string().url({
    message: "Must be a valid URL.",
  }).optional().or(z.literal("")),
  tags: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

interface BaseProductFormProps {
  defaultValues: ProductFormValues;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  onCancel?: () => void;
  mode: EntityFormMode;
  className?: string;
}

export default function BaseProductForm({
  defaultValues,
  onSubmit,
  onCancel,
  mode,
  className = ""
}: BaseProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const isSubmitting = form.formState.isSubmitting;
  const submitLabel = mode === "add" ? "Create Product" : "Save Changes";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-4 ${className}`}>
        <div className="mt-3 grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Product title" {...field} />
                </FormControl>
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
                  <Textarea placeholder="Product description" className="min-h-[60px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <CategorySelector
            control={form.control}
            name="categoryId"
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (€)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? "" : parseFloat(value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (comma separated, optional)</FormLabel>
                <FormControl>
                  <Input placeholder="tag1, tag2, tag3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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