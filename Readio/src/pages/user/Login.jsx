import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import loginImage from '../../assets/login.png';
import { loginSuccess } from '../../modules/user/userSlice';
import LoginCSS from './Login.module.css';

const Login = () => {

    useEffect(() => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init('f0f08986cddfa65010a8f738624ce0fc'); // 🔑 여기에 본인의 키 입력
            console.log('Kakao SDK initialized');
        }
    }, []);

    // 카카오 로그인 함수
    const handleKakaoLogin = () => {
        if (!window.Kakao) return;

        window.Kakao.Auth.login({
            scope: 'profile_nickname', // 원하는 동의항목 추가
            success: function (authObj) {
                console.log('카카오 로그인 성공!', authObj);

                // 액세스 토큰을 백엔드로 전달
                fetch("http://localhost:8080/users/kakao", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        accessToken: authObj.access_token
                    }),
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log("백엔드 로그인 응답:", data);

                        // 이후 로컬 상태 저장, 리다이렉트 처리 등 동일하게
                        sessionStorage.setItem("accessToken", data.accessToken);
                        sessionStorage.setItem("userInfo", JSON.stringify({
                            userId: data.userId,
                            userName: data.userName,
                            userRole: data.userRole,
                        }));

                        dispatch(loginSuccess({
                            userId: data.userId,
                            userName: data.userName,
                            userRole: data.userRole,
                            isLoggedIn: true,
                            accessToken: data.accessToken,
                        }));

                        if (data.userRole === "ADMIN") {
                            navigate("/admin");
                        } else {
                            navigate("/");
                        }
                    })
                    .catch(err => {
                        console.error("카카오 로그인 처리 중 오류:", err);
                        alert("카카오 로그인 실패");
                    });
            },
            fail: function (err) {
                console.error('카카오 로그인 실패', err);
                alert("카카오 로그인 실패");
            }
        });
    };


    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 정상작동 
        try {
            const response = await fetch("http://localhost:8080/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
                // credentials: "include" // 쿠키를 포함하여 요청
            });

            if (!response.ok) {
                let errorMessage = "로그인 실패";
                let errorData = null;

                try {
                    errorData = await response.json();
                    if (errorData && errorData.message) {
                        errorMessage = errorData.message;
                    }

                } catch {

                }
                throw new Error(errorMessage);
            }

            const data = await response.json();

            console.log("로그인 응답 data:", data);

            // 이거 있어야 로그인 가능 ? localStorage에 직접 정보 저장 (여기서 저장하는 것이 가장 명확)
            // localStorage.setItem("accessToken", data.accessToken);
            // localStorage.setItem("userId", data.userId); // 로그인한 사용자 ID 저장
            // localStorage.setItem("userName", data.userName); // 로그인한 사용자 이름 저장
            // localStorage.setItem("isPasswordVerified", "true"); // 비밀번호 검증 플래그 설정

            const userInfoResponse = await fetch("http://localhost:8080/users/me", {
                headers: {
                    "Authorization": `Bearer ${data.accessToken}`,   //토큰
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            console.log("user/me 토큰:", data.accessToken)

            if (!userInfoResponse.ok) {
                throw new Error("사용자 정보 조회 실패");
            }

            const userInfo = await userInfoResponse.json();
            console.log("userInfo:", userInfo);

            const roles = userInfo.userRole || []; // roles: ["USER"], ["ADMIN"], ["SUSPENDED"]
            console.log("userInfo.role:", userInfo.userRole)

            dispatch(loginSuccess({
                userId: userInfo.userId, // 백엔드 응답 필드명 확인 (userID 또는 userId)
                userName: userInfo.userName,
                userRole: userInfo.userRole,
                isLoggedIn: true,
                accessToken: data.accessToken, // 로그인 상태를 true로 설정
            }));

            // 로그인 상태 저장
            sessionStorage.setItem("accessToken", data.accessToken);
            sessionStorage.setItem("userInfo", JSON.stringify({
                userId: userInfo.userId,
                userName: userInfo.userName,
                userRole: userInfo.userRole,
            }));

            // 권한별 페이지로 이동
            if (roles.includes("ADMIN")) {
                navigate("/admin");
            } else if (roles.includes("SUSPENDED")) {
                navigate("/account/suspended");
            } else {
                navigate("/");
            }

        } catch (error) {
            alert(error.message || "로그인에 실패했습니다.");
            console.log("로그인 에러:", error);
        }
        console.log(formData);
    };


    return (
        <div className={LoginCSS.loginPage} style={{ backgroundImage: `url(${loginImage})` }}>
            <div className={LoginCSS.formContainer}>
                <h1 className={LoginCSS.companyName}>Readio :</h1>
                <div className={LoginCSS.description}>
                    "오늘 당신에게 필요한 한 문장은 무엇인가요?
                    <br />
                    readio에서 당신만의 이야기를 찾아보세요.
                    "
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={LoginCSS.inputGroup}>
                        <label htmlFor="username">아이디</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="아이디를 입력하세요"
                            required
                        />
                    </div>

                    <div className={LoginCSS.inputGroup}>
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="비밀번호를 입력하세요"
                            required
                        />
                    </div>

                    <button type="submit" className={LoginCSS.submitBtn}>로그인</button>


                    <div className={LoginCSS.findLinks}>
                        <Link to="/account">아이디 찾기</Link>
                        <span className={LoginCSS.divider}>|</span>
                        <Link to="/account/findPwd">비밀번호 찾기</Link>
                    </div>

                    {/* <button
                        type="button"
                        onClick={handleKakaoLogin}
                        className={LoginCSS.kakaoBtn}
                    /> */}
                    
                    <form style={{ textAlign: 'left' }}>
                        <button
                            type="button"
                            onClick={handleKakaoLogin}
                            style={{
                                border: 'none',
                                background: 'none',
                                padding: 0,
                                cursor: 'pointer'
                            }}
                        >
                            <img
                                src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"
                                alt="카카오 로그인"
                                style={{ width: '30px', height: '30px' }}
                            />
                        </button>
                    </form>

                </form>
            </div>
        </div>

    );
};
export default Login;