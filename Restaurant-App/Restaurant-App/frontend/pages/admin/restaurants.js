import React, { useState, useEffect } from "react";
import AdminDrawer from "../../components/admin/AdminDrawer";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Add, Cancel, Image } from "@mui/icons-material";
import { Modal, Tooltip } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { fetchRestaurants } from "../../redux/slices/restaurantSlice";
import { useSnackbar } from "notistack";
import Router from "next/router";
import axios from "axios";
import Loading from "../../components/Loading";
import AdminRestaurantList from "../../components/admin/AdminRestaurantList";
// import AdminRestaurantList from "../../components/admin/AdminFoodList";

const restaurants = ({ item }) => {
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const {
    user: { user },
    restaurant: { data },
  } = useSelector((state) => state);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = JSON.parse(window.localStorage.getItem("token"));
    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append(
      "upload_preset",
      `${process.env.NEXT_PUBLIC_UPLOAD_PRESET}`
    );
    formData.append("cloud_name", `${process.env.NEXT_PUBLIC_CLOUD_NAME}`);
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}`, {
      method: "POST",
      body: formData,
    });

    const res2 = await res.json();

    await axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/restaurant/new`,
        {
          name,
          categories,
          location,
          email,
          phone,
          image: res2.secure_url,
          userId: user._id,
        },
        { headers: { Authorization: token } }
      )
      .then((data) => {
        setLoading(false);
        setName("");
        setCategories("");
        setLocation("");
        setEmail("");
        setPhone("");
        setSelectedImage("");
        setOpenModal(false);
        enqueueSnackbar(data.data.message, {
          variant: "success",
          autoHideDuration: 3000,
        });
      })
      .catch((err) => {
        setLoading(false);
        enqueueSnackbar(err.response.data.message, {
          variant: "error",
          autoHideDuration: 3000,
        });
      });
  };

  useEffect(() => {
    if (user === null) {
      Router.push("/");
    }
  }, [user]);
  console.log(user);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex gap-5 max-w-[1000px] w-full mx-auto">
            <AdminSidebar />
            <div className="w-full">
              <h1 className="text-lg font-semibold text-green-400 mb-5 text-center">
                Restaurant ITEMS
              </h1>
              <div className="grid grid-cols-3 gap-5 w-full justify-between">
                {data.map((item) => (
                  <AdminRestaurantList key={item._id} item={item} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default restaurants;
