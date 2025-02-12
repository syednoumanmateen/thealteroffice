import { Routes, Route, BrowserRouter } from "react-router-dom";
import CenterScreen from "./components/CenterScreen";
import { Suspense } from "react";
import PublicLayout from "./components/layout/PublicLayout";
import PrivateLayout from "./components/layout/PrivateLayout";
import NotFound from "./components/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Test from "./pages/Test";
import TaskBuddy from "./pages/TaskBuddy";
import "./App.css";

const App = () => {
  const loadingUI = <CenterScreen><>Loading</></CenterScreen>
  let loading = false

  return (
    <>{loading ? loadingUI :
      <BrowserRouter>
        <Suspense fallback={loadingUI}>
          <Routes>
            <Route path="/auth" element={<PublicLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
            <Route path="/" element={<PrivateLayout />}>
              <Route index element={<TaskBuddy />} />
            </Route>
            <Route path="*" element={<NotFound />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </Suspense>
      </BrowserRouter>}
    </>
  );
};

export default App;
