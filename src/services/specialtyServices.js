import db from "../models/index";
require('dotenv').config();

const handleCreateSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.nameSpeacialty || !data.descriptionMarkdown || !data.image || !data.descriptionHTML) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters!!'
                })
            }else{
                await db.Specialty.create({
                    name: data.nameSpeacialty,
                    descriptionMarkdown: data.descriptionMarkdown,
                    image: data.image,
                    descriptionHTML: data.descriptionHTML
                })

                resolve({
                    errCode: 0,
                    message: 'ok'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const handleGetSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
            if(data && data.length > 0) {
                data.map(item => {
                    item.image =  Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })

            }
            resolve({
                errCode: 0,
                message: 'ok',
                data: data
            })
        } catch (error) {
            reject(error)
        }
    })
}

const handleGetDetailSpecialty = (id, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!id || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters!!'
                })
            }else{
                let data = await db.Specialty.findOne({
                    where: {
                        id: id
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown']
                })
                if(data) {
                    let doctorSpecialty = [];
                    if(location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: id
                            },
                            attributes: ['doctorId', 'provinceId']
                        });
                        data.doctorSpecialty = doctorSpecialty;
                    }else{
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: id,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId']
                        });
                        data.doctorSpecialty = doctorSpecialty;
                    }
                    resolve({
                        errCode: 0,
                        message: 'ok',
                        data: data
                    })
                }else{
                    resolve({
                        data: {},
                        errCode: 0,
                        message: 'ok',
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    handleCreateSpecialty: handleCreateSpecialty,
    handleGetSpecialty: handleGetSpecialty,
    handleGetDetailSpecialty: handleGetDetailSpecialty
}