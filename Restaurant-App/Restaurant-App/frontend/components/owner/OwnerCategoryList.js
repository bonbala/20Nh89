import { Cancel, Delete, Edit } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";
import { Modal } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../../redux/slices/categorySlice";

const OwnerCategoryList = ({ item }) => {
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state) => state.user.user);
  const userId = user?._id;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/categories`
        );
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        // Handle error, such as displaying an error message to the user
      }
    };

    fetchCategoriesData();
  }, []);

  const handleDelete = async () => {
    const token = JSON.parse(window.localStorage.getItem("token"));
    await axios
      .delete(`${process.env.NEXT_PUBLIC_BASE_URL}/category/${item._id}`, {
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
    const token = JSON.parse(window.localStorage.getItem("token"));
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/category/${item._id}`,
        {
          name,
          userId: userId,
        },
        {
          headers: { Authorization: token },
        }
      )
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
      <div className="flex justify-between items-center p-3 bg-gray-600 w-[18rem] md:w-[20rem] lg:w-[25rem] rounded-xl mb-3">
        <h1 className="text-green-100 font-semibold">{item?.name}</h1>{" "}
        {/* Add optional chaining */}
        <div>
          <Edit
            onClick={() => setOpenModal(true)}
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
                    placeholder="Categories"
                  />
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
      </div>
    </>
  );
};

export default OwnerCategoryList;
