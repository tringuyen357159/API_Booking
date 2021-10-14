import db from "../models/index";
import doctorServices from '../services/doctorServices';

const handleGetDoctor = async (req, res) => {
    let limit = req.query.limit;
    if(!limit) limit = 10 ;
    try {
        let doctor = await doctorServices.handleGetDoctorHome(+limit);
        return res.status(200).json(doctor);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..",
        })
    }
}

const handleGetAllDoctor = async (req, res) => {
    try {
        let doctors = await doctorServices.handleGetAllDoctor();
        return res.status(200).json(doctors);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..",
        })
    }
}

const handleCreateInfoDoctor = async (req, res) => {
    try {
        let data = await doctorServices.handleCreateInfoDoctor(req.body);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..",
        })
    }
}

const handleGetDetailDoctor = async (req, res) => {
    try {
        let info = await doctorServices.handleGetDetailDoctor(req.query.id)
        return res.status(200).json(info);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..",
        })
    }
}

const handleCreateScheduleDoctor = async (req, res) => {
    try {
        let info = await doctorServices.handleCreateScheduleDoctor(req.body)
        return res.status(200).json(info);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..",
        })
    }
}

const handleGetScheduleDoctor = async (req, res) => {
    try {
        let info = await doctorServices.handleGetScheduleDoctor(req.query.doctorId, req.query.date)
        return res.status(200).json(info);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..",
        })
    }
}

const handleGetExtraInfoDoctor = async (req, res) => {
    try {
        let info = await doctorServices.handleGetExtraInfoDoctor(req.query.doctorId)
        return res.status(200).json(info);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..",
        })
    }
}

const handleProfileDoctor = async (req, res) => {
    try {
        let info = await doctorServices.handleProfileDoctor(req.query.doctorId)
        return res.status(200).json(info);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..",
        })
    }
}

const handleGetListPatientDoctor = async (req, res) => {
    try {
        let info = await doctorServices.handleGetListPatientDoctor(req.query.doctorId, req.query.date)
        return res.status(200).json(info);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..",
        })
    }
}

const handleSendRemedy = async (req, res) => {
    try {
        let info = await doctorServices.handleSendRemedy(req.body)
        return res.status(200).json(info);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..",
        })
    }
}

module.exports = {
    handleGetDoctor: handleGetDoctor,
    handleGetAllDoctor: handleGetAllDoctor,
    handleCreateInfoDoctor: handleCreateInfoDoctor,
    handleGetDetailDoctor: handleGetDetailDoctor,
    handleCreateScheduleDoctor: handleCreateScheduleDoctor,
    handleGetScheduleDoctor: handleGetScheduleDoctor,
    handleGetExtraInfoDoctor: handleGetExtraInfoDoctor,
    handleProfileDoctor: handleProfileDoctor,
    handleGetListPatientDoctor: handleGetListPatientDoctor,
    handleSendRemedy: handleSendRemedy
}