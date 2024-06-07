import React from "react";
import { Fastfood, Group } from "@mui/icons-material";
import Link from "next/link";
import { useSelector } from "react-redux";

const AdminSidebar = () => {
  const user = useSelector((state) => state.user.user);

  return (
    <>
      <div className="w-52 border-2 border-green-300 h-fit mt-10">
        <div className="flex flex-col items-center justify-center">
          {user?.role === "admin" && (
            <>
              <Link href={"/admin/restaurants"}>
                <div className="flex cursor-pointer hover:bg-white group justify-start items-center space-x-4 border-b-2 border-gray-500 w-full p-3">
                  <Fastfood className="text-green-500 ml-2" />
                  <h1 className="font-semibold group-hover:text-green-600">
                    Restaurant Items
                  </h1>
                </div>
              </Link>
              <Link href={"/admin/users"}>
                <div className="flex cursor-pointer hover:bg-white group justify-start items-center space-x-4 border-b-2 border-gray-500 w-full p-3">
                  <Group className="text-green-500 ml-2" />
                  <h1 className="font-semibold group-hover:text-green-600">
                    Users
                  </h1>
                </div>
              </Link>
            </>
          )}
          {user?.role === "owner" && (
            <>
              <Link href={"/owner/restaurants"}>
                <div className="flex cursor-pointer hover:bg-white group justify-start items-center space-x-4 border-b-2 border-gray-500 w-full p-3">
                  <Fastfood className="text-green-500 ml-2" />
                  <h1 className="font-semibold group-hover:text-green-600">
                    Restaurants
                  </h1>
                </div>
              </Link>
              <Link href={"/owner/foods"}>
                <div className="flex cursor-pointer hover:bg-white group justify-start items-center space-x-4 border-b-2 border-gray-500 w-full p-3">
                  <Fastfood className="text-green-500 ml-2" />
                  <h1 className="font-semibold group-hover:text-green-600">
                    Foods
                  </h1>
                </div>
              </Link>
              <Link href={"/owner/categories"}>
                <div className="flex cursor-pointer hover:bg-white group justify-start items-center space-x-4 border-b-2 border-gray-500 w-full p-3">
                  <Fastfood className="text-green-500 ml-2" />
                  <h1 className="font-semibold group-hover:text-green-600">
                    Category
                  </h1>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
