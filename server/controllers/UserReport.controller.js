// controllers/UserReport.controller.js
import userModel from "../models/userModel.js";

/**
 * Helpers
 */
const parseDateRange = (req) => {
  // Optional ?start=YYYY-MM-DD&end=YYYY-MM-DD (used by several endpoints)
  const { start, end } = req.query || {};
  const match = {};
  if (start || end) {
    match.createdAt = {};
    if (start) match.createdAt.$gte = new Date(`${start}T00:00:00.000Z`);
    if (end)   match.createdAt.$lte = new Date(`${end}T23:59:59.999Z`);
  }
  return match;
};

/**
 * When grouping by day/month, we first ensure a reliable timestamp (createdAtSafe)
 * and then match an inclusive date range on that field.
 */
const buildCreatedAtSafeMatch = (start, end) => {
  const match = {};
  if (start || end) {
    match.createdAtSafe = {};
    if (start) match.createdAtSafe.$gte = new Date(`${start}T00:00:00.000Z`);
    if (end)   match.createdAtSafe.$lte = new Date(`${end}T23:59:59.999Z`);
  }
  return match;
};

/**
 * 1) Summary: total / verified / unverified
 *    Optional date range (?start=YYYY-MM-DD&end=YYYY-MM-DD)
 */
export const getUserSummary = async (req, res) => {
  try {
    const match = parseDateRange(req);

    const [totalUsers, verifiedUsers] = await Promise.all([
      userModel.countDocuments(match),
      userModel.countDocuments({ ...match, isAccountVerified: true }),
    ]);

    return res.json({
      success: true,
      data: {
        totalUsers,
        verifiedUsers,
        unverifiedUsers: totalUsers - verifiedUsers,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Summary failed" });
  }
};

/**
 * 2) Age distribution (bucketed & cast from string)
 *    Buckets: 0–17, 18–24, 25–34, 35–44, 45–54, 55–64, 65+
 *    Optional date range
 */
export const getAgeDistribution = async (req, res) => {
  try {
    const { start, end } = req.query;

    const match = {};
    if (start || end) {
      match.createdAt = {};
      if (start) match.createdAt.$gte = new Date(`${start}T00:00:00.000Z`);
      if (end) match.createdAt.$lte = new Date(`${end}T23:59:59.999Z`);
    }

    const distribution = await userModel.aggregate([
      { $match: match },

      // Make age numeric
      { $project: { age: { $toInt: "$age" } } },

      // Keep only reasonable ages
      { $match: { age: { $gt: 0, $lte: 120 } } },

      // Compute an age range label and an order index for sorting
      {
        $project: {
          range: {
            $switch: {
              branches: [
                { case: { $lt: ["$age", 18] }, then: "0-17" },
                { case: { $and: [{ $gte: ["$age", 18] }, { $lte: ["$age", 24] }] }, then: "18-24" },
                { case: { $and: [{ $gte: ["$age", 25] }, { $lte: ["$age", 34] }] }, then: "25-34" },
                { case: { $and: [{ $gte: ["$age", 35] }, { $lte: ["$age", 44] }] }, then: "35-44" },
                { case: { $and: [{ $gte: ["$age", 45] }, { $lte: ["$age", 54] }] }, then: "45-54" },
                { case: { $and: [{ $gte: ["$age", 55] }, { $lte: ["$age", 64] }] }, then: "55-64" },
                { case: { $gte: ["$age", 65] }, then: "65+" }
              ],
              default: "Unknown"
            }
          },
          order: {
            $switch: {
              branches: [
                { case: { $lt: ["$age", 18] }, then: 0 },
                { case: { $and: [{ $gte: ["$age", 18] }, { $lte: ["$age", 24] }] }, then: 1 },
                { case: { $and: [{ $gte: ["$age", 25] }, { $lte: ["$age", 34] }] }, then: 2 },
                { case: { $and: [{ $gte: ["$age", 35] }, { $lte: ["$age", 44] }] }, then: 3 },
                { case: { $and: [{ $gte: ["$age", 45] }, { $lte: ["$age", 54] }] }, then: 4 },
                { case: { $and: [{ $gte: ["$age", 55] }, { $lte: ["$age", 64] }] }, then: 5 },
                { case: { $gte: ["$age", 65] }, then: 6 }
              ],
              default: 99
            }
          }
        }
      },

      // Group by range
      { $group: { _id: { range: "$range", order: "$order" }, count: { $sum: 1 } } },

      // Sort by the numeric order so buckets appear in logical order
      { $sort: { "_id.order": 1 } },

      // Shape the output
      { $project: { _id: 0, range: "$_id.range", count: 1 } }
    ]);

    res.json({ success: true, data: distribution });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 3) Email domains (normalized)
 *    Optional ?limit=N (default 10), optional date range
 */
export const getEmailDomainReport = async (req, res) => {
  try {
    const limit = Math.max(1, parseInt(req.query.limit || "10", 10));
    const match = parseDateRange(req);

    const pipeline = [
      { $match: match },
      {
        $project: {
          domain: {
            $toLower: {
              $arrayElemAt: [{ $split: ["$email", "@"] }, 1],
            },
          },
        },
      },
      { $match: { domain: { $ne: null, $ne: "" } } },
      { $group: { _id: "$domain", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ];

    const domains = await userModel.aggregate(pipeline);

    const data = domains.map(d => ({ domain: d._id, count: d.count }));
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Email domain report failed" });
  }
};

/**
 * 4) Registrations by month (line chart)
 *    Optional date range
 *    Output: [{ _id: 'YYYY-MM', registrations: N }]
 */
export const getUsersByMonth = async (req, res) => {
  try {
    const { start, end } = req.query;

    const data = await userModel.aggregate([
      // Create a safe date: use createdAt if present, else ObjectId timestamp
      {
        $addFields: {
          createdAtSafe: { $ifNull: ["$createdAt", { $toDate: "$_id" }] }
        }
      },
      // Respect inclusive date range on createdAtSafe
      { $match: buildCreatedAtSafeMatch(start, end) },
      // Group by YYYY-MM
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAtSafe" } },
          registrations: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ success: true, data });
  } catch (err) {
    console.error("by-month report error:", err);
    res.status(500).json({ success: false, message: "By-month report failed" });
  }
};

/**
 * 4b) Registrations by day (line chart)
 *     Optional date range
 *     Output: [{ _id: 'YYYY-MM-DD', registrations: N }]
 */
export const getUsersByDay = async (req, res) => {
  try {
    const { start, end } = req.query;

    const data = await userModel.aggregate([
      {
        $addFields: {
          createdAtSafe: { $ifNull: ["$createdAt", { $toDate: "$_id" }] }
        }
      },
      { $match: buildCreatedAtSafeMatch(start, end) },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAtSafe" } },
          registrations: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ success: true, data });
  } catch (err) {
    console.error("by-day report error:", err);
    res.status(500).json({ success: false, message: "By-day report failed" });
  }
};

/**
 * 5) Verified split (pie chart)
 *    Optional date range
 *    Returns { verified, unverified }
 */
export const getVerifiedSplit = async (req, res) => {
  try {
    const { start, end } = req.query;

    const match = {};
    if (start || end) {
      match.createdAt = {};
      if (start) match.createdAt.$gte = new Date(`${start}T00:00:00.000Z`);
      if (end) match.createdAt.$lte = new Date(`${end}T23:59:59.999Z`);
    }

    const buckets = await userModel.aggregate([
      { $match: match },
      { $group: { _id: "$isAccountVerified", count: { $sum: 1 } } },
    ]);

    const verified = buckets.find(b => b._id === true)?.count || 0;
    const unverified = buckets.find(b => b._id === false)?.count || 0;

    return res.json({
      success: true,
      data: { verified, unverified },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 6) Top addresses (simple group-by; optional ?limit=5)
 *    Optional date range
 */
export const getTopAddresses = async (req, res) => {
  try {
    const limit = Math.max(1, parseInt(req.query.limit || "5", 10));
    const match = parseDateRange(req);

    const data = await userModel.aggregate([
      { $match: { ...match, address: { $exists: true, $ne: "" } } },
      { $group: { _id: "$address", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    return res.json({
      success: true,
      data: data.map(x => ({ address: x._id, count: x.count })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Top addresses failed" });
  }
};

/**
 * (Optional but recommended)
 * Add this in your user schema file to speed up date queries:
 * userSchema.index({ createdAt: 1 });
 */
