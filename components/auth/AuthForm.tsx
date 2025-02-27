import { useMemo } from "react";

import AppDiv from "@/components/app/AppDiv";
import LoginAuthForm from "@/components/auth/LoginAuthForm";
import SignUpAuthForm from "@/components/auth/SignUpAuthForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type View = "login" | "signup";

export default function AuthForm({ view }: { view: View }) {
  const memoizedForm = useMemo(() => (view === "login" ? <LoginAuthForm /> : <SignUpAuthForm />), [view]);
  return (
    <AppDiv width100 height="100vh" flexLayout="flexColumnCenter">
      <Card className="w-[21.35rem]">
        <CardHeader className="space-y-2.5">
          <CardTitle className="text-2xl">{view === "login" ? "Login" : "Sign up"}</CardTitle>
          <CardDescription>
            {view === "login"
              ? "Enter your email below to login to your account"
              : "Enter your details below to create an account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {memoizedForm}
        </CardContent>
      </Card>
    </AppDiv>
  );
}
