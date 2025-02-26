import SideBarRootLayout from "@/layout/SideBarRootLayout";

import AppDiv from "@/components/app/AppDiv";

export default function Home() {
  return (
    <AppDiv width100 flexLayout="flexColumnStartLeft" gap="1.75rem" />
  );
}

Home.getLayout = (page: React.ReactNode) => (
  <SideBarRootLayout>{page}</SideBarRootLayout>
);