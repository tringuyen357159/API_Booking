import db from "../models/index";
require('dotenv').config();
import _, { reject } from 'lodash';
import emailService from '../services/emailService'

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

const handleGetDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                where: { roleId: 'R2' },
                order: [['createdAt','DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes:['valueVi', 'valueEn'] },
                    { model: db.Allcode, as: 'genderData', attributes:['valueVi', 'valueEn'] },
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (error) {
            reject(error);
        }
    })
}

const handleGetAllDoctor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password','email']
                },
            })
            resolve({
                errCode: 0,
                data: doctors
            });
        } catch (error) {
            reject(error)
        }
    })
}

//check lỗi k nhập
const handleCheckRequiredField = (input) => {
    let arrFields = ['doctorId', 'contentHTML', 'contentMarkDown', 'action', 'selectedPrice', 'selectedProvince',
                    'selectedPayment', 'nameClinic', 'nameAddressClinic', 'note', 'selectedSpecialty', 'selectedClinic'];
    let isValid = true;
    let element = '';
    for(let i = 0; i < arrFields.length; i++) {
        if(!input[arrFields[i]]){
            isValid = false;
            element = arrFields[i];
            break;
        }
    }
    return {
        isValid: isValid,
        element: element
    }
}

const handleCreateInfoDoctor = (inputData) => {
    return new Promise(async(resolve, reject) => {
        try {
            let ckeckObj = handleCheckRequiredField(inputData)
            if(ckeckObj.isValid === false){
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter: ${ckeckObj.element}`,
                })
            }else{
                if(inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkDown: inputData.contentMarkDown,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    })
                }
                else if(inputData.action === 'EDIT'){
                    let doctorMarkDown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })
                    if(doctorMarkDown) {
                        doctorMarkDown.contentHTML = inputData.contentHTML;
                        doctorMarkDown.contentMarkDown = inputData.contentMarkDown;
                        doctorMarkDown.description = inputData.description;
                        await doctorMarkDown.save();
                    }
                }
                
                let doctorInfo = await db.Doctor_Infor.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false
                })
                if(doctorInfo) {
                    //update
                    doctorInfo.priceId = inputData.selectedPrice;
                    doctorInfo.provinceId = inputData.selectedProvince;
                    doctorInfo.paymentId = inputData.selectedPayment;
                    doctorInfo.nameClinic = inputData.nameClinic;
                    doctorInfo.addressClinic = inputData.nameAddressClinic;
                    doctorInfo.note = inputData.note;
                    doctorInfo.specialtyId = inputData.selectedSpecialty;
                    doctorInfo.clinicId = inputData.selectedClinic;
                    await doctorInfo.save();
                }else{
                    //create
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.nameAddressClinic,
                        note: inputData.note,
                        specialtyId: inputData.selectedSpecialty,
                        clinicId: inputData.selectedClinic
                    })
                }
                resolve({
                    errCode: 0,
                    message: 'Save info doctor success',
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

const handleGetDetailDoctor = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!inputId){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter',
                })
            }else{
                let data = await db.User.findOne({
                    where: { id: inputId},
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {   
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkDown']
                        },
                        {   
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },   
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes:['valueVi', 'valueEn'] },
                                { model: db.Allcode, as: 'provinceData', attributes:['valueVi', 'valueEn'] },
                                { model: db.Allcode, as: 'paymentData', attributes:['valueVi', 'valueEn'] },
                            ],
                        },
                        { 
                            model: db.Allcode, 
                            as: 'positionData', attributes:['valueVi', 'valueEn'] 
                        },
                    ],
                    raw: false,
                    nest: true
                })
                if(data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
                }
                if(!data) {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    data: data,
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const handleCreateScheduleDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!!'
                })
            }else{
                let schedule = data.arrSchedule;
                if(schedule && schedule.length > 0 ){
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;    
                    })
                }
                //get all exist
                let exist = await db.Schedule.findAll({
                    where: { 
                        doctorId: data.doctorId,
                        date: data.date
                    },
                    attributes:['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                })
                // //convert date
                // if(exist && exist.length > 0){
                //     exist = exist.map(item => {
                //         item.date = new Date(item.date).getTime();
                //         return item;
                //     })
                // }
                //compare different
                let toCreate = _.differenceWith(schedule, exist, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });

                //create data 
                if(toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }
                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const handleGetScheduleDoctor = (doctorId, date) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!doctorId || !date){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters!!'
                })
            }else{
                let data = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes:['valueVi', 'valueEn'] },
                        { model: db.User, as: 'doctorData', attributes:['firstName', 'lastName'] },
                    ],
                    raw: false,
                    nest: true
                })
                if(!data) data = []

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

const handleGetExtraInfoDoctor = (doctorId) => {
    return new Promise(async(resolve, reject) =>{
        try {
            if(!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters!!'
                })
            }else{
                let data = await db.Doctor_Infor.findOne({
                    where: {doctorId: doctorId},
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },   
                    include: [
                        { model: db.Allcode, as: 'priceData', attributes:['valueVi', 'valueEn'] },
                        { model: db.Allcode, as: 'provinceData', attributes:['valueVi', 'valueEn'] },
                        { model: db.Allcode, as: 'paymentData', attributes:['valueVi', 'valueEn'] },
                    ],
                    raw: false,
                    nest: true
                })

                if(!data) data = {};
                resolve ({
                    errCode: 0,
                    data: data,
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const handleProfileDoctor = (doctorId) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters!!'
                })
            }else{
                let data = await db.User.findOne({
                    where: { id: doctorId},
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {   
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },   
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes:['valueVi', 'valueEn'] },
                                { model: db.Allcode, as: 'provinceData', attributes:['valueVi', 'valueEn'] },
                                { model: db.Allcode, as: 'paymentData', attributes:['valueVi', 'valueEn'] },
                            ],
                        },
                        { 
                            model: db.Allcode, 
                            as: 'positionData', attributes:['valueVi', 'valueEn'] 
                        },
                        {   
                            model: db.Markdown,
                            attributes: ['description']
                        },
                    ],
                    raw: false,
                    nest: true
                })
                if(data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
                }
                if(!data) {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    data: data,
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const handleGetListPatientDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters!!'
                })
            }else{
                let data = await db.Booking.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date,
                        statusId: 'S2'
                    },
                    include: [
                        { 
                            model: db.User, as: 'patientData', 
                            attributes:['email', 'firstName', 'address', 'gender'],
                            include: [
                                { 
                                    model: db.Allcode, as: 'genderData', 
                                    attributes:['valueVi', 'valueEn'] 
                                },
                            ],
                        },
                        { 
                            model: db.Allcode, as: 'timeTypeDataPatient', 
                            attributes:['valueVi', 'valueEn'] 
                        },
                    ],
                    raw: false,
                    nest: true
                })

                resolve({
                    data: data,
                    errCode: 0,
                    message: 'ok'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const handleSendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.email || !data.doctorId || !data.patientId || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters!!'
                })
            }else{
                let res = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw:false
                })
                if(res) {
                    res.statusId = 'S3';
                    await res.save();
                }

                await emailService.sendAttachment(data)
                
                resolve({
                    errCode: 0,
                    message: 'ok',
                    data: res
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    handleGetDoctorHome: handleGetDoctorHome,
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