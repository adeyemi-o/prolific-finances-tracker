
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full">
        <main className="flex-1 p-3 md:p-6 lg:p-8 overflow-y-auto">
          <div className="container mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
