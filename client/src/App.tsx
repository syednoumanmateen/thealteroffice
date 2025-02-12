import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import CenterScreen from "./components/CenterScreen";
import PublicLayout from "./components/layout/PublicLayout";
import PrivateLayout from "./components/layout/PrivateLayout";
import "./App.css";

// Lazy-loaded Components
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Test = lazy(() => import("./pages/Test"));
const TaskBuddy = lazy(() => import("./pages/TaskBuddy"));
const NotFound = lazy(() => import("./components/NotFound"));

const App = () => {
  const loadingUI = <CenterScreen>Loading...</CenterScreen>;

  // Improved Redux Selector with TypeScript support
  const { loading } = useSelector((state: any) => state.loading);

  return (
    <BrowserRouter>
      <Suspense fallback={loadingUI}>
        {loading ? (
          loadingUI
        ) : (
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={<PublicLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* Private Routes */}
            <Route path="/" element={<PrivateLayout />}>
              <Route index element={<TaskBuddy />} />
            </Route>

            {/* Other Routes */}
            <Route path="/test" element={<Test />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
