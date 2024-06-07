import { Cancel, Delete, Edit, Image } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";
import { Modal } from "@mui/material";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { fetchCategories } from "../../redux/slices/categorySlice";
import { useSelector, useDispatch } from "react-redux";
const OwnerFoodList = ({ item }) => {
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([0]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [ingredients, setIngredients] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [matchedRestaurants, setMatchedRestaurants] = useState([]);
  const [restaurantId, setRestaurantId] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const {
    user: { user },
    food: { data },
  } = useSelector((state) => state);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const userId = user?._id;

  const convertListFood = JSON.parse(JSON.stringify(data, null, 2));
  console.log("Food list1:", convertListFood);

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

  const categorylist = useSelector((state) => state.category.data);
  const convertList = JSON.stringify(categorylist, null, 2);
  console.log("Category list:", convertList);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/restaurants`
        );
        const restaurants = response.data.restaurants;
        const matched = restaurants.filter(
          (restaurant) => restaurant.userId === user._id
        );
        setMatchedRestaurants(matched);
        console.log("mảng" + matchedRestaurants);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhà hàng:", error);
      }
    };

    fetchRestaurants();
  }, []);

  const handleDelete = async () => {
    const token = JSON.parse(window.localStorage.getItem("token"));
    await axios
      .delete(`${process.env.NEXT_PUBLIC_BASE_URL}/food/${item._id}`, {
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

      let imageUrl = item.image; // Sử dụng hình ảnh cũ mặc định
      if (selectedImage) {
        // Nếu người dùng đã chọn hình ảnh mới
        const image = await uploadImage(selectedImage);
        imageUrl = image; // Sử dụng hình ảnh mới cho quá trình cập nhật
      }

      // const image = await uploadImage(selectedImage);

      const restaurantId = matchedRestaurants
        .map((restaurant) => restaurant._id)
        .join(",");

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/food/${item._id}`,
        {
          name,
          categories: selectedCategories,
          price,
          description,
          image: imageUrl,
          ingredients,
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
  // useEffect(() => {
  //   if (user === null) {
  //     Router.push("/");
  //   }
  // }, [user]);

  if (
    matchedRestaurants.find(
      (restaurant) => restaurant._id === item.restaurantId
    )
  ) {
    return (
      <>
        <div className=" p-3 bg-gray-600 w-full rounded-xl mb-10 relative h-[400px]">
          <Card className="w-full mx-auto mb-5 h-[90%]">
            <CardMedia
              className="overflow-hidden h-[140px]"
              component="img"
              alt={item.name}
              image={item.image}
            />
            <CardContent className="bg-gray-800 text-white h-full">
              <Typography gutterBottom variant="h5" component="div">
                {item.name}
              </Typography>
              <Box className=" text-white">
                <Typography variant="body2" color="">
                  Price: ${item.price}
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

          <div className="absolute right-5 bottom-3">
            <Edit
              onClick={() => {
                setOpenModal(true);
                // Populate input fields with existing data
                setName(item.name || "");
                setPrice(item.price || "");
                setDescription(item.description || "");
                setIngredients(item.ingredients || "");
                setSelectedCategories(item.categories || []);
                setRestaurantId(item.restaurantId || "");
                setSelectedImage(null);
              }}
              className="text-green-400 cursor-pointer"
            />
            <Delete
              onClick={handleDelete}
              className="text-green-400 ml-3 cursor-pointer"
            />
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
              <div className="h-full w-full md:h-auto md:w-[500px] border-none rounded-lg outline-none bg-gray-800 shadow-lg absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 p-5">
                <div className="flex flex-col items-center relative justify-center">
                  <h2 className="text-2xl font-bold text-green-400 mb-5">
                    Update Food Item
                  </h2>
                  <form
                    className="w-full"
                    onSubmit={(e) => handleUpdate(e, item._id)}
                  >
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 border-2 border-green-400 mt-3 bg-gray-700 text-white rounded-lg outline-none placeholder:text-sm"
                      type="text"
                      placeholder="Food name"
                    />
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
                              checked={selectedCategories.includes(
                                category._id
                              )}
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
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full p-3 border-2 border-green-400 mt-3 bg-gray-700 text-white rounded-lg outline-none placeholder:text-sm"
                      type="text"
                      placeholder="Price"
                    />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-3 border-2 border-green-400 mt-3 bg-gray-700 text-white rounded-lg outline-none placeholder:text-sm"
                      type="text"
                      placeholder="Description"
                    />
                    <textarea
                      value={ingredients}
                      onChange={(e) => setIngredients(e.target.value)}
                      className="w-full p-3 border-2 border-green-400 mt-3 bg-gray-700 text-white rounded-lg outline-none placeholder:text-sm"
                      type="text"
                      placeholder="Description"
                    />
                    <div className="flex flex-col items-center justify-between mt-3 w-full">
                      <label
                        htmlFor="image"
                        className="cursor-pointer flex items-center"
                      >
                        <img
                          className="text-green-500 text-3xl"
                          src={item.image} // Đặt đường dẫn hình ảnh vào thuộc tính src
                          alt={item.name} // Đặt mô tả hình ảnh vào thuộc tính alt
                          // Thêm class w-8 h-8 để đặt kích thước là 30px
                        />
                        <span className="ml-2 text-white">
                          {selectedImage ? selectedImage.name : "Select image"}
                        </span>
                      </label>
                      <input
                        type="file"
                        onChange={(e) => {
                          setSelectedImage(e.target.files[0]);
                        }}
                        className="opacity-0 w-full"
                        id="image"
                      />
                    </div>

                    <input
                      type="submit"
                      value={"Update"}
                      className="bg-green-500 text-white font-bold p-3 rounded-lg w-full cursor-pointer mt-3 hover:bg-green-600 transition duration-300 ease-in-out"
                    />
                  </form>
                  <div className="absolute top-2 right-2 flex justify-center items-center bg-gray-600 h-10 w-10 rounded-full cursor-pointer">
                    <Cancel
                      className="text-white text-2xl"
                      onClick={() => setOpenModal(false)}
                    />
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </>
    );
  }
};
export default OwnerFoodList;
