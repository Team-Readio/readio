import React, { useState } from 'react';
import JoinCSS from './Join.module.css';

function Join() {

    // 약관 동의 상태 관리 _토글 기능
    const [isTermsVisible, setIsTermsVisible] = useState(false);
    // 토글 핸들러
    const toggleTerms = () => setIsTermsVisible(!isTermsVisible);

    // 약관 동의 상태 관리 _모달 기능
    const [isPrivacyModalOpen, setPrivacyModalOpen] = useState(false);
    // 모달 핸들러
    const openModal = () => setPrivacyModalOpen(true);
    const closeModal = () => setPrivacyModalOpen(false);


    return (
        <div className={JoinCSS.joinPage}>
            {/* 회원정보 입력 */}
            <section className={JoinCSS.formSection}>
                <h2 className={JoinCSS.sectionTitle}>회원정보 입력 <span className={JoinCSS.required}>(필수)</span></h2>
                <hr className={JoinCSS.divider} />

                <div className={JoinCSS.formGroup}>
                    <label>이름</label>
                    <input type="text" placeholder="이름을 입력하세요" />
                </div>
                <div className={JoinCSS.formGroup}>
                    <label>아이디</label>
                    <input type="text" placeholder="아이디를 입력하세요" />
                    <button type="button" className={JoinCSS.checkBtn}>중복확인</button>
                </div>
                <div className={JoinCSS.formGroup}>
                    <label>비밀번호</label>
                    <input type="password" placeholder="비밀번호 입력" />
                </div>
                <div className={JoinCSS.formGroup}>
                    <label>비밀번호 확인</label>
                    <input type="password" placeholder="비밀번호 확인" />
                </div>
                <div className={JoinCSS.formGroup}>
                    <label>이메일</label>
                    <input type="email" placeholder="이메일을 입력하세요" />
                    <button type="button" className={JoinCSS.checkBtn}>중복확인</button>
                </div>
                <div className={JoinCSS.formGroup}>
                    <label>휴대폰 번호</label>
                    <input type="phone" placeholder="휴대폰 번호 입력" />
                    <button type="button" className={JoinCSS.checkBtn}>중복확인</button>
                </div>
                <div className={JoinCSS.formGroup}>
                    <label>생년월일</label>
                    <input type="date" />
                </div>
            </section>

            <hr className={JoinCSS.divider} />
            {/* 약관동의 */}
            <section className={JoinCSS.termsSection}>
                <h2 className={JoinCSS.sectionTitle}>약관동의</h2>

                <div className={JoinCSS.termsItem}>
                    <div className={JoinCSS.checkboxRow}>
                        <label>
                            <input type="checkbox" /> [필수] 이용약관 동의
                        </label>
                    </div>
                    <button type="button" className={JoinCSS.toggleBtn} onClick={toggleTerms}>
                        {isTermsVisible ? '약관 숨기기' : '약관 보기'}
                    </button>
                    {isTermsVisible && (
                        <div className={JoinCSS.termsContent}>
                            <p>이용약관 내용이 여기에 들어갑니다. 간략하게 작성된 예시입니다.</p>
                        </div>
                    )}
                </div>

                <div className={JoinCSS.checkboxGroup}>
                    <label><input type="checkbox" /> [필수] 개인정보 수집 및 이용 동의</label>
                    <button type="button" onClick={openModal} className={JoinCSS.modalBtn}>
                        자세히 보기
                    </button>
                </div>

                {isPrivacyModalOpen && (
                    <div className={JoinCSS.modalOverlay}>
                        <div className={JoinCSS.modalContent}>
                            <h3>개인정보 수집 및 이용 동의</h3>
                            <div className={JoinCSS.modalBody}>
                                <p>본인은 개인정보 수집 및 이용에 동의합니다. 수집 항목은 이름, 이메일, 휴대폰번호 등이며, 목적은 회원관리입니다.</p>
                                <p>보관 기간은 서비스 탈퇴 시까지입니다.</p>
                            </div>
                            <button onClick={closeModal} className={JoinCSS.closeBtn}>닫기</button>
                        </div>
                    </div>
                )}

                <div className={JoinCSS.checkboxGroup}>
                    <label><input type="checkbox" /> [선택] 마케팅 정보 수신 동의</label>
                </div>

                <div className={JoinCSS.checkboxGroup}>
                    <label><input type="checkbox" /> [선택] 제3자 정보 제공 동의</label>
                </div>
            </section>

            <div className={JoinCSS.submitBtnWrap}>
                <button type="submit" className={JoinCSS.submitBtn}>동의하고 가입하기</button>
            </div>
        </div>
    );
}
export default Join;