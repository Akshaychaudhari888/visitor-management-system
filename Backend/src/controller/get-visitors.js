import Visitor from "../models/Visitor.js";

const getVisitors = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const [visitors, totalCount] = await Promise.all([
      Visitor.find(
        {},
        {
          visitorNo: 1,
          visitorName: 1,
          mobileNumber: 1,
          contactPerson: 1,
          purpose: 1,
          noOfPersons: 1,
          vehicleNumber: 1,
          visitInTime: 1,
          meetingStatus: 1,
          visitorOutTime:1,
          totalTimeSpent:1,
          visitInTime:1
        }
      )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Visitor.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      data: visitors,
    });
  } catch (error) {
    next(error);
  }
};

export default getVisitors;