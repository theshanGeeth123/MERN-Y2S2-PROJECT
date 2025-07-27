import userModel from "../models/userModel.js";

export const getUserData =async (req,res)=>{

    try {

        const uid = req.userId;

        const user = await userModel.findById(uid);

        if(!user){
             res.json({success:false,message:"User not found"});
        }

        res.json({
            success:true,
            userData:{
                name:user.name,
                isAccountVerified: user.isAccountVerified
            }
        })
        
    } catch (error) {
        res.json({success:false,message:error.message});
    }

}



export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.log("Error in getUserById:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const getUserIdByEmail = async (req, res) => {
  const { email } = req.query;
  console.log("Email received:", email);

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, userId: user._id });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error });
  }
};


// UPDATE user by ID
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, age, phone, address } = req.body;

  try {
    const updatedData = { name, email, age, phone, address };

    const user = await userModel.findByIdAndUpdate(id, updatedData, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User updated", data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// DELETE user by ID
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

