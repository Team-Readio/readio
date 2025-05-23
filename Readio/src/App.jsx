
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Layout from './layouts/Layout';
import AdminQnaList from "./pages/admin/AdminQnaList";
import Login from "./pages/user/Login";
import UserMain from "./pages/user/UserMain";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
          <Route index element={<UserMain/>}/>
        <Route path="users/login" element={<Login />} /> {/* 로그인 */}
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
          <Route path="/admin/qna" element={<AdminQnaList />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;