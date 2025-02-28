import Link from "next/link";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootError } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

type FormSchema = z.infer<typeof formSchema>;

export default function ResetAuthForm() {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // Reset success state when email changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "email" && isSuccess) {
        setIsSuccess(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, isSuccess]);

  async function onSubmit(values: FormSchema) {
    const { email } = values;
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsSuccess(true);
    } catch (error) {
      form.setError("root", { message: "Failed to send reset link" });
    }
  }

  const buttonText = form.formState.isSubmitting
    ? <Loader2 className="animate-spin" />
    : isSuccess
      ? "Reset link sent"
      : "Send reset link";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="email@example.com"
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormRootError />
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting || isSuccess}>
          {buttonText}
        </Button>
        <div className="mt-4 text-center text-sm">
          Remembered your password?{" "}
          <Link href="login" className="underline underline-offset-4">
            Login
          </Link>
        </div>
      </form>
    </Form>
  );
}