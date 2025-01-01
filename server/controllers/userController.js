import userModel from "../models/userModel.js";

export const getUserData = async (request, response) => {
  try {
    const { userId } = request.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return response
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return response.json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    return response
      .status(400)
      .json({ success: false, message: error.message });
  }
};
