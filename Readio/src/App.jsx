import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import AdminLayout from "./layouts/AdminLayout";

import UserMain from "./pages/user/UserMain";
import Login from "./pages/user/Login";
import Join from "./pages/user/Join";
import VerifyPwd from "./pages/user/VerifyPwd";
import UserEdit from "./pages/user/UserEdit";
import UserDelete from "./pages/user/UserDelete";
import UserDeleteComplete from "./pages/user/UserDeleteComplete";
import FindAccount, { FindIdForm, FindPwdForm } from "./pages/user/FindAccount";

import EventList from "./pages/serviceCenter/EventList.jsx";
import EventDetail from "./pages/serviceCenter/EventDetail.jsx";

import BookPage from "./pages/book/BookPage";
import NoticeList from "./pages/serviceCenter/NoticeList";
import QnaList from "./pages/serviceCenter/QnaList";
import QnaDetail from "./pages/serviceCenter/QnaDetail";
import QnaWriting from "./pages/serviceCenter/QnaWriting";
import Faq from "./pages/serviceCenter/Faq";
import Bookmark from "./pages/bookmark/bookmark";
import SearchVideoList from "./pages/searchList/SearchVideoList";
import SearchBookList from "./pages/searchList/SearchBookList";
import PlayVideo from "./pages/videoDetail/PlayVideo";
import MyLibraryPage from "./pages/mylibrary/mainpage/MyLibraryPage.jsx";
import MyLibraryGuestPage from "./pages/mylibrary/mainpage/MyLibraryGuestPage.jsx";
import EditProfilePage from "./pages/mylibrary/profile/EditProfilePage.jsx";
import InterestViewPage from "./pages/mylibrary/interest/InterestView.jsx";
import InterestEditPage from "./pages/mylibrary/interest/InterestEdit.jsx";
import CalendarPage from "./pages/mylibrary/calendar/CalendarPage.jsx";
import PostWriting from "./pages/post/PostWriting.jsx";
import PostWritingBook from "./pages/post/PostWritingBook";
import PostDetail from "./pages/post/PostDetail";
import FeedMain from "./pages/feed/FeedMain";
import FollowList from "./pages/mylibrary/follow/FollowList";
import PostList from "./pages/mylibrary/mypost/PostList";

