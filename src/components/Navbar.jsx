import React, { useState } from "react";
import { Link } from "react-router-dom";
import WishlistBadge from "./navbar/WishlistBadge";
import CartBadge from "./navbar/CartBadge";
import ProfileBadge from "./navbar/ProfileBadge";
import { getUserRole } from "@/utils/getUserRole";
import logo from "../assets/logo_full.png";
const Navbar = () => {
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const userRole = getUserRole();
  return (
    <header className="border-b-1 z-20 w-full border-b border-slate-200 bg-white shadow-lg shadow-slate-700/5 after:absolute after:left-0 after:top-full after:z-10 after:block after:h-px after:w-full after:bg-slate-200 lg:border-slate-200 lg:backdrop-blur-sm lg:after:hidden sticky top-0">
      <div className="relative max-w-screen px-10">
        <nav
          aria-label="main navigation"
          className="flex h-16 items-stretch justify-between font-medium text-slate-700"
          role="navigation"
        >
          <Link to="/home" className="flex items-center">
            <img src={logo} alt="logo TernakIn" className="w-24 h-auto" />
          </Link>

          {/* Mobile trigger */}
          <button
            className={`relative order-10 block h-10 w-10 self-center lg:hidden
              ${
                isToggleOpen
                  ? "visible opacity-100 [&_span:nth-child(1)]:w-6 [&_span:nth-child(1)]:translate-y-0 [&_span:nth-child(1)]:rotate-45 [&_span:nth-child(2)]:-rotate-45 [&_span:nth-child(3)]:w-0 "
                  : ""
              }
            `}
            onClick={() => setIsToggleOpen(!isToggleOpen)}
            aria-expanded={isToggleOpen ? "true" : "false"}
            aria-label="Toggle navigation"
          >
            <div className="absolute left-1/2 top-1/2 w-6 -translate-x-1/2 -translate-y-1/2 transform">
              <span
                aria-hidden="true"
                className="absolute block h-0.5 w-9/12 -translate-y-2 transform rounded-full bg-slate-900 transition-all duration-300"
              ></span>
              <span
                aria-hidden="true"
                className="absolute block h-0.5 w-6 transform rounded-full bg-slate-900 transition duration-300"
              ></span>
              <span
                aria-hidden="true"
                className="absolute block h-0.5 w-1/2 origin-top-left translate-y-2 transform rounded-full bg-slate-900 transition-all duration-300"
              ></span>
            </div>
          </button>

          {/* Navigation links */}
          <ul
            role="menubar"
            aria-label="Select page"
            className={`absolute -left-9 top-0 z-[-1] h-fit w-full justify-center overflow-hidden  overflow-y-auto overscroll-contain bg-white/95 px-8 pb-12 pt-24 font-medium transition-[opacity,visibility] duration-300 lg:visible lg:relative lg:top-0 lg:z-0 lg:flex lg:h-full lg:w-auto lg:items-stretch lg:overflow-visible lg:bg-white/0 lg:px-0 lg:py-0 lg:pt-0 lg:opacity-100 ${
              isToggleOpen ? "visible opacity-100 " : "invisible opacity-0"
            }`}
          >
            <div className="flex flex-col lg:flex-row w-96 justify-end">
              <div className="flex flex-items-e gap-2">
                {/* {userRole == "buyer" && <WishlistBadge />} */}
                {userRole == "buyer" && <CartBadge />}

                {/* Profile Dropdown on Hover */}
                <div className="relative mt-3 group">
                  <ProfileBadge />
                  <div className="absolute hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-2 right-0 w-48"></div>
                </div>
              </div>
            </div>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
