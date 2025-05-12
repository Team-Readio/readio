import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Layout from './layouts/Layout';
import PostWriting from "./pages/post/PostWriting";
import FindAccount, { FindIdForm, FindPwdForm } from "./pages/user/FindAccount";
import Join from "./pages/user/Join";
import JoinComplete from "./pages/user/JoinComplete";
import Login from "./pages/user/Login";
import NoticeList from './pages/user/NoticeList';
import UserMain from "./pages/user/UserMain";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<UserMain />} />

            <Route path="/notice" element={<NoticeList />} />
            <Route path="post/writing" element={<PostWriting />} />
            <Route path="/login" element={<Login />} /> {/* 로그인 */}
            <Route path="/join" element={<Join />} /> {/* 회원가입 */}
            <Route path="/join/complete" element={<JoinComplete />} /> {/* 회원가입 완료 */}

            <Route path="/find-account" element={<FindAccount />}>
              <Route index element={<Navigate to="find-id" replace />} />   {/* 기본 페이지-아이디찾기 */}
              <Route path="find-id" element={<FindIdForm />} />             {/* 아이디 찾기 */}
              <Route path="find-pwd" element={<FindPwdForm />} />           {/* 비밀번호 찾기 */}
              <Route path="account/suspended" element={<AccountSuspended />} />

            </Route>
          </Route>
        </Routes>
      </BrowserRouter >
    </>
  );
}

export default App;