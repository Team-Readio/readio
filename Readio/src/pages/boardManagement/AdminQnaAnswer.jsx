import styles from './AdminQnaAnswer.module.css';
function AdminQnaAnswer() {
    return (
        <>
        <div className={styles.main}>
        <div className={styles.bigContainer}>
            <div className={styles.smallHeader}>
                <span className={styles.smallHeaderElement}>Q&A</span>
            </div>
            <div className={styles.line}></div>
            <div>
                <p>Q&A테스트입니다.</p>
                <div className={styles.whoWhen}>
                    <span className={styles.userName}>user1</span>
                    <span className={styles.createdAt}>2025-05-13</span>
                </div>
                <div className={styles.line2}></div>
            </div>
            <div className={styles.question}>
                <p>테스트중입니다.</p>
            </div>
            <div className={styles.answerBox}>
                <p className={styles.answerTitle}>답변</p>
                <div className={styles.line2}></div>
            </div>
            <textarea className={styles.textarea} placeholder="내용을 입력해주세요" />

            <div className={styles.bottom}>
                <div className={styles.actionButtons}>
                    <button className={styles.submit}>등록</button>
                    <button className={styles.cancel}>취소</button>
                </div>
            </div>
         </div>
         </div>
        </>
    );
}

export default AdminQnaAnswer;
