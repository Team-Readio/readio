import CurationCSS from "./Curation.module.css";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {callAllCurationTypesAndKeywordsAPI, callUpdateAllAPI} from "../../apis/CurationAPICalls.js";
import {useNavigate} from "react-router-dom";

function CurationManager() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const curation = useSelector(state => state.curation);
    const [keywordsType, setKeywordsType] = useState({});
    const [keywords, setKeywords] = useState([{}]);
    const [id, setId] = useState(0);
    const [typeId, setTypeId] = useState(-1);

    const onChangeSelect = (e) => {
        setTypeId(Number(e.target.value));
    }

    const CreateKeyword = () => {
        if (keywords.length < 30) {
            setKeywords(prev => [...prev, {orderNum: id, keyword: '', typeId: typeId, isUnsaved: true}]);
            setId(id + 1);
        } else {
            alert('더 이상 추가할 수 없습니다');
        }
    }

    const onChangeHandler = (e) => {
        const text = e.target.value;
        setKeywordsType(prev => ({
            ...prev, type: {
                ...prev.type, typeText: text
            }
        }));
    };

    const enterKeyword = (e, orderNum) => {
        setKeywords(prev => prev.map(word => word.orderNum === orderNum ? {
            ...word, orderNum: id, keyword: e.target.value, typeId: typeId, isUnsaved: false
        } : word));
    }

    const deleteKeyword = (num) => {
        setKeywords(prev => prev.filter(keyword => keyword.orderNum !== num));
    }

    // 맨 처음
    useEffect(() => {
        dispatch(callAllCurationTypesAndKeywordsAPI());
        setId(0);
        setKeywordsType(curation.type[0]?.type);
        const savedKeywords = curation.keywords?.map((word, index) => ({
            orderNum: index, keyword: word.keyword, isUnsaved: false, typeId: word.typeId
        }));
        setKeywords(savedKeywords);
        setId(savedKeywords?.length);
    }, []);

    // 타입이 변할 때마다
    useEffect(() => {
        setKeywords([]);
        setId(0);
        setKeywordsType(curation.type[typeId - 1]);
        const savedKeywords = curation.keywords[typeId - 1]?.keywords.map((word, index) => ({
            orderNum: index, keyword: word.keyword, isUnsaved: false, typeId: word.typeId
        }));
        setKeywords(savedKeywords);
        setId(savedKeywords?.length);
    }, [typeId]);

    // useEffect(() => {
    //     console.log("curation.type[typeId]", curation.type[typeId]);
    // }, [curation.type[typeId]]);


    const save = async () => {

        if (confirm('저장하시겠습니까?')) {

            console.log("keywordsType:", keywordsType);
            console.log("keywordsType.type:", keywordsType.type);
            console.log("typeId:", keywordsType.type?.typeId);
            console.log("typeName:", keywordsType.type?.typeName);
            console.log("typeText:", keywordsType.type?.typeText);


            try {
                const curationDTO = {
                    curationType: {
                        typeText: keywordsType.type.typeText,
                        typeId: keywordsType.type.typeId,
                        typeName: keywordsType.type.typeName
                    }, curationKeywords: keywords
                };

                console.log('전송할 데이터:', JSON.stringify(curationDTO, null, 2)); // 디버깅용
                dispatch(callUpdateAllAPI(curationDTO));
                navigate(0);

            } catch (error) {
                console.error("Error in save:", error);
            }

        }

    }


    return (<div className={CurationCSS.container}>
        <div className={CurationCSS.fontContainer}>
            <p className={CurationCSS.font1}>영상 키워드 관리</p>
            <select onChange={onChangeSelect} defaultValue={curation.type?.typeId} style={{"border": "none"}}
                    className={CurationCSS.filteringKeyword}>
                <option value="0">None</option>
                {curation.type?.map(cu => (<option key={cu.type?.typeId} value={cu.type?.typeId}>
                    {cu.type?.typeName}
                </option>))}
            </select>
            <div className={CurationCSS.buttonDiv}>
            </div>
        </div>
        <hr className={CurationCSS.filteringLine}/>
        <div className={CurationCSS.filteringDetailContent}>
            {typeId < 0 ? null : (<input
                    className={CurationCSS.curationTypeText}
                    onChange={onChangeHandler}
                    type="text"
                    name="typeText"
                    value={keywordsType?.type?.typeText} // undefined 대신 빈 문자열 사용
                />)}
            <div className={CurationCSS.filteringKeywords}>
                {keywords?.map(word => (<div className={CurationCSS.filteringWrapper} key={word.orderNum}>
                    {!word.isUnsaved ? (<p className={CurationCSS.savedKeyword}>{word.keyword}</p>) : (
                        <input className={CurationCSS.filteringInput} type="text"
                               placeholder="입력하세요"
                               name="keyword"
                               onKeyDown={(e) => {
                                   if (e.key == 'Enter') {
                                       enterKeyword(e, word.orderNum);
                                   }
                               }}
                        />)}
                    <button className={CurationCSS.noneBt} type="button"
                            onClick={() => deleteKeyword(word.orderNum)}>X
                    </button>
                </div>))}
                {typeId < 0 ? null : <button className={CurationCSS.redBt} onClick={CreateKeyword}>+</button>}
            </div>
        </div>
        <hr className={CurationCSS.filteringLine}/>
        <div className={CurationCSS.paging}>
            <p className={CurationCSS.font2} onClick={save}>저장하기</p>
        </div>
    </div>)
}

export default CurationManager;