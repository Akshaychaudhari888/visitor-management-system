import Visitor from "../models/Visitor.js";
import createVisitorAccount from '../processor/create-visitor.js'

const createVisitor = async (req, res) => {
  try {
    const {
      visitorName,
      mobileNumber,
      contactPerson,
      purpose,
      noOfPersons,
      vehicleNumber,
    } = req.body;

    const visitorCount = await Visitor.countDocuments();

    const visitorNo = `VN${101 + visitorCount}`;

    const visitor = await createVisitorAccount({
      visitorNo,
      visitorName,
      mobileNumber,
      contactPerson,
      purpose,
      noOfPersons,
      vehicleNumber,
      visitInTime: new Date(),
    });

    return res.status(201).json({
      success: true,
      data: visitor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while adding visitor",
    });
  }
};

export default createVisitor;