import { useContext, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import Swal from "sweetalert2";
import { getUserRole } from "@/utils/getUserRole";
const ProfileBadge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const userRole = getUserRole();

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Toggles the isOpen state variable, which is used to conditionally render the profile dropdown menu.
   */
  /******  57f0869b-a59f-410d-8c70-b3825842490f  *******/
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log me out",
      cancelButtonText: "No, keep me logged in",
      reverseButtons: true,
      customClass: {
        confirmButton:
          "bg-green-600 text-white hover:bg-green-700 focus:ring-1 focus:ring-green-300",
        cancelButton:
          "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-1 focus:ring-gray-300",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        logOut();
        navigate("/login");
      }
    });
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center relative group p-2 rounded-full bg-[#f0f0f0] hover:bg-gray-200 transition-all duration-300"
      >
        <FaUser className="h-6 w-6 group-hover:text-green-500 transition-all duration-300 shadow-inner" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <Link
            to={
              userRole === "seller"
                ? "/dashboard-seller"
                : userRole === "buyer"
                ? "/dashboard-buyer"
                : "/unauthorized"
            }
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Dashboard
          </Link>
          <button
            onClick={handleLogOut} // Trigger SweetAlert2
            className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileBadge;
