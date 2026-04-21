import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div className="px-6 md:px-10 py-8 md:py-10 max-w-[1400px] mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
