import { useState } from "react";
import { useForm } from "react-hook-form";

import SideBarRootLayout from "@/layout/SideBarRootLayout";

import { useAuth } from "@/context/auth";
import { useNextToast } from "@/context/toast";

import AppDiv from "@/components/app/AppDiv";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const profileFormSchema = z.object({
  firstName: z.string()
    .min(2, { message: "First name must be at least 2 characters." })
    .max(30, { message: "First name must be less than 30 characters." }),
  lastName: z.string()
    .min(2, { message: "Last name must be at least 2 characters." })
    .max(30, { message: "Last name must be less than 30 characters." }),
  username: z.string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(25, { message: "Username must be less than 25 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username must contain only letters, numbers, underscores.",
    }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function Account() {
  const { successToast, errorToast } = useNextToast();
  const { profile, setProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      username: profile?.username || "",
      email: profile?.email || "",
    },
    mode: "onChange"
  });

  const initials = profile.firstName.slice(0, 1).toUpperCase() + profile.lastName.slice(0, 1).toUpperCase();

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSubmitting(true);
    // DEMO PURPOSES ONLY
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Update the profile in context
      setProfile({
        ...profile,
        ...values
      });
      successToast({ id: "UpdateAccount", message: "Account updated successfully" });
    } catch (error) {
      errorToast({ id: "UpdateAccount", message: "Failed to update account" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is dirty (user made changes)
  const isDirty = form.formState.isDirty;

  return (
    <AppDiv width100 flexLayout="flexColumnStartLeft" gap="1.75rem">
      <div className="flex flex-col items-center space-y-2 mt-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile.avatar} alt={initials} />
          <AvatarFallback className="text-lg bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h3 className="font-medium text-lg">{profile.firstName} {profile.lastName}</h3>
          <p className="text-sm text-muted-foreground">{profile.username}</p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
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
                    <Input placeholder="johndoe" {...field} />
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
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            className="w-full"
            type="submit"
            size="lg"
            disabled={isSubmitting || !isDirty}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : "Update Account"}
          </Button>
        </form>
      </Form>
    </AppDiv>
  );
}

Account.getLayout = (page: React.ReactNode) => (
  <SideBarRootLayout>{page}</SideBarRootLayout>
);

