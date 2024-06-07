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
import OwnerRestaurantList from "../../components/owner/OwnerRestaurantList";

const restaurants = () => {
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [selectedImage2, setSelectedImage2] = useState(null);
  const [selectedImage3, setSelectedImage3] = useState(null);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const {
    user: { user },
    restaurant: { data },
  } = useSelector((state) => state);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const userId = user?._id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedImage1 || !selectedImage2 || !selectedImage3) {
      enqueueSnackbar("Please select all three images", {
        variant: "error",
        autoHideDuration: 3000,
      });
      setLoading(false);
      return;
    }

    try {
      const token = JSON.parse(window.localStorage.getItem("token"));
      const uploadImage = async (image) => {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET);
        formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME);

        const res = await fetch(process.env.NEXT_PUBLIC_URL, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await res.json();
        return data.secure_url;
      };

      // const res2 = await res.json();
      const logo = await uploadImage(selectedImage1);
      const poster = await uploadImage(selectedImage2);
      const cover = await uploadImage(selectedImage3);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/restaurant/new`,
        {
          name,
          categories: selectedCategories,
          location,
          email,
          phone,
          description,
          images: {
            logo,
            poster, // Assuming all three images have the same URL for simplicity
            cover,
          },
          userId: user._id,
        },
        { headers: { Authorization: token } }
      );

      setLoading(false);
      setName("");
      setSelectedCategories([]);
      setLocation("");
      setEmail("");
      setPhone("");
      setDescription("");
      setSelectedImage1("");
      setSelectedImage2("");
      setSelectedImage3("");
      setOpenModal(false);

      enqueueSnackbar(response.data.message, {
        variant: "success",
        autoHideDuration: 3000,
      });
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err.response?.data?.message || err.message, {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  useEffect(() => {
    if (user === null) {
      Router.push("/");
    }
  }, [user]);

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
                  <OwnerRestaurantList key={item._id} item={item} />
                ))}
              </div>
            </div>
          </div>

          <Tooltip title="Add new Restaurant">
            <div
              className="fixed h-14 w-14 cursor-pointer hover:scale-110 transition duration-300 ease-in bottom-32 right-4 md:right-28 rounded-full bg-green-600 flex justify-center items-center"
              onClick={() => setOpenModal(true)}
            >
              <Add className="text-white font-bold text-3xl" />
            </div>
          </Tooltip>
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <div className="h-full w-full md:h-[600px] md:w-[450px] border-none rounded-lg outline-none bg-gray-700 absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2">
              <div className="flex flex-col items-center relative justify-center h-full">
                <form
                  className="flex flex-col items-center justify-center"
                  onSubmit={handleSubmit}
                >
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-3 border-2 border-green-400 mt-3 bg-transparent rounded-lg outline-none font-semibold placeholder:text-sm"
                    type="text"
                    placeholder="Restaurant name"
                  />
                  <div className="mt-3">
                    <ul className="grid grid-cols-2 gap-2">
                      {selectedCategories.map((categoryId) => {
                        const selectedCategory = categories.find(
                          (category) => category._id === categoryId
                        );
                        return (
                          <li
                            key={categoryId}
                            className="flex items-center bg-gray-100 p-2 rounded-md"
                          >
                            <span className="mr-2">
                              {selectedCategory?.name}
                            </span>
                            <button
                              type="button"
                              className="text-red-500"
                              onClick={() => {
                                setSelectedCategories((prevSelected) =>
                                  prevSelected.filter((id) => id !== categoryId)
                                );
                              }}
                            >
                              Remove
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="mt-3 overflow-y-auto max-h-[150px]">
                    <h2 className="text-lg font-semibold text-green-400 mb-2">
                      Available Categories:
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((category) => (
                        <label
                          key={category._id}
                          className="flex items-center bg-gray-100 p-2 rounded-md"
                        >
                          <input
                            type="checkbox"
                            value={category._id}
                            checked={selectedCategories.includes(category._id)}
                            onChange={(e) => {
                              const categoryId = e.target.value;
                              setSelectedCategories((prevSelected) => {
                                if (prevSelected.includes(categoryId)) {
                                  return prevSelected.filter(
                                    (id) => id !== categoryId
                                  );
                                } else {
                                  return [...prevSelected, categoryId];
                                }
                              });
                            }}
                          />
                          <span className="ml-2" style={{ color: "black" }}>
                            {category.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="p-3 border-2 border-green-400 mt-3 bg-transparent rounded-lg outline-none font-semibold placeholder:text-sm"
                    type="text"
                    placeholder="Address"
                  />
                  <textarea
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-3 border-2 border-green-400 mt-3 bg-transparent rounded-lg outline-none font-semibold placeholder:text-sm w-full"
                    type="text"
                    placeholder="Email"
                  />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="p-3 border-2 border-green-400 mt-3 bg-transparent rounded-lg outline-none font-semibold placeholder:text-sm"
                    type="text"
                    placeholder="Phone Number"
                  />
                  <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="p-3 border-2 border-green-400 mt-3 bg-transparent rounded-lg outline-none font-semibold placeholder:text-sm"
                    type="text"
                    placeholder="Description"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <label htmlFor="logo" className="flex items-center">
                      <Image className="text-green-500 text-3xl cursor-pointer" />
                      <span className="text-white text-sm font-semibold mt-2 mb-3">
                        {selectedImage1 ? selectedImage1.name : "Select Logo"}
                      </span>
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setSelectedImage1(e.target.files[0])}
                      className="opacity-0 w-48"
                      id="logo"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <label htmlFor="poster" className="flex items-center">
                      <Image className="text-green-500 text-3xl cursor-pointer" />
                      <span className="text-white text-sm font-semibold mt-2 mb-3">
                        {selectedImage2 ? selectedImage2.name : "Select Poster"}
                      </span>
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setSelectedImage2(e.target.files[0])}
                      className="opacity-0 w-48"
                      id="poster"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <label htmlFor="cover" className="flex items-center">
                      <Image className="text-green-500 text-3xl cursor-pointer" />
                      <span className="text-white text-sm font-semibold mt-2 mb-3">
                        {selectedImage3 ? selectedImage3.name : "Select Cover"}
                      </span>
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setSelectedImage3(e.target.files[0])}
                      className="opacity-0 w-48"
                      id="cover"
                    />
                  </div>

                  <input
                    type="submit"
                    value={"Add New Restaurant"}
                    className="bg-white text-green-500 font-bold p-3 outline-none rounded-lg w-full cursor-pointer mt-3 hover:bg-green-400 hover:text-white transition duration-300 ease-in"
                  />
                </form>
                <div className="absolute top-2 left-2 flex justify-center items-center bg-gray-700 h-10 w-10 rounded-full cursor-pointer">
                  <Cancel
                    className="text-3xl"
                    onClick={() => setOpenModal(false)}
                  />
                </div>
              </div>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};

export default restaurants;