import AdminMain from "./pages/admin/AdminMain";
import UserManagement from "./pages/admin/UserManagement";
import FilteringListPage from "./pages/admin/filtering/FilteringListPage";
import FilteringCreatePage from "./pages/admin/filtering/FilteringCreatePage";
import FilteringDetailPage from "./pages/admin/filtering/FilteringDetailPage";
import FilteringModifyPage from "./pages/admin/filtering/FilteringModifyPage";
import ReportedReviewListPage from "./pages/admin/reported/ReportedReviewListPage";
import ReportedReviewDetailPage from "./pages/admin/reported/ReportedReviewDetailPage";
import ReportedPostListPage from "./pages/admin/reported/ReportedPostListPage";
import ReportedPostDetailPage from "./pages/admin/reported/ReportedPostDetailPage";
import AdminNoticeList from "./pages/boardManagement/adminNoticeList";
import AdminNoticeWriting from "./pages/boardManagement/AdminNoticeWriting";
import AdminFaqList from "./pages/boardManagement/AdminFaqList";
import AdminFaqWriting from "./pages/boardManagement/AdminFaqWriting";
import AdminQnaList from "./pages/boardManagement/AdminQnaList";
import AdminQnaAnswer from "./pages/boardManagement/AdminQnaAnswer";
import AdminQnaDetail from "./pages/boardManagement/AdminQnaDetail";
import AdminEventList from "./pages/boardManagement/AdminEventList.jsx";
import AdminEventWriting from "./pages/boardManagement/AdminEventWriting.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* 사용자 페이지 */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<UserMain />} />
                    <Route path="login" element={<Login />} />
                    <Route path="users/join" element={<Join />} />
                    <Route path="users/verify-pwd" element={<VerifyPwd />} />
                    <Route path="users/edit" element={<UserEdit />} />
                    <Route path="users/delete" element={<UserDelete />} />
                    <Route path="users/delete/complete" element={<UserDeleteComplete />} />

                    {/* ─── 계정찾기 ───────────────────────────────────── */}
                    <Route path="find-account" element={<FindAccount />}>
                        <Route
                            index
                            element={<Navigate to="find-id" replace />}
                        />                                                        {/* ← 변경 */}
                        <Route path="find-id" element={<FindIdForm />} />        {/* ← 변경 */}
                        <Route path="find-pwd" element={<FindPwdForm />} />      {/* ← 변경 */}
                    </Route>                                                   {/* ← 중첩 해제 */}

                    {/* ─── 이벤트 (사용자) ───────────────────────────────── */}
                    <Route path="event" element={<EventList />} />             {/* ← 변경: relative path */}
                    <Route path="event/detail" element={<EventDetail />} />    {/* ← 변경: relative path */}

                    {/* ─── 기타 페이지 ───────────────────────────────────── */}
                    <Route path="bookPage" element={<BookPage />} />
                    <Route path="notice" element={<NoticeList />} />
                    <Route path="qna" element={<QnaList />} />
                    <Route path="qna/detail" element={<QnaDetail />} />
                    <Route path="qna/writing" element={<QnaWriting />} />
                    <Route path="faq" element={<Faq />} />
                    <Route path="bookmark" element={<Bookmark />} />
                    <Route path="search/video" element={<SearchVideoList />} />
                    <Route path="search/book" element={<SearchBookList />} />
                    <Route path="video" element={<PlayVideo />} />
                    <Route path="mylibrary" element={<MyLibraryPage />} />
                    <Route path="guestlibrary" element={<MyLibraryGuestPage />} />
                    <Route path="mylibrary/profile" element={<EditProfilePage />} />
                    <Route path="mylibrary/interest" element={<InterestViewPage />} />
                    <Route path="mylibrary/interest/edit" element={<InterestEditPage />} />
                    <Route path="mylibrary/calendar" element={<CalendarPage />} />
                    <Route path="post/writing" element={<PostWriting />} />
                    <Route path="post/writing/book" element={<PostWritingBook />} />
                    <Route path="post" element={<PostDetail />} />
                    <Route path="feed" element={<FeedMain />} />
                    <Route path="mylibrary/follow" element={<FollowList />} />
                    <Route path="mylibrary/postlist" element={<PostList />} />
                </Route>

                {/* 관리자 페이지 */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminMain />} />
                    <Route path="users/list" element={<UserManagement />} />
                    <Route path="filtering/list" element={<FilteringListPage />} />
                    <Route path="filtering/create" element={<FilteringCreatePage />} />
                    <Route path="filtering/detail" element={<FilteringDetailPage />} />
                    <Route path="filtering/modify" element={<FilteringModifyPage />} />
                    <Route path="reported/review/list" element={<ReportedReviewListPage />} />
                    <Route path="reported/review/detail" element={<ReportedReviewDetailPage />} />
                    <Route path="reported/post/list" element={<ReportedPostListPage />} />
                    <Route path="reported/post/detail" element={<ReportedPostDetailPage />} />
                    <Route path="notice" element={<AdminNoticeList />} />
                    <Route path="notice/writing" element={<AdminNoticeWriting />} />
                    <Route path="faq" element={<AdminFaqList />} />
                    <Route path="faq/writing" element={<AdminFaqWriting />} />
                    <Route path="qna" element={<AdminQnaList />} />
                    <Route path="qna/answer" element={<AdminQnaAnswer />} />
                    <Route path="qna/detail" element={<AdminQnaDetail />} />
                    <Route path="event" element={<AdminEventList />} />      {/* ← 변경: /admin/event */}
                    <Route path="event/writing" element={<AdminEventWriting />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;
