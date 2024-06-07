import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { Modal, TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";

const foods = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPassword(user.password || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    try {
      const token = JSON.parse(window.localStorage.getItem("token"));
  
      let requestData = {
        name,
        email,
        phone,
      };
  
      // Kiểm tra xem người dùng có nhập mật khẩu mới không
      if (password !== "") {
        requestData.password = password;
      }
  
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/${user._id}`,
        requestData,
        {
          headers: { Authorization: token },
        }
      );
  
      enqueueSnackbar(response.data.message, {
        variant: "success",
        autoHideDuration: 3000,
      });
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || err.message, {
        variant: "error",
        autoHideDuration: 3000,
      });
    } finally {
      setOpenModal(false);
    }
  };
  
  
  return (
<div className="flex justify-center items-center h-screen">
<div className="bg-white rounded-xl p-6 md:w-[20rem] lg:w-[25rem]">
        <Typography variant="h6" className="text-green-700 font-semibold mb-3">
          User Information
        </Typography>
        <Box mb={2}>
          <Typography className="text-green-700 font-semibold mb-1">Name:</Typography>
          <Typography className="text-green-700">{name}</Typography>
        </Box>
        <Box mb={2}>
          <Typography className="text-green-700 font-semibold mb-1">Email:</Typography>
          <Typography className="text-green-700">{email}</Typography>
        </Box>
        <Box mb={2}>
          <Typography className="text-green-700 font-semibold mb-1">Phone:</Typography>
          <Typography className="text-green-700">{phone}</Typography>
        </Box>
        <Box mb={2}>
          <Typography className="text-green-700 font-semibold mb-1">Password:</Typography>
          <Typography className="text-green-700">{password}</Typography>
        </Box>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setOpenModal(true)}
          className="text-green-700 cursor-pointer"
        >
          Update
        </Button>
      </div>
  
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div className="flex justify-center items-center h-screen">
          <div className="bg-gray-200 rounded-xl p-6 md:w-[20rem] lg:w-[25rem]">
            <Typography variant="h6" className="text-green-700 mb-3">
              Update Information
            </Typography>
            <form className="flex flex-col" onSubmit={handleUpdate}>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                margin="normal"
                className="mb-3"
                fullWidth
              />
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                margin="normal"
                className="mb-3"
                fullWidth
              />
              <TextField
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                variant="outlined"
                margin="normal"
                className="mb-3"
                fullWidth
              />
              <TextField
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                margin="normal"
                className="mb-3"
                type="password"
                fullWidth
              />
              <div className="flex justify-between items-center">
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};
  
export default foods;
