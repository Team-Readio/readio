import { useEffect, useState } from "react";
import BookReviewCSS from "./BookReview.module.css";
// JWT 토큰 디코딩 라이브러리 임포트 (예시, 실제 설치 필요: npm install jwt-decode)
// import { jwtDecode } from 'jwt-decode'; // jwt-decode 라이브러리를 사용한다면 주석 해제

// 좋아요 이미지 (예시 경로, 실제 경로로 대체 필요)
import heartIcon from '../../assets/likes2.png'; // 좋아요 아이콘 (빈)
import filledHeartIcon from '../../assets/likes.png'; // 좋아요 아이콘 (꽉 찬)

function BookReview({ bookIsbn, isLoggedIn, getAuthToken, onReviewsLoaded }) {
    const [reviewContent, setReviewContent] = useState('');
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [reviewsError, setReviewsError] = useState(null);

    // 현재 로그인된 사용자의 userId 상태 추가
    const [currentLoggedInUserId, setCurrentLoggedInUserId] = useState(null);

    // --- 디버깅 로그 추가 (최종 배포 시 제거 권장) ---
    console.log("BookReview rendered. isLoggedIn:", isLoggedIn);
    console.log("BookReview rendered. currentLoggedInUserId (before useEffect):", currentLoggedInUserId);
    // --- ------------- ---

    // 리뷰 목록을 불러오는 함수
    const fetchReviews = async () => {
        setLoadingReviews(true);
        setReviewsError(null);
        try {
            console.log(`[BookReview.jsx] 리뷰 목록 조회 시작: bookIsbn=${bookIsbn}`);
            const reviewsRes = await fetch(`http://localhost:8080/bookReview/${bookIsbn}`);
            if (!reviewsRes.ok) {
                throw new Error(`리뷰 목록을 불러오는 데 실패했습니다: ${reviewsRes.status} ${reviewsRes.statusText}`);
            }
            const responseData = await reviewsRes.json();
            const actualReviews = responseData.data || responseData;
            
            // createdAt이 LocalDateTime -> ISO String으로 오므로 Date 객체로 변환
            const formattedReviews = actualReviews.map(review => ({
                ...review,
                createdAt: new Date(review.createdAt)
            }));

            setReviews(formattedReviews);
            console.log("[BookReview.jsx] 리뷰 목록 로딩 성공:", formattedReviews);
            // --- ✨ 추가된 디버깅 로그 ✨ ---
            formattedReviews.forEach(review => {
                console.log(`DEBUG_FE: Review ID ${review.reviewId}, isLiked received: ${review.isLiked}, likesCount received: ${review.likesCount}`);
            });
            // -----------------------------

            if (onReviewsLoaded) {
                onReviewsLoaded(formattedReviews.length); // 부모 컴포넌트로 리뷰 개수 전달
            }

        } catch (err) {
            setReviewsError(err.message);
            console.error("[BookReview.jsx] 리뷰 목록 로딩 중 오류 발생:", err);
        } finally {
            setLoadingReviews(false);
        }
    };

    // 컴포넌트 마운트 시, 또는 bookIsbn/getAuthToken 변경 시 리뷰 목록 및 사용자 정보 로드
    useEffect(() => {
        const loadReviewsAndUser = async () => {
            // 사용자 정보 설정
            const token = getAuthToken(); // 이 함수가 isLoggedIn 상태도 업데이트합니다.
            if (token) {
                try {
                    // JWT 토큰 파싱 라이브러리를 사용한다면 아래 주석 해제 (npm install jwt-decode 필요)
                    // const decodedToken = jwtDecode(token);
                    // 직접 디코딩 (base64)
                    const decodedToken = JSON.parse(atob(token.split('.')[1]));
                    setCurrentLoggedInUserId(decodedToken.sub);
                    console.log("[BookReview.jsx] 로그인된 사용자 ID (토큰 디코딩 - decodedToken.sub):", decodedToken.sub);
                } catch (e) {
                    console.error("JWT 토큰 디코딩 실패 또는 토큰 형식 오류:", e);
                    setCurrentLoggedInUserId(null);
                }
            } else {
                setCurrentLoggedInUserId(null);
            }
            
            // 리뷰 목록 불러오기
            fetchReviews();
        };

        if (bookIsbn) {
            loadReviewsAndUser();
        }
    }, [bookIsbn, getAuthToken]);


    // 리뷰 내용 변경 핸들러
    const handleReviewContentChange = (e) => {
        setReviewContent(e.target.value);
    };

    // 리뷰 작성 버튼 클릭 핸들러
    const handleReviewSubmit = async () => {
        const token = getAuthToken();
        if (!token) {
            alert("로그인 후 리뷰를 작성할 수 있습니다.");
            return;
        }
        if (!reviewContent.trim()) {
            alert("리뷰 내용을 입력해주세요.");
            return;
        }

        try {
            console.log("[BookReview.jsx] 리뷰 작성 시도:", { bookIsbn, reviewContent });
            const res = await fetch('http://localhost:8080/bookReview/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    bookIsbn: bookIsbn,
                    reviewContent: reviewContent
                })
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`리뷰 작성 실패: ${res.status} ${errorText}`);
            }

            alert("리뷰가 성공적으로 등록되었습니다.");
            setReviewContent('');
            fetchReviews(); // 리뷰 등록 성공 후 목록 새로고침

        } catch (err) {
            setReviewsError(err.message);
            alert(`리뷰 작성 중 오류 발생: ${err.message}`);
            console.error("[BookReview.jsx] 리뷰 작성 중 오류 발생:", err);
        }
    };

    // 날짜 포맷 함수 (YYYY. MM. DD 형식)
    const formatReviewDate = (dateObj) => {
        if (!(dateObj instanceof Date) || isNaN(dateObj)) return '';
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}. ${month}. ${day}`;
    };

    // 좋아요 버튼 클릭 핸들러 (수정)
    const handleLikeClick = async (reviewId) => {
        const token = getAuthToken();
        if (!token) {
            alert("로그인 후 좋아요를 누를 수 있습니다.");
            return;
        }
        
        // ✨ 중요: 'prevReviews' 콜백 함수를 사용하여 최신 상태를 기반으로 'reviewToToggle'을 찾습니다. ✨
        // 이렇게 하면 클로저 문제로 인한 stale closure (오래된 reviews 상태 참조)를 방지할 수 있습니다.
        let currentIsLiked = false;
        setReviews(prevReviews => {
            const reviewToUpdate = prevReviews.find(r => r.reviewId === reviewId);
            if (reviewToUpdate) {
                currentIsLiked = reviewToUpdate.isLiked; // API 호출에 사용할 현재 isLiked 값 저장
                return prevReviews.map(review => {
                    if (review.reviewId === reviewId) {
                        return {
                            ...review,
                            isLiked: !review.isLiked, // UI에서 좋아요 상태 토글
                            likesCount: review.isLiked ? review.likesCount - 1 : review.likesCount + 1 // UI에서 좋아요 수 업데이트
                        };
                    }
                    return review;
                });
            }
            return prevReviews; // 해당 리뷰를 찾지 못했으면 이전 상태 유지
        });
        
        // ✨ API 호출은 'currentIsLiked' 값을 사용합니다.
        // 이는 setReviews가 동기적으로 완료되지 않아도 정확한 이전 상태를 나타냅니다. ✨
        try {
            console.log(`DEBUG_FE_CLICK: Review ID ${reviewId}, currentIsLiked (determined for API call): ${currentIsLiked}`);

            let res;
            if (currentIsLiked) { // UI 업데이트 직전의 isLiked 상태가 true였다면 (좋아요 해제)
                console.log(`[BookReview.jsx] 좋아요 해제 시도 (DELETE): reviewId=${reviewId}`);
                res = await fetch(`http://localhost:8080/bookReview/${reviewId}/like`, { 
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } else { // UI 업데이트 직전의 isLiked 상태가 false였다면 (좋아요 등록)
                console.log(`[BookReview.jsx] 좋아요 등록 시도 (POST): reviewId=${reviewId}`);
                res = await fetch(`http://localhost:8080/bookReview/${reviewId}/like`, { 
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }

            if (!res.ok) {
                const errorText = await res.text();
                // 서버에서 오류가 발생하면 UI 상태를 원래대로 되돌림 (여기서는 다시 fetchReviews로 동기화)
                // setReviews(originalReviews); // <-- 이 부분은 fetchReviews가 처리하게 합니다.
                throw new Error(`좋아요 처리 실패: ${res.status} ${errorText}`);
            }

            // API 호출 성공 후, 서버로부터 최신 상태를 가져와 최종 동기화
            // 이 호출이 성공적으로 완료되면 UI는 서버의 확정된 상태와 일치하게 됩니다.
            fetchReviews(); 

        } catch (err) {
            alert(`좋아요 처리 중 오류 발생: ${err.message}`);
            console.error("[BookReview.jsx] 좋아요 처리 오류:", err);
            // 오류 발생 시, fetchReviews를 다시 호출하여 UI를 서버의 원래 상태로 되돌립니다.
            fetchReviews(); 
        }
    };

    // 신고 버튼 클릭 핸들러
    const handleReportClick = async (reviewId) => {
        const token = getAuthToken();
        if (!token) {
            alert("로그인 후 리뷰를 신고할 수 있습니다.");
            return;
        }

        if (window.confirm("이 리뷰를 신고하시겠습니까?")) {
            try {
                const res = await fetch(`http://localhost:8080/bookReview/${reviewId}/report`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`신고 실패: ${res.status} ${errorText}`);
                }
                alert("리뷰가 신고되었습니다.");
                fetchReviews();
            } catch (err) {
                alert(`신고 처리 중 오류 발생: ${err.message}`);
                console.error("[BookReview.jsx] 신고 처리 오류:", err);
            }
        }
    };

    // 리뷰 삭제 핸들러
    const handleDeleteClick = async (reviewId, reviewerUserId) => {
        const token = getAuthToken();
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        // 현재 로그인된 사용자가 리뷰 작성자인지 확인
        if (currentLoggedInUserId !== reviewerUserId) {
            alert("자신이 작성한 리뷰만 삭제할 수 있습니다.");
            return;
        }

        if (window.confirm("이 리뷰를 삭제하시겠습니까?")) {
            try {
                console.log(`[BookReview.jsx] 리뷰 삭제 시도: ID ${reviewId}`);
                const res = await fetch(`http://localhost:8080/bookReview/delete/${reviewId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`리뷰 삭제 실패: ${res.status} ${errorText}`);
                }

                alert("리뷰가 삭제되었습니다.");
                fetchReviews(); // 삭제 후 리뷰 목록 새로고침

            } catch (err) {
                alert(`리뷰 삭제 중 오류 발생: ${err.message}`);
                console.error("[BookReview.jsx] 리뷰 삭제 중 오류 발생:", err);
            }
        }
    };


    if (loadingReviews) return <div className={BookReviewCSS.reviewWriteContainer}>리뷰 로딩 중...</div>;
    if (reviewsError) return <div className={BookReviewCSS.reviewWriteContainer}>리뷰 로딩 오류: {reviewsError}</div>;

    return (
        <div className={BookReviewCSS.reviewWriteContainer}>
            <p className={BookReviewCSS.infoBold}>리뷰</p>
            <div className={BookReviewCSS.rating}>
                {/* 별점 기능이 있다면 여기에 추가 */}
            </div>
            <div className={BookReviewCSS.reviewInput}>
                {isLoggedIn ? (
                    <>
                        <textarea
                            className={BookReviewCSS.writeInput}
                            placeholder="리뷰 내용을 입력하세요."
                            value={reviewContent}
                            onChange={handleReviewContentChange}
                        />
                        <button className={BookReviewCSS.writeButton} onClick={handleReviewSubmit}>
                            작성
                        </button>
                    </>
                ) : (
                    <textarea
                        className={BookReviewCSS.writeInput}
                        placeholder="로그인 후 리뷰를 작성할 수 있습니다."
                        disabled
                    />
                )}
            </div>

            {/* 리뷰 목록 표시 */}
            {reviews.length === 0 ? (
                <p>아직 작성된 리뷰가 없습니다.</p>
            ) : (
                reviews.map((review) => (
                    <div key={review.reviewId} className={BookReviewCSS.review}>
                        <div className={BookReviewCSS.reviewHeader}>
                            <div className={BookReviewCSS.reviewerInfo}>
                                <p className={BookReviewCSS.reviewInfoFont1}>
                                    {/* penName이 없으면 profileId 또는 userId로 대체 */}
                                    {review.penName ? review.penName : (review.profileId ? `User_${review.profileId}` : '익명')}의 리뷰
                                </p>
                                <p className={BookReviewCSS.reviewInfoFont2}>
                                    {formatReviewDate(review.createdAt)}
                                </p>
                            </div>
                            <div className={BookReviewCSS.reviewBtBox}>
                                {/* 좋아요 버튼 */}
                                <button className={BookReviewCSS.reviewBt} onClick={() => handleLikeClick(review.reviewId)}>
                                    <img 
                                        className={BookReviewCSS.likes} 
                                        src={review.isLiked ? filledHeartIcon : heartIcon} // <-- 좋아요 상태에 따라 이미지 변경
                                        alt="Likes" 
                                    />
                                    {review.likesCount} {/* <-- 실제 좋아요 수 표시 */}
                                </button>
                                {/* 신고하기 버튼 */}
                                <button className={BookReviewCSS.reviewBt} onClick={() => handleReportClick(review.reviewId)}>
                                    신고하기
                                </button>
                                {/* --- 삭제 버튼 (조건부 렌더링) --- */}
                                {console.log(`Review ID: ${review.reviewId}, Reviewer: ${review.reviewerUserId}, Current User: ${currentLoggedInUserId}, Condition: ${isLoggedIn && currentLoggedInUserId === review.reviewerUserId}`)} {/* <-- 각 리뷰별 조건 확인 로그 */}
                                {isLoggedIn && currentLoggedInUserId === review.reviewerUserId && (
                                    <button
                                        className={BookReviewCSS.reviewBt}
                                        onClick={() => handleDeleteClick(review.reviewId, review.reviewerUserId)}
                                    >
                                        삭제
                                    </button>
                                )}
                                {/* --- ----------- --- */}
                            </div>
                        </div>
                        <div className={BookReviewCSS.reviewContent}>
                            <p>{review.reviewContent}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default BookReview;