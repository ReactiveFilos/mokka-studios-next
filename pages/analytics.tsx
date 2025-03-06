import SideBarRootLayout from "@/layout/SideBarRootLayout";

import AppDiv from "@/components/app/AppDiv";

export default function Analytics() {

  return (
    <AppDiv width100 flexLayout="flexColumnStartLeft" gap="1.75rem">
      <></>
    </AppDiv>
  );
}

Analytics.getLayout = (page: React.ReactNode) => (
  <SideBarRootLayout>{page}</SideBarRootLayout>
);

