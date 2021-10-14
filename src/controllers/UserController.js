import db from "../models/index"
import userServices from '../services/userServices';

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    
    //kiểm tra email & password có rỗng k (k nhập gì)
    if(!email || !password) {
        return res.status(500).json({
            errCode: 1,
            errMessage: 'Missing inputs parameters'
        })
    }

    let data = await userServices.handleLogin(email,password);
    return res.status(200).json({
        errCode: data.errCode ,
        message: data.errMessage,
        user: data.user ? data.user : {}
    })
}

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id

    if(!id) {   
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameter',
            users: []
        })
    }

    let users = await userServices.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        message: 'Ok',
        users
    })
}

let handleCreateNewUsers = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let address = req.body.address;
    let gender = req.body.gender;
    let roleId = req.body.roleId;
    let phoneNumber = req.body.phoneNumber;

    if(!email || !password || !firstName || !lastName || !address || !gender || !roleId || !phoneNumber) {
        return res.status(500).json({
            errCode: 1,
            errMessage: 'Missing inputs parameters'
        })
    }

    let message = await userServices.createNewUser(req.body);
    return res.status(200).json(message)
}

let handleEditUsers = async (req, res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let address = req.body.address;
    let gender = req.body.gender;
    let phoneNumber = req.body.phoneNumber;

    if(!firstName || !lastName || !address || !gender || !phoneNumber) {
        return res.status(500).json({
            errCode: 1,
            errMessage: 'Missing inputs parameters'
        })
    }

    let message = await userServices.updateUser(req.body);
    return res.status(200).json(message);
}

let handleDeleteUsers = async (req, res) => {
    if(!req.body.id) {
        return res.status(500).json({
            errCode: 1,
            errMessage: 'Missing inputs parameters'
        })
    }
    let message = await userServices.deleteUser(req.body.id);
    return res.status(200).json(message)
}

let handleGetAllCodes = async (req, res) => {
    try {
        let data = await userServices.getAllCodes(req.query.type);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server'
        })
    }
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUsers: handleCreateNewUsers,
    handleEditUsers: handleEditUsers,
    handleDeleteUsers: handleDeleteUsers,
    handleGetAllCodes: handleGetAllCodes
}