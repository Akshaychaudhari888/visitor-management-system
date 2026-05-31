import Visitor from "../models/Visitor.js";

const visitorOut = async (req, res) => {
  try {
    const { id } = req.params;

    if(!id){
        return res.status(400).json({
            success: false,
            message: 'id required'
        })
    }

    const visitor = await Visitor.findById(id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    const visitorOutTime = new Date();

    const totalMinutes = Math.floor(
      (visitorOutTime - visitor.visitInTime) / (1000 * 60)
    );

    visitor.visitorOutTime = visitorOutTime;
    visitor.totalTimeSpent = `${totalMinutes} minutes`;

    await visitor.save();

    return res.status(200).json({
      success: true,
      message: "Visitor exit updated successfully",
      data: visitor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default visitorOut;