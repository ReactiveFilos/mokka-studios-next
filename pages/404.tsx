import { useRouter } from "next/router";

import AppDiv from "@/components/app/AppDiv";
import AppText from "@/components/app/AppText";
import { Button } from "@/components/ui/button";

export default function Custom404() {
  const router = useRouter();
  return (
    <AppDiv height="100vh" flexLayout="flexColumnCenter" gap="1rem" paddingBottom="1.5625rem">
      <AppText size="headingMid" weight="bold">404 - Page Not Found</AppText>
      <AppText size="mid" color="secondary" marginBottom="0.3125rem">{"Wrong spot :("}</AppText>
      <Button
        variant="default"
        onClick={() => router.push("/")}>
        Home
      </Button>
    </AppDiv>
  );
}
