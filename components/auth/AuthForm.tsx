import { useMemo } from "react";

import AppDiv from "@/components/app/AppDiv";
import LoginAuthForm from "@/components/auth/LoginAuthForm";
import ResetAuthForm from "@/components/auth/ResetAuthForm";
import SignUpAuthForm from "@/components/auth/SignUpAuthForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type View = "login" | "signup" | "reset";

const formConfigs = {
  login: {
    title: "Login",
    description: "Enter your details below to login",
    form: <LoginAuthForm />,
  },
  signup: {
    title: "Sign up",
    description: "Enter your details below to create an account",
    form: <SignUpAuthForm />,
  },
  reset: {
    title: "Reset password",
    description: "Enter the email address of your account",
    form: <ResetAuthForm />,
  },
} as const;

export default function AuthForm({ view }: { view: View }) {
  const memoizedForm = useMemo(() => formConfigs[view], [view]);
  return (
    <AppDiv width100 height="100vh" flexLayout="flexColumnCenter">
      <Card className="w-[21.35rem]">
        <CardHeader className="space-y-2.5">
          <CardTitle className="text-2xl">{memoizedForm.title}</CardTitle>
          <CardDescription>
            {memoizedForm.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {memoizedForm.form}
        </CardContent>
      </Card>
    </AppDiv>
  );
}