import React, { useState } from "react";
import { Fastfood, Group, MoreVert } from "@mui/icons-material";
import { Drawer } from "@mui/material";
import Link from "next/link";
import { useSelector } from "react-redux";

const AdminDrawer = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const user = useSelector((state) => state.user.user);

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-green-100">Dashboard</h1>
        <MoreVert
          onClick={() => setOpenDrawer(!openDrawer)}
          className="text-green-500"
        />
      </div>
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        anchor="right"
      >
        <div className="w-[50vw] bg-gray-900 h-full">
          <div className="flex flex-col items-start justify-center space-y-5 p-2 mt-5">
            {user?.role === "admin" && (
              <>
                <Link href={"/admin/restaurants"}>
                  <div className="flex justify-start items-center cursor-pointer space-x-4" onClick={() => setOpenDrawer(false)}>
                    <Fastfood className="text-green-400" />
                    <h1 className="text-green-100 font-semibold">Restaurants</h1>
                  </div>
                </Link>
                <Link href={"/admin/users"}>
                  <div className="flex justify-start items-center cursor-pointer space-x-4" onClick={() => setOpenDrawer(false)}>
                    <Group className="text-green-400" />
                    <h1 className="text-green-100 font-semibold">Users</h1>
                  </div>
                </Link>
              </>
            )}
            {user?.role === "owner" && (
              <>
                <Link href={"/owner/restaurants"}>
                  <div className="flex justify-start items-center cursor-pointer space-x-4" onClick={() => setOpenDrawer(false)}>
                    <Fastfood className="text-green-400" />
                    <h1 className="text-green-100 font-semibold">Restaurants</h1>
                  </div>
                </Link>
                <Link href={"/owner/food"}>
                  <div className="flex justify-start items-center cursor-pointer space-x-4" onClick={() => setOpenDrawer(false)}>
                    <Fastfood className="text-green-400" />
                    <h1 className="text-green-100 font-semibold">Foods</h1>
                  </div>
                </Link>
                <Link href={"/owner/category"}>
                  <div className="flex justify-start items-center cursor-pointer space-x-4" onClick={() => setOpenDrawer(false)}>
                    <Fastfood className="text-green-400" />
                    <h1 className="text-green-100 font-semibold">Category</h1>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default AdminDrawer;
