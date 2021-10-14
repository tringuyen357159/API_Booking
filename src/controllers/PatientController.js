import db from "../models/index";
import patientServices from '../services/patientServices';

const handleCreateBookPatient = async (req, res) => {
    try {
        let data = await patientServices.handleCreateBookPatient(req.body)
        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..",
        })
    }
}

const handleCreateVerifyBookPatient = async (req, res) => {
    try {
        let data = await patientServices.handleCreateVerifyBookPatient(req.body)
        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..",
        })
    }
}

module.exports = { 
    handleCreateBookPatient: handleCreateBookPatient,
    handleCreateVerifyBookPatient: handleCreateVerifyBookPatient,
}