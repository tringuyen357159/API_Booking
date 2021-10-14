require('dotenv').config();
import nodemailer from 'nodemailer';

const sendMailService = async (dataSend) => {

     // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Trí Nguyễn 👻" <Tringuyen357159@gmail.com>',
        to: dataSend.email, 
        subject: "Thông tin đặt lịch khám bệnh", 
        html: getBodyHTMLEmail(dataSend), 
    });
}

const getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if(dataSend.language === 'vi'){
        result = `
        <h3> Xin chào ${dataSend.patientName}</h3>
        <p>Bạn đã nhận được được email này vì đã đặt lịch khám bệnh online trên Website Trí Nguyễn</p>
        <p>Thông tin đặt lịch khám bệnh</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

        <p>Nếu các thông tin trên là sự thật vui lòng click vào đường link bên dưới để xác nhận và
        hoàn tất thủ tục lịck khám bệnh
        </p>
        <div>
            <a href=${dataSend.link} target=""_blank>Click here</a>
        </div>
        <div>
            Xin chân thành cảm ơn!
        </div>
        `;
    }
    if(dataSend.language === 'en'){
        result = `
        <h3> Dear ${dataSend.patientName}</h3>
        <p>You received this email because you booked an online medical appointment on Tri Nguyen Website</p>
        <p>Information to book a medical appointment</p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>

        <p>If the above information is true, please click on the link below to confirm and complete the medical examination appointment procedure.
        </p>
        <div>
            <a href=${dataSend.link} target=""_blank>Click here</a>
        </div>
        <div>
            Sincerely thank!
        </div>
        `;
    }
    return result;
}

const sendAttachment =  (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, 
                auth: {
                    user: process.env.EMAIL_APP,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
            });
            let info = await transporter.sendMail({
                from: '"Trí Nguyễn 👻" <Tringuyen357159@gmail.com>',
                to: dataSend.email, 
                subject: "Kết quả khám bệnh", 
                html: getBodyHTMLEmailRemedy(dataSend), 
                attachments: [
                    {
                        filename:`remedy-${dataSend.patientName}-${new Date().getTime()}.png`,
                        content:dataSend.image.split("base64")[1],
                        encoding: 'base64'
                    }
                ]
            });
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = '';
    if(dataSend.language === 'vi'){
        result = `
        <h3> Xin chào ${dataSend.patientName}</h3>
        <p>Bạn đã nhận được được email này vì đã khám bệnh online trên Website Trí Nguyễn thành công</p>
        <p>Thông tin đơn thuốc/hoá đơn được gửi trong file đính kèm
        </p>
        <div>
            Xin chân thành cảm ơn!
        </div>
        `;
    }
    if(dataSend.language === 'en'){
        result = `
        <h3> Dear ${dataSend.patientName}</h3>
        <p>You have received this email because of successful online medical examination on Tri Nguyen Website.</p>
        <p>Prescription/invoice information is sent in the attached file.
        </p>
        <div>
            Sincerely thank!
        </div>
        `;
    }
    return result;
}

module.exports = {
    sendMailService: sendMailService,
    sendAttachment: sendAttachment
}