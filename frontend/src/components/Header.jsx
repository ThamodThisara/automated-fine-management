import { Navbar } from "flowbite-react";
import { NavLink } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Badge } from "flowbite-react";
import { Popover } from "flowbite-react";
import { useEffect, useState } from "react";

export function Header() {
  const [notifications, setNotifications] = useState([]);

  // const content = (
  //   <div className="w-96 text-sm text-gray-500 dark:text-gray-400">
  //     <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
  //       <h3 className="font-semibold text-gray-900 dark:text-white">Notification</h3>
  //     </div>
  //     {notificatons && notificatons.length>=1 && notificatons.map((notifi)=>{
  //       <div className="px-3 py-2">
  //         <p>{notifi.type}</p>
  //         <p>{notifi.price}</p>
  //       </div>

  //     })}
  //   </div>
  // );

  useEffect(() => {
    const fetchLatestNotifications = async () => {
      try {
        const response = await fetch("/api/v1/notification/latest");

        if (!response.ok) throw new Error("Failed to fetch notifications");

        const data = await response.json();
        setNotifications(data.data || []); // Ensure it's always an array
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]); // Fallback to empty array
      }
    };

    fetchLatestNotifications();
  }, []);

  // Dynamic Popover content (re-renders when `notifications` changes)
  const content = (
    <div className="w-96 text-sm text-gray-500 dark:text-gray-400">
      <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Notification
        </h3>
      </div>
      {notifications.length >= 1 ? (
        notifications.map((notifi) => (
          <div key={notifi._id} className="px-3 py-2 flex justify-between">
            {" "}
            {/* Add `key`! */}
            <p>{notifi.type}</p>
            <p>{notifi.price}</p>
          </div>
        ))
      ) : (
        <div className="px-3 py-2">No notifications yet.</div>
      )}
    </div>
  );

  return (
    <Navbar
      fluid
      rounded
      className="top-0 z-10 bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg"
    >
      <Navbar.Brand href="https://flowbite-react.com">
        <NavLink to="/">
          <img
            src="https://png.pngtree.com/png-vector/20220226/ourmid/pngtree-policeman-fine-icon-punish-concept-notification-vector-png-image_16152142.jpg"
            className="mr-3 h-8 sm:h-10 transition-transform duration-300 transform hover:scale-110"
            alt="Logo"
          />
        </NavLink>
      </Navbar.Brand>
      <Navbar.Toggle className="text-white hover:text-teal-200 focus:ring-2 focus:ring-teal-300" />
      <Navbar.Collapse>
        {/* Use NavLink instead of Link */}
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `text-lg text-white hover:text-teal-200 transition-colors duration-300 ${
              isActive ? "font-bold underline" : ""
            }`
          }
        >
          Admin
        </NavLink>

        <NavLink
          to="/login-officer"
          className={({ isActive }) =>
            `text-lg text-white hover:text-teal-200 transition-colors duration-300 ${
              isActive ? "font-bold underline" : ""
            }`
          }
        >
          Traffic Officer
        </NavLink>

        <NavLink
          to="/login-driver"
          className={({ isActive }) =>
            `text-lg text-white hover:text-teal-200 transition-colors duration-300 ${
              isActive ? "font-bold underline" : ""
            }`
          }
        >
          Driver
        </NavLink>

        <NavLink
          to="/payment"
          className={({ isActive }) =>
            `text-lg text-white hover:text-teal-200 transition-colors duration-300 ${
              isActive ? "font-bold underline" : ""
            }`
          }
        >
          Payment
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) =>
            `text-lg text-white hover:text-teal-200 transition-colors duration-300 ${
              isActive ? "font-bold underline" : ""
            }`
          }
        >
          Search
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `text-lg text-white hover:text-teal-200 transition-colors duration-300 ${
              isActive ? "font-bold underline" : ""
            }`
          }
        >
          Contact Us
        </NavLink>

        <Popover content={content} placement="bottom">
          <div className="flex cursor-pointer">
            <IoMdNotificationsOutline className="w-6 h-6 text-white" />
            <div className="relative">
              {/* <Badge className="justify-center absolute w-3 h-3 p-1 bg-red-400 text-white animate-ping">5</Badge> */}
              <span class="absolute w-2 h-2 p-1 animate-ping rounded-full bg-red-500 opacity-100"></span>
            </div>
          </div>
        </Popover>
      </Navbar.Collapse>
    </Navbar>
  );
}
