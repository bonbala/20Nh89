var express = require("express");
const { getUserData,  } = require("../services/user.service");
var router = express.Router();

router.get("/get-user", async (req, res) => {
  let username = req?.username;
  let response = await getUserData(username);
  res.json(response);
});

router.patch("/update-user", async(req,res)=>{

})

//Route Api cho viec cap nhap giu lieu nguoi dung
router.patch("/update-user/:id",async(req, res) =>{
  let {id}=req?.params;
  let username = req?.username;
  let respone = await updateUser({id,username});
  res.json(respone);
})


//   res.send('Update by ID API')
//   try {
//     const id = req?.params.id;
//     const updatedData = req.body;
//     const options = { new: true };

//     const result = await Model.findByIdAndUpdate(
//         _id, updatedData, options
//     )

//     res.send(result)
// }
// catch (error) {
//     res.status(400).json({ message: error.message })
// }
  
// });

module.exports = router;
