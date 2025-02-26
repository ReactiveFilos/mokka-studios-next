import AppDiv from "@/components/app/AppDiv";
import AppText from "@/components/app/AppText";

export default function Login() {
  return (
    <AppDiv width100 flexLayout="flexColumnStartLeft" gap="1.75rem">
      <AppText size="headingMid" weight="bold">Login</AppText>
    </AppDiv>
  );
}