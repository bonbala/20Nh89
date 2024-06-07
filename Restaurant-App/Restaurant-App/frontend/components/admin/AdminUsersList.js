import React, { useState } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";
import { MenuItem, Select } from "@mui/material";
import { Delete } from "@mui/icons-material";

const AdminUsersList = ({ item }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [selectedRole, setSelectedRole] = useState(item.role);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleDelete = async () => {
    const token = JSON.parse(window.localStorage.getItem("token"));
    await axios
      .delete(`${process.env.NEXT_PUBLIC_BASE_URL}/user/${item._id}`, {
        headers: { Authorization: token },
      })
      .then((data) => {
        enqueueSnackbar(data.data.message, {
          variant: "success",
          autoHideDuration: 3000,
        });
      })
      .catch((err) => {
        enqueueSnackbar(err.response.data.message, {
          variant: "error",
          autoHideDuration: 3000,
        });
      });
  };

  return (
    <>
      <div className="flex flex-col bg-gray-600 rounded-xl p-6 mb-3 md:w-[20rem] lg:w-[25rem]">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-green-100 font-semibold">Name:</h1>
          <span className="text-green-100">{item.name}</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-green-100 font-semibold">Email:</h1>
          <span className="text-green-100">{item.email}</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-green-100 font-semibold">Phone:</h1>
          <span className="text-green-100">{item.phone}</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-green-100 font-semibold">Role:</h1>
          <Select
            value={selectedRole}
            onChange={handleRoleChange}
            className="text-green-100"
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="owner">Owner</MenuItem>
          </Select>
        </div>
        <div className="flex justify-end">
          <Delete
            onClick={handleDelete}
            className="text-green-400 cursor-pointer"
          />
        </div>
      </div>
    </>
  );
};

export default AdminUsersList;
