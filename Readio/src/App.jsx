import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './layouts/Layout';
import Join from "./pages/user/Join";
import JoinComplete from './pages/user/JoinComplete';
import Login from "./pages/user/Login";
import UserMain from "./pages/user/UserMain";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* 메인 페이지, 사용자 페이지 */}
          <Route path="/" element={<Layout />}>
            <Route index element={<UserMain />} />
            <Route path="users/login" element={<Login />} />                     {/* 로그인 */}
            <Route path="users/join" element={<Join />} />                       {/* 회원가입 */}
            <Route path="users/join/complete" element={<JoinComplete/>} />       {/* 회원가입완료 */}
          </Route>
          
        </Routes>
      </BrowserRouter >
    </>
  );
}

export default App;
