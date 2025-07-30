import userModel from "../models/userModel.js";

// 1. Summary report: total users, verified, unverified
export const getUserSummary = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    const verifiedUsers = await userModel.countDocuments({ isAccountVerified: true });
    const unverifiedUsers = totalUsers - verifiedUsers;

    res.json({
      success: true,
      data: {
        totalUsers,
        verifiedUsers,
        unverifiedUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Age distribution report (number of users per age)
export const getAgeDistribution = async (req, res) => {
  try {
    const distribution = await userModel.aggregate([
      {
        $group: {
          _id: "$age",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sort by age ascending
    ]);

    // Map to frontend-friendly format
    const data = distribution.map(item => ({
      age: item._id,
      count: item.count,
    }));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Email domain report (count users per email domain)
export const getEmailDomainReport = async (req, res) => {
  try {
    const domains = await userModel.aggregate([
      {
        $project: {
          domain: {
            $arrayElemAt: [{ $split: ["$email", "@"] }, 1],
          },
        },
      },
      {
        $group: {
          _id: "$domain",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const data = domains.map(item => ({
      domain: item._id,
      count: item.count,
    }));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
