import UserProfile from "../pages/UserProfile";
import UserChildren from "../pages/UserChildren";
import UserScheduling from "../pages/UserScheduling";
import UserHistory from "../pages/UserHistory";
import HealthRecord from "../pages/HealthRecord";
import TransactionPage from "../pages/TransactionPage";

// Admin pages
import Dashboard from "../pages/admin/Dashboard";
import AccountManage from "../pages/admin/AccountManage";
import VaccineManage from "../pages/admin/VaccineManage";
import ProtocolManage from "../pages/admin/ProtocolManage";
import ComboManage from "../pages/admin/ComboManage";
import WorkSchedule from "../pages/admin/WorkSchedule";

// Staff pages
import StaffHome from "../pages/staff/StaffHome";
import CheckIn from "../pages/staff/CheckIn";
import Schedule from "../pages/staff/Schedule";
import VaccinationPage from "../pages/staff/VaccinationPage";
import VaccinationManagement from "../pages/staff/VaccinationManagement";
import DiagnosisPage from "../pages/staff/DiagnosisPage";

// Routes dành cho user đã đăng nhập
const userRoutes = [
  { path: "/User/Profile", element: UserProfile },
  { path: "/User/Children", element: UserChildren },
  { path: "/User/Scheduling", element: UserScheduling },
  { path: "/User/History", element: UserHistory },
  { path: "/User/Record", element: HealthRecord },
  { path: "/Transaction", element: TransactionPage },
];

// Routes dành cho admin
const adminRoutes = [
  { path: "/Admin/Dashboard", element: Dashboard },
  { path: "/Admin/ManageAccount", element: AccountManage },
  { path: "/Admin/VaccineManage", element: VaccineManage },
  { path: "/Admin/ProtocolManage", element: ProtocolManage },
  { path: "/Admin/ManageCombo", element: ComboManage },
  { path: "/Admin/WorkSchedule", element: WorkSchedule },
];

// Routes dành cho staff (bác sĩ, y tá)
const staffRoutes = [
  { path: "/Staff/StaffPage", element: StaffHome },
  { path: "/Staff/CheckIn", element: CheckIn },
  { path: "/Staff/Schedule", element: Schedule },
  { path: "/Staff/Vaccination/:bookingId", element: VaccinationPage },
  { path: "/Staff/Vaccination", element: VaccinationManagement },
  { path: "/Staff/Diagnosis/:bookingId", element: DiagnosisPage },
];

export { userRoutes, adminRoutes, staffRoutes };
