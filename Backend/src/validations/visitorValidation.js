import Joi from 'joi';

export const createVisitorValidation = Joi.object({
    visitorName: Joi.string().min(2).max(100).required(),
    mobileNumber: Joi.string().pattern(/^[0-9]{10,12}$/).required(),
    contactPerson: Joi.string().hex().length(24).required(),
    purpose: Joi.string().min(3).max(200).required(),
    noOfPersons: Joi.number().integer().min(1).max(50).default(1),
    vehicleNumber: Joi.string().max(20).allow('', null),
});

export const updateMeetingStatusValidation = Joi.object({
    meetingStatus: Joi.string().valid('Pending', 'Completed', 'Cancelled').required(),
    meetingOutTime: Joi.date().iso().optional(),
});

export const objectIdParam = Joi.object({
    id: Joi.string().hex().length(24).required(),
});
