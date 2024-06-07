import { Cancel, Delete, Edit, Image } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Modal,
  Box,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../../redux/slices/categorySlice";

const AdminRestaurantList = ({ item }) => {
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([0]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [selectedImage2, setSelectedImage2] = useState(null);
  const [selectedImage3, setSelectedImage3] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const user = useSelector((state) => state.user.user);
  const userId = user?._id;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  // Fetch categories
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/categories`
        );
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        // Xử lý lỗi, như hiển thị một thông báo lỗi cho người dùng
      }
    };

    fetchCategoriesData();
  }, []);

  const handleDelete = async () => {
    const token = JSON.parse(window.localStorage.getItem("token"));
    await axios
      .delete(`${process.env.NEXT_PUBLIC_BASE_URL}/restaurant/${item._id}`, {
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
  const handleUpdate = async (e) => {
    e.preventDefault();
    // setLoading(true);

    if (!selectedImage1 || !selectedImage2 || !selectedImage3) {
      enqueueSnackbar("Please select all three images", {
        variant: "error",
        autoHideDuration: 3000,
      });
      // setLoading(false);
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

      const logo = await uploadImage(selectedImage1);
      const poster = await uploadImage(selectedImage2);
      const cover = await uploadImage(selectedImage3);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/restaurant/${item._id}`,
        {
          name,
          categories: selectedCategories,
          location,
          email,
          phone,
          description,
          images: {
            logo,
            poster,
            cover,
          },
        },
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
    }
  };

  return (
    <div className=" p-3 bg-gray-600 w-full rounded-xl mb-10 relative h-[550px]">
      <Card className="w-full mx-auto mb-5 h-[90%]">
        <CardMedia
          className="overflow-hidden h-[140px]"
          component="img"
          alt={item.name}
          image={item.images.logo}
        />
        <CardContent className="bg-gray-800 text-white h-full">
          <Typography gutterBottom variant="h5" component="div">
            {item.name}
          </Typography>
          <Box className=" text-white">
            <Typography variant="body2" color="">
              Location: {item.location}
            </Typography>
            <Typography variant="body2" color="">
              Email: {item.email}
            </Typography>
            <Typography variant="body2" color="">
              phone: {item.phone}
            </Typography>
            <Typography className="text-white">
              <div className="grid grid-cols-2 gap-2">
                {item.categories &&
                  item.categories.map((categoryId) => {
                    // Tìm category tương ứng với categoryId
                    const category = categories.find(
                      (cat) => cat._id === categoryId
                    );
                    if (category) {
                      return (
                        <div
                          key={category._id}
                          className="bg-gray-100 p-2 rounded-md"
                        >
                          <span style={{ color: "black" }}>
                            {category.name}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })}
              </div>
            </Typography>
          </Box>
          <Typography className="text-white">{item.description}</Typography>
        </CardContent>
      </Card>
      <Edit
        // onClick={() => setOpenModal(true)}
        onClick={() => {
          setOpenModal(true);
          // Populate input fields with existing data
          setName(item.name || "");
          setLocation(item.location || "");
          setEmail(item.email || "");
          setPhone(item.phone || "");
          setDescription(item.description || "");
          setSelectedImage1(item.selectedImage1 || "");
          setSelectedImage2(item.selectedImage2 || "");
          setSelectedImage3(item.selectedImage3 || "");
          setSelectedCategories(item.categories || []);
        }}
        className="text-green-400 cursor-pointer"
      />
      <Delete
        onClick={handleDelete}
        className="text-green-400 ml-3 cursor-pointer"
      />
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div className="h-full w-full md:h-[600px] md:w-[450px] border-none rounded-lg outline-none bg-gray-700 absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center relative justify-center h-full">
            <form
              className="flex flex-col items-center justify-center"
              onSubmit={handleUpdate}
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
                        <span className="mr-2">{selectedCategory?.name}</span>
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
                  {categories &&
                    categories.map((category) => (
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
                placeholder="Location"
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
                placeholder="Phone"
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
                  <img
                    src={item.images.logo} // Đặt đường dẫn hình ảnh vào thuộc tính src
                    alt={item.name} // Đặt mô tả hình ảnh vào thuộc tính alt
                    className="text-green-500 text-3xl cursor-pointer w-8 h-8" // Thêm class w-8 h-8 để đặt kích thước là 30px
                  />
                  <span className="text-white text-sm font-semibold mt-2 mb-3">
                    {selectedImage1 ? selectedImage1.name : "Select image"}
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
                  <img
                    src={item.images.poster} // Đặt đường dẫn hình ảnh vào thuộc tính src
                    alt={item.name} // Đặt mô tả hình ảnh vào thuộc tính alt
                    className="text-green-500 text-3xl cursor-pointer w-8 h-8" // Thêm class w-8 h-8 để đặt kích thước là 30px
                  />
                  <span className="text-white text-sm font-semibold mt-2 mb-3">
                    {selectedImage2 ? selectedImage2.name : "Select image"}
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
                  <img
                    src={item.images.cover} // Đặt đường dẫn hình ảnh vào thuộc tính src
                    alt={item.name} // Đặt mô tả hình ảnh vào thuộc tính alt
                    className="text-green-500 text-3xl cursor-pointer w-8 h-8" // Thêm class w-8 h-8 để đặt kích thước là 30px
                  />
                  <span className="text-white text-sm font-semibold mt-2 mb-3">
                    {selectedImage3 ? selectedImage3.name : "Select image"}
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
                value={"Update"}
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
    </div>
  );
};
export default AdminRestaurantList;
