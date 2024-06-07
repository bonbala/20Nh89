const registerValid = (name, email, password, cf_password) => {
  if (!name) return "Please enter your name";
  if (!email) return "Please enter your email address";
  if (!validateEmail(email)) return "Please enter valid email";
  if (!password) return "Please enter new password";
  if (password.length < 6)
    return "Password should contain atleast 6 characters";
  if (!cf_password) return "Please retype your password to confirm";
  if (password !== cf_password)
    return "Passwords does not match. Please try again";
};

const loginValid = (email, password) => {
  if (!email) return "Please enter your email";
  if (!password) return "Please enter your password";
};

const addFoodErrorHandler = (
  name,
  categories,
  price,
  description,
  image,
  restaurantId,
  ingredients
) => {
  if (!name) return "Please enter food name";
  if (!categories) return "Please enter food category";
  if (!price) return "Please enter food cost";
  if (!description) return "Please enter food description";
  if (!image) return "Please add food image";
  if (!ingredients) return "Please add food image";
  if (!restaurantId) return "Please add food image";
};

const addRestaurantErrorHandler = (
  name,
  categories,
  location,
  email,
  phone,
  logo,
  poster,
  cover,
  description
) => {
  if (!name) return "Please enter restaurant name";
  if (!categories) return "Please enter food category";
  if (!location) return "Please enter restaurant location";
  if (!email) return "Please enter restaurant description";
  if (!validateVietnamesePhoneNumber(phone))
    return "Please enter valid number phone";
  if (!logo) return "Please add restaurant logo";
  if (!poster) return "Please add restaurant poster";
  if (!cover) return "Please add restaurant cover";
  if (!description) return "Please add restaurant description";
  // if (!status) return "Please add restaurant status";
};

const addCategoryErrorHandler = (name) => {
  if (!name) return "Please enter food category";
  // Thêm điều kiện kiểm tra nếu name là một chuỗi trống
  if (typeof name !== "string" || name.trim() === "")
    return "Category name cannot be empty";
  // Nếu không có lỗi, trả về null hoặc undefined để chỉ ra không có lỗi
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
function validateVietnamesePhoneNumber(phone) {
  const re = /^(0|\+84)(\d{9,10})$/;
  return re.test(phone);
}

module.exports = {
  registerValid,
  loginValid,
  addFoodErrorHandler,

  addRestaurantErrorHandler,
  addCategoryErrorHandler,
};
