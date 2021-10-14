import db from "../models/index";
import specialtyServices from '../services/specialtyServices';

const handleCreateSpecialty = async (req, res) => {
    try {
        let info = await specialtyServices.handleCreateSpecialty(req.body)
        return res.status(200).json(info);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..",
        })
    }
}

const handleGetSpecialty = async (req, res) => {
    try {
        let info = await specialtyServices.handleGetSpecialty()
        return res.status(200).json(info);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..",
        })
    }
}

const handleGetDetailSpecialty = async (req, res) => {
    try {
        let info = await specialtyServices.handleGetDetailSpecialty(req.query.id, req.query.location)
        return res.status(200).json(info);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..",
        })
    }
}

module.exports = {
   handleCreateSpecialty: handleCreateSpecialty,
   handleGetSpecialty: handleGetSpecialty,
   handleGetDetailSpecialty: handleGetDetailSpecialty
}