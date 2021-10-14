import db from "../models/index";
require('dotenv').config();

const handleCreateClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.name || !data.descriptionMarkdown || !data.image || !data.descriptionHTML || !data.address) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters!!'
                })
            }else{
                await db.Clinic.create({
                    name: data.name,
                    descriptionMarkdown: data.descriptionMarkdown,
                    image: data.image,
                    descriptionHTML: data.descriptionHTML,
                    address: data.address
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

const handleGetClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll();
            if(data && data.length > 0) {
                data.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
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

const handleGetDetailClinic = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters!!'
                })
            }else{
                let data = await db.Clinic.findOne({
                    where: {
                        id: id
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown', 'name', 'address']
                })
                if(data) {
                    let doctorClinic = await db.Doctor_Infor.findAll({
                        where: {
                            clinicId: id
                        },
                        attributes: ['doctorId']
                    });
                    data.doctorClinic = doctorClinic;
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
    handleCreateClinic: handleCreateClinic,
    handleGetClinic: handleGetClinic,
    handleGetDetailClinic: handleGetDetailClinic
}