import { useAuth } from "@/context/auth";

export default function SafeInitialViewLayout({ children }: { children: React.ReactNode }) {
  const { isInitialViewReady } = useAuth();

  if (isInitialViewReady === false) return <></>;
  return <>{children}</>;
}