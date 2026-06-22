import Visitor from "../models/Visitor.js";
import ExcelJS from "exceljs";
import asyncHandler from "../utils/asyncHandler.js";

const downloadReport = asyncHandler(async (req, res) => {
  const visitors = await Visitor.find().populate(
    "contactPerson",
    "name phone role"
  );

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Visitors Report");

  worksheet.columns = [
    { header: "Visitor No", key: "visitorNo", width: 15 },
    { header: "Name", key: "visitorName", width: 20 },
    { header: "Mobile", key: "mobileNumber", width: 15 },
    { header: "Purpose", key: "purpose", width: 20 },
    { header: "Contact Person", key: "contactPerson", width: 20 },
    { header: "In Time", key: "visitInTime", width: 20 },
    { header: "Out Time", key: "visitorOutTime", width: 20 },
    { header: "Total Time", key: "totalTimeSpent", width: 15 },
    { header: "Status", key: "meetingStatus", width: 15 },
  ];

  visitors.forEach((v) => {
    worksheet.addRow({
      visitorNo: v.visitorNo,
      visitorName: v.visitorName,
      mobileNumber: v.mobileNumber,
      purpose: v.purpose,
      contactPerson: v.contactPerson?.name,
      visitInTime: v.visitInTime,
      visitorOutTime: v.visitorOutTime,
      totalTimeSpent: v.totalTimeSpent,
      meetingStatus: v.meetingStatus,
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=visitors-report.xlsx"
  );

  await workbook.xlsx.write(res);
  res.end();
});

export default downloadReport;
