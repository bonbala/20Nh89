import React, { useState, useEffect } from "react";
import AdminDrawer from "../../components/admin/AdminDrawer";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Add, Cancel, Image } from "@mui/icons-material";
import { Modal, Tooltip } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { fetchFoods } from "../../redux/slices/foodSlice";
import { useSnackbar } from "notistack";
import Router from "next/router";
import axios from "axios";
import Loading from "../../components/Loading";
import OwnerFoodList from "../../components/owner/OwnerFoodList";
// import { fetchRestaurants } from "../../redux/slices/restaurantSlice";

const foods = () => {
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const {
    user: { user },
    food: { data },
  } = useSelector((state) => state);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFoods());
  }, [data]);

  const convertListFood = JSON.stringify(data, null, 2);
  console.log("Food list:", convertListFood);

  const userId = user?._id; // Sử dụng optional chaining để tránh lỗi nếu user không tồn tại

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/categories`
        );
        const categoriesArray = response.data.categories;
        setCategories(categoriesArray);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        // Xử lý lỗi, như hiển thị một thông báo lỗi cho người dùng
      }
    };

    fetchCategories();
  }, []);

  const [matchedRestaurants, setMatchedRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/restaurants`
        );
        const restaurants = response.data.restaurants;
        const matched = restaurants.filter(
          (restaurant) => restaurant.userId === userId
        );
        setMatchedRestaurants(matched);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhà hàng:", error);
      }
    };

    fetchRestaurants();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedImage) {
      enqueueSnackbar("Please select an image", {
        variant: "error",
        autoHideDuration: 3000,
      });
      setLoading(false);
      return;
    }
    try {
      const token = JSON.parse(window.localStorage.getItem("token"));
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET);
      formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME);

      const res = await fetch(process.env.NEXT_PUBLIC_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const res2 = await res.json();

      if (!res2.secure_url) {
        throw new Error("No secure URL returned");
      }

      const restaurantId = matchedRestaurants
        .map((restaurant) => restaurant._id)
        .join(",");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/food/new`,
        {
          name,
          categories: selectedCategories,
          price,
          description,
          image: res2.secure_url,
          ingredients,
          restaurantId: restaurantId,
        },
        { headers: { Authorization: token } }
      );

      setLoading(false);
      setName("");
      setSelectedCategories([]);
      setPrice("");
      setDescription("");
      setSelectedImage("");
      setIngredients("");
      setOpenModal(false);

      enqueueSnackbar(response.data.message, {
        variant: "success",
        autoHideDuration: 3000,
      });
    } catch (err) {
      setLoading(false);
      console.error("Error Response:", err.response?.data || err.message);
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
          <div className="hidden lg:flex justify-center max-w-6xl mx-auto min-h-[83vh] p-3">
            <AdminSidebar />
            <div className="flex-grow min-w-fit ml-5">
              <h1 className="text-lg font-semibold text-green-400 mb-5 text-center">
                FOOD ITEMS
              </h1>
              <div className="grid grid-cols-4 gap-2">
                {data.map((item) => {
                  return <OwnerFoodList key={item._id} item={item} />;
                })}
              </div>
            </div>
          </div>
          <div className="min-h-[83vh] p-3 lg:hidden"></div>
          <Tooltip title="Add new food">
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
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="p-3 border-2 border-green-400 mt-3 bg-transparent rounded-lg outline-none font-semibold placeholder:text-sm"
                    type="text"
                    placeholder="Price"
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="p-3 border-2 border-green-400 mt-3 bg-transparent rounded-lg outline-none font-semibold placeholder:text-sm w-full"
                    placeholder="Description"
                  />
                  <textarea
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    className="p-3 border-2 border-green-400 mt-3 bg-transparent rounded-lg outline-none font-semibold placeholder:text-sm w-full"
                    placeholder="Ingredients"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <label htmlFor="image">
                      <Image className="text-green-500 text-3xl cursor-pointer" />
                      <h1 className="text-white text-sm font-semibold mt-2 mb-3">
                        {selectedImage
                          ? selectedImage.name
                          : "Chưa chọn hình ảnh"}
                      </h1>
                    </label>
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files.length > 0) {
                          setSelectedImage(e.target.files[0]);
                        }
                      }}
                      className="opacity-0 w-48"
                      id="image"
                    />
                  </div>
                  <input
                    type="submit"
                    value="Add New Food"
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

export default foods;
