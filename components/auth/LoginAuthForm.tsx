import Link from "next/link";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { useAuth } from "@/context/auth";
import { useUserAuth } from "@/context/hooks/fetch/useUserAuth";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootError } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required.",
  }),
  // Construction rules only in signup
  password: z.string().min(1, {
    message: "Password is required.",
  })
});

type FormSchema = z.infer<typeof formSchema>;

export default function LoginAuthForm() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { signInWithUsernamePassword } = useUserAuth();
  const { setProfile, setIsEmptyProfile } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(values: FormSchema) {
    setIsLoading(true);
    try {
      const { username, password } = values;
      const { data, error } = await signInWithUsernamePassword({ username, password });
      if (data) {
        setProfile(data);
        setIsEmptyProfile(false);
      } else if (error) {
        form.setError("root", { message: error });
      }
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel>Password</FormLabel>
                <Link href="reset" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                  Forgot your password?
                </Link>
              </div>
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
        <FormRootError />
        <Button type="submit" className="w-full">
          {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
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