import React, { useState, useEffect } from "react";
import AdminDrawer from "../../components/admin/AdminDrawer";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Add, Cancel } from "@mui/icons-material";
import { Modal, Tooltip } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../../redux/slices/categorySlice";
import { useSnackbar } from "notistack";
import Router from "next/router";
import axios from "axios";
import Loading from "../../components/Loading";
import OwnerCategoryList from "../../components/owner/OwnerCategoryList";

const categories = () => {
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const { enqueueSnackbar } = useSnackbar();

  const {
    user: { user },
    category: { data }, // Ensure categories is an array
  } = useSelector((state) => state);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = JSON.parse(window.localStorage.getItem("token"));

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/category/new`,
        {
          name,

          userId: user._id,
        },
        { headers: { Authorization: token } }
      );

      setLoading(false);
      setName("");

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
          <div className="hidden lg:flex justify-center max-w-6xl mx-auto min-h-[83vh] p-3 ">
            <AdminSidebar />
            <div className="flex-grow min-w-fit ml-5">
              <h1 className="text-lg text-center font-semibold text-green-400 mb-5">
                Category ITEMS
              </h1>
              <div className="grid grid-cols-3 items-center gap-2">
                {data.map((item) => (
                  <OwnerCategoryList key={item.name} />
                ))}
              </div>
            </div>
          </div>
          <div className="min-h-[83vh] p-3 lg:hidden"></div>
          <Tooltip title="Add new Category">
            <div
              className="fixed h-14 w-14 cursor-pointer hover:scale-110 transition duration-300 ease-in bottom-32 right-4 md:right-28 rounded-full bg-green-600 flex justify-center items-center"
              onClick={() => setOpenModal(true)}
            >
              <Add className="text-white font-bold text-3xl" />
            </div>
          </Tooltip>
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <div className="h-full w-full md:h-[400px] md:w-[350px] border-none rounded-lg outline-none bg-gray-800 shadow-lg absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 p-5">
              <div className="flex flex-col items-center relative justify-center h-full">
                <div className="absolute top-2 right-2 flex justify-center items-center bg-gray-600 h-10 w-10 rounded-full cursor-pointer">
                  <Cancel
                    className="text-white text-2xl"
                    onClick={() => setOpenModal(false)}
                  />
                </div>
                <h2 className="text-2xl font-bold text-green-400 mb-5">
                  Add New Category
                </h2>
                <form className="w-full" onSubmit={handleSubmit}>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border-2 border-green-400 mt-3 bg-gray-700 text-white rounded-lg outline-none placeholder:text-sm"
                    type="text"
                    placeholder="Category"
                  />
                  {errorMessage && (
                    <p className="text-red-500 mt-2">{errorMessage}</p>
                  )}
                  <input
                    type="submit"
                    value="Add New Category"
                    className="bg-green-500 text-white font-bold p-3 rounded-lg w-full cursor-pointer mt-3 hover:bg-green-600 transition duration-300 ease-in-out"
                  />
                </form>
              </div>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};

export default categories;
