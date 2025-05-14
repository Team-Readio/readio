import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './layouts/Layout';
import UserMain from "./pages/user/UserMain";
import PostWriting from "./pages/post/PostWriting";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
          <Route index element={<UserMain/>}/>
          <Route path="post/writing" element={<PostWriting/>}/>
        </Route>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
