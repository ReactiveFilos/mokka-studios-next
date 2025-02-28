import Link from "next/link";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { useAuth } from "@/context/auth";
import { useCache } from "@/context/caching";
import { useUserAuth } from "@/context/hooks/fetch/useUserAuth";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRootError } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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

  const { setStoredUserProfile } = useCache();
  const { signInWithEmailPassword } = useUserAuth();
  const { setProfile, setIsEmptyProfile } = useAuth();

  async function onSubmit(values: FormSchema) {
    const { email, password } = values;
    const { data, error } = await signInWithEmailPassword({ email, password });
    if (data) {
      setStoredUserProfile(data);
      setProfile(data);
      setIsEmptyProfile(false);
    } else if (error) {
      form.setError("root", { message: error });
    }
  }

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

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
          {(form.formState.isSubmitting || form.formState.isSubmitted) && form.formState.isSubmitSuccessful ?
            <Loader2 className="animate-spin" /> : "Login"
          }
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