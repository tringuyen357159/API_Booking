import express from "express";
import UserController from "../controllers/UserController";
import DoctorController from "../controllers/DoctorController";
import PatientController from "../controllers/PatientController";
import SpecialtyController from "../controllers/SpecialtyController";
import ClinicController from "../controllers/ClinicController";

let route = express.Router(); 

let initWebRoutes = (app) => {

    //api user
    route.post('/api/login', UserController.handleLogin);
    route.get('/api/get-all-users', UserController.handleGetAllUsers);
    route.post('/api/create-new-users', UserController.handleCreateNewUsers);
    route.put('/api/edit-users', UserController.handleEditUsers);
    route.delete('/api/delete-users', UserController.handleDeleteUsers);

    //api get Allcodes
    route.get('/api/allcode', UserController.handleGetAllCodes);

    //api doctor
    route.get('/api/get-doctor', DoctorController.handleGetDoctor);
    route.get('/api/get-all-doctor', DoctorController.handleGetAllDoctor);
    route.post('/api/create-info-doctor', DoctorController.handleCreateInfoDoctor);
    route.get('/api/get-detail-doctor', DoctorController.handleGetDetailDoctor);
    route.post('/api/bulk-create-schedule', DoctorController.handleCreateScheduleDoctor);
    route.get('/api/get-schedule-doctor-by-date', DoctorController.handleGetScheduleDoctor);
    route.get('/api/get-extra-info-doctor-by-id', DoctorController.handleGetExtraInfoDoctor);
    route.get('/api/get-profile-doctor', DoctorController.handleProfileDoctor);
    route.get('/api/get-list-patient-doctor', DoctorController.handleGetListPatientDoctor);
    route.post('/api/send-remedy', DoctorController.handleSendRemedy);

    //panient
    route.post('/api/create-patient-book', PatientController.handleCreateBookPatient);
    route.post('/api/verify-patient-book', PatientController.handleCreateVerifyBookPatient);

    //specialty
    route.post('/api/create-specialty', SpecialtyController.handleCreateSpecialty);
    route.get('/api/get-specialty', SpecialtyController.handleGetSpecialty);
    route.get('/api/get-detail-specialty', SpecialtyController.handleGetDetailSpecialty);

    //clinic
    route.post('/api/create-clinic', ClinicController.handleCreateClinic);
    route.get('/api/get-clinic', ClinicController.handleGetClinic);
    route.get('/api/get-detail-clinic', ClinicController.handleGetDetailClinic);

    return app.use("/", route);
}

module.exports = initWebRoutes;