import db from "../models/index";
import bcrypt from 'bcrypt';
import { raw } from "body-parser";

const salt = bcrypt.genSaltSync(10);

//xủ lý login
let handleLogin = (email, password) => {
    return new Promise (async (resolve, reject) => {
        try {
            let data = {} 
            let isExist = await checkEmail(email);
        
            if(isExist){ //nếu tồn tại email
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName','id'], //lấy những trường mình muốn lấy
                    where: {email: email},
                    raw: true
                });
                if(user){ //kiểm tra lại lần nữa
                    let check = await bcrypt.compareSync(password, user.password);
                    if(check) {
                        data.errCode = 0; 
                        data.message = `ok`;
                        delete user.password;
                        data.user = user;
                    }else{
                        data.errCode = 3; 
                        data.errMessage = `Wrong password`;
                    }
                }else {
                    data.errCode = 2; 
                    data.errMessage = `User's not found`;
                }
            }else{
                data.errCode = 1; 
                data.errMessage = `Your's email isn't exist in your system. Please try other email!`;
            }
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

//kiểm tra email có tồn tại
let checkEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {email: email}
            });
            if(user){
                resolve(true)
            }
            else{
                resolve(false)
            }
        } catch (error) {
            reject(error)
        }
    });
}

//lấy tất cả user
let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if(userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Allcode, as: 'positionData', attributes:['valueVi', 'valueEn'] },
                        { model: db.Allcode, as: 'genderData', attributes:['valueVi', 'valueEn'] },
                        { model: db.Allcode, as: 'roleData', attributes:['valueVi', 'valueEn'] },
                    ],
                    raw: true,
                    nest: true,
                    order: [['createdAt','DESC']],
                })
            }
            if(userId && userId !== 'ALL') {
                users = await db.User.findOne({ 
                    where: {id: userId},
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Allcode, as: 'positionData', attributes:['valueVi', 'valueEn'] },
                        { model: db.Allcode, as: 'genderData', attributes:['valueVi', 'valueEn'] },
                        { model: db.Allcode, as: 'roleData', attributes:['valueVi', 'valueEn'] },
                    ],
                    raw: true,
                    nest: true,
                    order: [['createdAt','DESC']],
                })
            }
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}

//thêm mới user
let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkEmail(data.email);
            if(check === true){
                resolve({
                    errCode:2,
                    errMessage:'Your email is already is used, Please try other email'
                })
            }else{
                let hashPasswordBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    gender: data.gender,
                    roleId: data.roleId,
                    phoneNumber: data.phoneNumber,
                    positionId: data.positionId,
                    image: data.image
                })
                resolve({
                    errCode:0,
                    message:'Ok'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

//hash password
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: userId}
            });
            if(user){
                await db.User.destroy({
                    where: {id: userId}
                });
                resolve({
                    errCode: 0,
                    message: `The user is delete successfuly`
                })
            }
            else{
                resolve({
                    errCode: 2,
                    errMessage: `The user isn't exist`
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.id || !data.roleId || !data.positionId || !data.gender){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing inputs parameters'
                })
            }
            let user = await db.User.findOne({
                where: {id: data.id},
                raw: false
            });
            if(user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.gender = data.gender;
                user.phoneNumber = data.phoneNumber;
                user.positionId = data.positionId;
                user.roleId = data.roleId;
                if(data.image) {
                    user.image = data.image;
                }
                await user.save();
                resolve({
                    errCode: 0,
                    message: `The user is update successfuly`
                })
            }
            else{
                resolve({
                    errCode: 1,
                    errMessage: `The user isn't exist`
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getAllCodes = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                });
            }else{
                let res = {}
                let allcodes = await db.Allcode.findAll({
                    where: { type: typeInput}
                });
                res.errCode = 0;
                res.data = allcodes;
                resolve(res);
            }
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    handleLogin: handleLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUser: updateUser,
    getAllCodes: getAllCodes,
}