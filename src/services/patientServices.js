import db from "../models/index";
require('dotenv').config();
import sendMailService from './emailService';
import { v4 as uuidv4 } from 'uuid';
import { reject } from "lodash";

const handleCreateBookPatient = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.email || !data.doctorId || !data.date || !data.timeType 
                || !data.fullName ||!data.gender || !data.address || !data.reason) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters!!'
                })
            }else{
                let token = uuidv4(); 
                await sendMailService.sendMailService({
                    email: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    link: buildUrlEmail(data.doctorId, token)
                });

                let user = await db.User.findOrCreate({
                    where: { 
                        email: data.email 
                    },
                    defaults: { 
                        email: data.email,
                        roleId: 'R3',
                        address: data.address,
                        gender: data.gender,
                        firstName: data.fullName
                    }
                })
                if(user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: {patientId: user[0].id},
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token,
                            reason: data.reason
                        }
                    })
                }
                resolve({
                    errCode: 0,
                    message: "Success!"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
}

const handleCreateVerifyBookPatient = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters!!'
                })
            }else{
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })

                if(appointment){
                    appointment.statusId = "S2";
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'Update the appointment success'
                    })
                }else{
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated or does not exist!!'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    handleCreateBookPatient: handleCreateBookPatient,
    handleCreateVerifyBookPatient: handleCreateVerifyBookPatient
}