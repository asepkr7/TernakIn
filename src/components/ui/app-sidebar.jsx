import { useState } from "react";
import { MdPerson, MdSpaceDashboard } from "react-icons/md";
import {
  MdProductionQuantityLimits,
  MdAssignment,
  MdHistory,
} from "react-icons/md";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { getUserRole } from "@/utils/getUserRole";
import logo from "../../assets/logo_full.png";

const AppSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Track collapse state
  const userRole = getUserRole();

  return (
    <div className="flex-wrap">
      <Sidebar
        collapsible="icon"
        onCollapseChange={setIsCollapsed} // Update state on collapse change
      >
        {/* Sidebar Header */}
        <SidebarHeader className="flex flex-col items-center font-bold">
          <Link to={"/home"}>
            <img
              src={logo}
              alt="logo"
              className="w-24 shadow-slate-400 rounded-md"
            />
          </Link>

          {/* Conditional text visibility */}
          {/* <span
            className={`mt-2 text-sm transition-opacity duration-300 ${
              isCollapsed ? "bg-opacity-0" : "opacity-100"
            }`}
          >
            Ternakin
          </span> */}
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              {userRole === "seller" && (
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to={"/dashboard-seller"}>
                        <MdSpaceDashboard />
                        Dashboard
                      </Link>
                    </SidebarMenuButton>

                    <SidebarMenuButton asChild>
                      <Link to="/dashboard-seller/product">
                        <MdProductionQuantityLimits />
                        Product
                      </Link>
                    </SidebarMenuButton>

                    <SidebarMenuButton asChild>
                      <Link to="/dashboard-seller/report">
                        <MdAssignment />
                        Report
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              )}
              {userRole === "buyer" && (
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to={"/dashboard-buyer"}>
                        <MdSpaceDashboard />
                        Dashboard
                      </Link>
                    </SidebarMenuButton>

                    <SidebarMenuButton asChild>
                      <Link to="/dashboard-buyer/history">
                        <MdHistory />
                        Shopping History
                      </Link>
                    </SidebarMenuButton>

                    <SidebarMenuButton asChild>
                      <Link to="/dashboard-buyer/profile">
                        <MdPerson />
                        Profile
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  );
};

export default AppSidebar;
