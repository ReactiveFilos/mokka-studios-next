import AppDiv from "@/components/app/AppDiv";
import NavBar from "@/components/nav/NavBar";
import { AppSidebar } from "@/components/sidebar/AppSideBar";
import { SidebarProvider } from "@/components/ui/sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

export default function SideBarRootLayout({ children }: LayoutProps) {
  return (
    <main
      className="flexColumnCenter"
      style={{
        position: "relative",
        minHeight: "100vh",
      }}>
      <SidebarProvider>
        <AppSidebar />
        <div
          className="width100 backgroundColor"
          style={{
            position: "relative",
            minHeight: "100vh",
          }}>
          <AppDiv
            width100
            className="width100 flexRowSpaceBetTop"
            style={{
              backgroundColor: "transparent",
              position: "sticky",
              top: 0,
            }}>
            <NavBar />
          </AppDiv>
          <div
            className="width100"
            style={{
              padding: "1rem 2rem 2rem"
            }}>
            {children}
          </div>
        </div>
      </SidebarProvider>
    </main>
  );
}
