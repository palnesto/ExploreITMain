import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TbLogout } from "react-icons/tb";
import { API_BASE_URL } from '../../config';
import useLoginStore from "../../store/useLoginStore";
import axios from "axios";

function Sidebar() {
  const { isLoggedIn, logout } = useLoginStore();
  const [toggleColor, setToggleColor] = useState('');
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/V1/logout`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        logout();
      } else {
        console.error("Logout failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }
  return (
    <div
      className="bg-[#FFF] fixed left-0 bg-cover w-[200px] h-full pt-[4rem]"
      style={{ fontFamily: "Raleway, sans-serif" }}
    >
      <div className="flex flex-row">
        <div>
          <img
            src="/logo.png"
            alt="images"
            className="ml-[24px]  "
          />
        </div>
      </div>
      <ul className="flex flex-col text-[#9F9F9F]">
        <li className="flex flex-row items-center">
          <Link
            to="/"
            onClick={() => setToggleColor("Services")}
            className={`flex items-center w-full h-[48px] mt-10 ${toggleColor === "Services"
              ? "bg-black text-[#9F9F9F] shadow-[0px_4px_11.6px_0px_rgba(0,0,0,0.25)]"
              : ""
              }`}
          >
            <img src="Homelogo1.png" className="w-[20px] h-[16px] ml-[1rem]" />
            <h1
              className="lg:ml-[10px] 2xl:text-lg !text-sm font-medium"
              style={{ lineHeight: "15px" }}
            >
              Services
            </h1>
          </Link>
        </li>
        <li className="flex flex-row items-center">
          <Link
            to="/Career"
            onClick={() => setToggleColor("Career")}
            className={`flex items-center w-full h-[48px] mt-10 ${toggleColor === "Career"
              ? "bg-black text-[#9F9F9F] shadow-[0px_4px_11.6px_0px_rgba(0,0,0,0.25)]"
              : ""
              }`}
          >
            <img src="career.png" className="w-[20px] h-[16px] ml-[1rem]" />
            <h1
              className="lg:ml-[10px] 2xl:text-lg !text-sm font-medium"
              style={{ lineHeight: "15px" }}
            >
              Career
            </h1>
          </Link>
        </li>
        <li className="flex flex-row items-center">
          <Link
            to="/Blogs"
            onClick={() => setToggleColor("Blogs")}
            className={`flex items-center w-full h-[48px] mt-10 ${toggleColor === "Blogs"
              ? "bg-black text-[#9F9F9F] shadow-[0px_4px_11.6px_0px_rgba(0,0,0,0.25)]"
              : ""
              }`}
          >
            <img src="Blog.png" className="w-[20px] h-[16px] ml-[1rem]" />
            <h1
              className="lg:ml-[10px] 2xl:text-lg !text-sm font-medium"
              style={{ lineHeight: "15px" }}
            >
              Blogs
            </h1>
          </Link>
        </li>
      </ul>
      <div className=" flex flex-col text-white 2xl:mt-[10rem] 3xl:mt-[20rem] lg:mt-[10rem] ">
        <div className="border w-full h-0.5" />
        <li className="flex flex-row items-center">
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="flex items-center w-full ml-8 mt-7"
            >
              <TbLogout className='text-black' size={32} />
              <h1 className="lg:ml-[10px] 2xl:text-lg font-bold text-black ">
                Logout
              </h1>
            </button>
          )}
        </li>
      </div>
      <div className="absolute top-0 right-0 h-full w-[2px] bg-gray-300"></div>

    </div>
  );
}

export default Sidebar;
