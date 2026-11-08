import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./authentication/login/Login";
import Register from "./authentication/register/Signup";
import AppLayout from "./admin/layouts/AppLayout";
import Dashboard from "./admin/dashboard/Dashboard";
import PatientList from "./admin/patients/PatientList";
import MyProfile from "./admin/profile/MyProfile";
import PatientLayout from "./Patient/Layout/PatientLaout";
import PatientDashboard from "./Patient/Dashboard/PatientDashboard";
import PatientProfile from "./Patient/profile/PatientProfile";
import EditMyProfile from "./Patient/profile/EditMyProfile";
import DoctorsList from "./Patient/Doctror/DoctorList";
import DoctorDetail from "./Patient/Doctror/DoctorDetail";
import AppointmentList from "./Patient/Appointment/AppointmentList";
import AppointmentDetail from "./Patient/Appointment/AppointmentDetail";
import Add_appointment from "./Patient/Appointment/Add_appointment";
import Update_appointment from "./Patient/Appointment/Update_appointment";
import MedicalRecord from "./Patient/MedicalRecord/MedicalRecord";
import PrescriptionList from "./Patient/Prescription/PrescriptionList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<AppLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/patients" element={<PatientList />} />
          <Route path="/admin/appointments" element={<div>Rendez-vous</div>} />
          <Route path="/client/profile" element={<MyProfile />} />
        </Route>

        <Route path="/patient" element={<PatientLayout />}>
          <Route path="dashboard" element={<PatientDashboard />} />

          <Route path="profile" element={<PatientProfile />} />
          <Route path="editProfile/:id" element={<EditMyProfile />} />

          <Route path="doctors" element={<DoctorsList />} />
          <Route path="doctorDetail/:id" element={<DoctorDetail />} />

          <Route path="appointments" element={<AppointmentList />} />
          <Route path="appointmentDetail/:id" element={<AppointmentDetail />} />
          <Route path="appointments/add" element={<Add_appointment />} />

          <Route
            path="appointments/:id/edit"
            element={<Update_appointment />}
          />

          <Route path="medical-record" element={<MedicalRecord />} />

          <Route path="prescriptions" element={<PrescriptionList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
