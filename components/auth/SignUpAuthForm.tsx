import Link from "next/link";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { useUserAuth } from "@/context/hooks/fetch/useUserAuth";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const formSchema = z.object({
  fullname: z.string()
    .min(2, { message: "Full Name must be at least 2 characters." })
    .max(50, { message: "Full Name must be less than 25 characters." }),
  username: z.string()
    .min(2, { message: "Username must be at least 3 characters." })
    .max(25, { message: "Username must be less than 25 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username must contain only letters, numbers, underscores.",
    }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters." })
    .max(50, { message: "Password must be less than 50 characters." })
    // Regex for one upper case, one number, one special (@$!%*?&)
    .regex(/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
      message: "Password must contain at least one uppercase letter, one number and one special character (@$!%*?&)",
    }),
});

type FormSchema = z.infer<typeof formSchema>;

export default function SignUpAuthForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const { signUpWithEmailPassword } = useUserAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(values: FormSchema) {
    setIsLoading(true);
    try {
      const { fullname, username, email, password } = values;
      await signUpWithEmailPassword({ fullname, username, email, password });
      /**
       * Not supported by DummyJSON
       * TODO: Add simulation / caching system (demo purposes)
       */
    } finally {
      setIsLoading(false);
    }
  }

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="How should we call you?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type={isPasswordVisible ? "text" : "password"} {...field} />
              </FormControl>
              <FormMessage />
              <div className="flex items-center gap-3">
                <Checkbox checked={isPasswordVisible} onCheckedChange={togglePasswordVisibility} />
                <button type="button" className="text-sm cursor-pointer" onClick={togglePasswordVisibility}>Show password</button>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {(form.formState.isSubmitting || form.formState.isSubmitted) && form.formState.isSubmitSuccessful ?
            <Loader2 className="animate-spin" /> : "Continue"
          }
        </Button>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="login" className="underline underline-offset-4">
            Login
          </Link>
        </div>
      </form>
    </Form>
  );
}