import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoDetail from "./pages/VideoDetail";
import WordList from "./pages/WordList";
import Home from "./pages/Home";
import VideoUpload from "./pages/VideoUpload";
import AppLayout from "./layout/AppLayout";
import UserProfiles from "./pages/UserProfiles";
import { OptionalAuthRoute, ProtectedRoute, PublicRoute } from './middleware/authMiddleware';
import Blank from "./pages/Blank";
import FormElements from "./pages/Forms/FormElements";
import BasicTables from "./pages/Tables/BasicTables";
import Alerts from "./pages/UiElements/Alerts";
import Avatars from "./pages/UiElements/Avatars";
import Badges from "./pages/UiElements/Badges";
import Buttons from "./pages/UiElements/Buttons";
import Images from "./pages/UiElements/Images";
import Videos from "./pages/UiElements/Videos";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import HomeDashboard  from "./pages/Dashboard/Home";
import Calendar from "./pages/Calendar";
import AddLesson from "./pages/Lessions/AddLesson";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected Routes */}
        <Route index path="/" element={<OptionalAuthRoute><Home /></OptionalAuthRoute>} />
        <Route path="/videos/:id" element={<OptionalAuthRoute><VideoDetail /></OptionalAuthRoute>} />
        <Route path="/words" element={<OptionalAuthRoute><WordList /></OptionalAuthRoute>} />
        <Route path="/upload" element={<OptionalAuthRoute><VideoUpload /></OptionalAuthRoute>} />

        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/admin/dashboard" element={<HomeDashboard />} />

            <Route path="/admin/add-lesson" element={<AddLesson />} />

            {/* Others Page */}
            <Route path="/admin/profile" element={<UserProfiles />} />
            <Route path="/admin/calendar" element={<Calendar />} />
            <Route path="/admin/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/admin/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/admin/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/admin/alerts" element={<Alerts />} />
            <Route path="/admin/avatars" element={<Avatars />} />
            <Route path="/admin/badge" element={<Badges />} />
            <Route path="/admin/buttons" element={<Buttons />} />
            <Route path="/admin/images" element={<Images />} />
            <Route path="/admin/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/admin/line-chart" element={<LineChart />} />
            <Route path="/admin/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout - Public Routes */}
          <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
