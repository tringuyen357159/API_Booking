import db from "../models/index";
import clinicServices from '../services/clinicServices';

const handleCreateClinic = async (req, res) => {
    try {
        let info = await clinicServices.handleCreateClinic(req.body)
        return res.status(200).json(info);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..",
        })
    }
}

const handleGetClinic = async (req, res) => {
    try {
        let info = await clinicServices.handleGetClinic()
        return res.status(200).json(info);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..",
        })
    }
}

const handleGetDetailClinic = async (req, res) => {
    try {
        let info = await clinicServices.handleGetDetailClinic(req.query.id)
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..",
        })
    }
}

module.exports = {
    handleCreateClinic: handleCreateClinic,
    handleGetClinic: handleGetClinic,
    handleGetDetailClinic: handleGetDetailClinic
}