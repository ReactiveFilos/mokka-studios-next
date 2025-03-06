import { useAuth } from "@/context/auth";

export default function SafeInitialViewLayout({ children }: { children: React.ReactNode }) {
  const { isInitialViewReady } = useAuth();

  if (isInitialViewReady === false) return <></>;
  return <>{children}</>;
}

export function SafeProfileLayout({ children }: { children: React.ReactNode }) {
  const { profile, isEmptyProfile, loadingProfile } = useAuth();

  if (profile && isEmptyProfile === false && loadingProfile === false) return <>{children}</>;
  return <></>;
}