import Visitor from "../models/Visitor.js";

const uploadVisitorPhoto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id required",
      });
    }

    const visitor = await Visitor.findById(id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    visitor.photo = req.file.filename;

    await visitor.save();

    return res.status(200).json({
      success: true,
      message: "Photo uploaded successfully",
      data: visitor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while updating visitor photo",
    });
  }
};

export default uploadVisitorPhoto;