import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from './EditProfilePage.module.css';
import xIcon from '../../../assets/x.png';
import { useNavigate } from 'react-router-dom';


const EditProfilePage = () => {
    const navigate = useNavigate();
    const [previewImg, setPreviewImg] = useState(null);
    const fileInputRef = useRef(null);
    const [nickname, setNickname] = useState('');
    const [bio, setBio] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const handleImageClick = () => fileInputRef.current.click();
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("accessToken");


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setPreviewImg(URL.createObjectURL(file));
    };

    const handleImageDelete = async () => {
        try {
            await axios.delete(`/api/user/profile/image/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setPreviewImg(null);
            fileInputRef.current.value = null;
        } catch (err) {
            console.error('이미지 삭제 실패:', err);
        }
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('userId', userId);  // 실제 로그인 사용자 ID로 교체
        formData.append('penName', nickname);
        formData.append('biography', bio);
        formData.append('isPrivate', isPublic ? 'PUBLIC' : 'PRIVATE');
        if (fileInputRef.current?.files[0]) {
            formData.append('image', fileInputRef.current.files[0]);
        }

        try {
            await axios.post('http://localhost:8080/api/user/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
                navigate('/mylibrary'); // 저장 후 이동
            }, 1000);
        } catch (err) {
            alert('프로필 저장에 실패했습니다.');
            console.error(err);
        }
    };


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/user/profile/${userId}`,{
                    headers:{
                        Authorization: `Bearer ${token}`,
                    }
                });
                const data = res.data;
                setNickname(data.penName);
                setBio(data.biography || '');
                setIsPublic(data.isPrivate === 'PUBLIC');
                if (data.imageUrl) {
                    setPreviewImg(`http://localhost:8080${data.imageUrl}`);
                }
            } catch (err) {
                console.error('프로필 조회 실패:', err);
            }
        };
        fetchProfile();
    }, [userId]);


    return (
        <div className={styles.section}>
            <h2 className={styles.title} onClick={()=>navigate('/mylibrary')} style={{ cursor: 'pointer' }}>
                &lt; 프로필 편집</h2>
            <div className={styles.profileCard}>
                <div className={styles.profileImageWrapper}>
                    {previewImg ? (
                        <img src={previewImg} alt="프로필" className={styles.profileImage} />
                    ) : (
                        <div className={styles.defaultProfile}></div>
                    )}

                    <div className={styles.imageBtns}>
                        <button onClick={handleImageClick} className={styles.imageBtn}>사진 수정</button>
                        <button onClick={handleImageDelete} className={styles.imageBtn}>사진 삭제</button>
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>

                <label className={styles.label}>*필명</label>
                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        className={styles.input}
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    {nickname && (
                        <img
                            src={xIcon}
                            alt="지우기"
                            className={styles.clearIcon}
                            onClick={() => setNickname('')}
                        />
                    )}
                </div>
                <p className={styles.helperText}>이모지, 특수문자는 입력이 불가합니다.</p>

                <label className={styles.label}>서재 소개</label>
                <textarea
                    className={styles.textarea}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
                <p className={styles.helperText}>
                    필명은 readio에서 보이는 나의 활동명이에요. <br />
                    나를 나타내는 프로필 사진과 필명을 설정해 보세요.
                </p>
                <label className={styles.label}>*공개 서재</label>
                <div className={styles.publicToggleWrapper}>
                      <span className={styles.publicText}>
                          {isPublic ? '서재가 공개 상태 입니다.' : '서재가 비공개 상태 입니다.'}
                      </span>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={isPublic}
                            onChange={() => setIsPublic(!isPublic)}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>
                <ul className={styles.helperText}>
                    <li>서재 비공개 상태에서는 회원님의 관심분야(영상, 책)가 다른 회원에게 보이지 않습니다.</li>
                    <li>단, 포스트와 리뷰는 공개/비공개 설정 상관없이 노출됩니다.</li>
                </ul>
            </div>
            <div className={styles.saveButtonWrapper}>
                <button className={styles.saveButton} onClick={handleSave}>
                    저장

                </button>
            </div>
            {showPopup && (
                <div className={styles.showPopup}>
                    변경사항이 저장되었습니다.
                </div>
            )}
        </div>
    );
};

export default EditProfilePage;