import { useAuth } from "@/context/auth";

export default function SafeProfileLayout({ children }: { children: React.ReactNode }) {
  const { loadingProfile } = useAuth();

  if (loadingProfile) return <></>;
  return <>{children}</>;
}