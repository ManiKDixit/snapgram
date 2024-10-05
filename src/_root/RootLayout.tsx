import Bottombar from "@/components/shared/Bottombar"
import LeftSidebar from "@/components/shared/LeftSidebar"
import TopBar from "@/components/shared/TopBar"
import { Outlet, useLocation } from "react-router-dom"

const RootLayout = () => {
  const location = useLocation();
  console.log("Current Path:", location.pathname);
  return (
    <div className="w-full md:flex">
     <TopBar />
     <LeftSidebar />

     <section className="flex flex-1 h-full">
      <Outlet />
     </section>

     <Bottombar />
    </div>
  )
}

export default RootLayout
