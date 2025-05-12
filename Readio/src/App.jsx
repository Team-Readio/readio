import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './layouts/Layout';
import PostWriting from "./pages/post/PostWriting";
import AccountSuspended from "./pages/user/AccountSuspended";
import UserMain from "./pages/user/UserMain";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<UserMain />} />

            <Route path="post/writing" element={<PostWriting />} />
            <Route path="account/suspended" element={<AccountSuspended/>}/>   {/* 계정정지 안내 */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
