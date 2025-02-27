import Link from "next/link";

import { useForm } from "react-hook-form";

import { useAuth } from "@/context/auth";
import { useUserAuth } from "@/context/hooks/fetch/useUserAuth";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootError } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  // Construction rules only in signup
  password: z.string().min(1, {
    message: "Password is empty.",
  })
});

type FormSchema = z.infer<typeof formSchema>;

export default function LoginAuthForm() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { setProfile, setIsEmptyProfile } = useAuth();
  const { signInWithEmailPassword } = useUserAuth();

  async function onSubmit(values: FormSchema) {
    const { email, password } = values;
    const { data, error } = await signInWithEmailPassword({ email, password });
    if (data) {
      setProfile(data);
      setIsEmptyProfile(false);
    } else if (error) {
      form.setError("root", { message: error });
    }
  }

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
              <div className="flex items-center">
                <FormLabel>Password</FormLabel>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                  Forgot your password?
                </a>
              </div>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormRootError />
        <Button type="submit" className="w-full">
          Login
        </Button>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
}