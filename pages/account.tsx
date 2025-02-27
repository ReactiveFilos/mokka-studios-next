import SideBarRootLayout from "@/layout/SideBarRootLayout";

import AppDiv from "@/components/app/AppDiv";

export default function Account() {
  return (
    <AppDiv width100 flexLayout="flexColumnStartLeft" gap="1.75rem" />
  );
}

Account.getLayout = (page: React.ReactNode) => (
  <SideBarRootLayout>{page}</SideBarRootLayout>
);