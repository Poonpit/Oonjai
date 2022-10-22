import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { serverUrl } from "../../utils/serverApi";
import useEffectOnce from "../../hooks/use-effect-once";
import { getTokenCookie } from "../../utils/cookies";
import moment from "moment";
import { EmojiFrownFill, EmojiSmileFill, EmojiNeutralFill } from "react-bootstrap-icons";

const CovidHistory = () => {
    const [histories, setHistories] = useState([]);

    const fetchHistoriesHandler = async () => {
        try {
            const { data } = await axios.get(serverUrl + "/assessments/covid", {
                headers: {
                    Authorization: "Bearer " + getTokenCookie(),
                },
            });
            setHistories(data.assessments);
        } catch (e) {
            toast.error(e.response.data.message);
        }
    };

    useEffectOnce(() => {
        fetchHistoriesHandler();
    });

    const AssessmentHistoryComponent = ({ assessment }) => {
        if (assessment.result >= 0 && assessment.result <= 5) {
            return (
                <div className="px-2 text-break">
                    <div className="d-flex align-items-center">
                        <EmojiSmileFill
                            style={{
                                fontSize: "32px",
                                color: "green",
                            }}
                        />
                        <h5 className="text-success ms-2">คุณไม่มีความเสี่ยง COVID-19</h5>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mt-2">
                        <span>
                            สามารถใช้ชีวิตได้ปกติ แต่ควรต้องรักษาระยะห่างที่ปลอดภัยจากผู้อื่น
                            สวมหน้ากากอนามัยในที่สาธารณะ ล้างมือบ่อยๆ รับวัคซีนเมื่อได้รับสิทธิ์ ซึ่งจะช่วยปกป้องคุณ
                        </span>
                        <span className="text-muted">{moment(assessment.created_at).format("DD/MM/yyyy HH:mm")}</span>
                    </div>
                </div>
            );
        } else if (assessment.result > 5 && assessment.result <= 9) {
            return (
                <div className="px-2 text-break">
                    <div className="d-flex align-items-center">
                        <EmojiNeutralFill
                            style={{
                                fontSize: "32px",
                                color: "yellow",
                            }}
                        />
                        <h5 className="text-warning ms-2">คุณมีความเป็นไปได้ที่คุณจะติดเชื้อ COVID-19</h5>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mt-2">
                        <span>
                            คุณควร แยกตัวอยู่ในห้องคนเดียว แยกการใช้ห้องน้ำส่วนตัว สวมหน้ากากอนามัยตลอดเวลา
                            รับประทานอาหารคนเดียว ติดต่อผู้อื่นในบ้านให้ได้น้อยที่สุด
                        </span>
                        <span className="text-muted">{moment(assessment.created_at).format("DD/MM/yyyy HH:mm")}</span>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="px-2 text-break">
                    <div className="d-flex align-items-center">
                        <EmojiFrownFill
                            style={{
                                color: "red",
                                fontSize: "32px",
                            }}
                        />
                        <h5 className="text-danger ms-2">คุณน่าจะเป็น COVID-19</h5>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mt-2">
                        <span>
                            คุณต้องกักตัวโดยด่วน แล้วแจ้งให้ทางโรงพยาบาลทราบ
                            เพื่อที่จะได้ทำการตรวจวินิจฉัยเพื่อจะได้รู้ผล ถ้าหากติดเชื้อ
                            COVID-19จริงจะได้ส่งต่อการรักษาต่อไป{" "}
                        </span>
                        <span className="text-muted">{moment(assessment.created_at).format("DD/MM/yyyy HH:mm")}</span>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="p-3">
            {histories.map((assessment) => (
                <div className="p-2" key={assessment.id}>
                    <AssessmentHistoryComponent assessment={assessment} />
                </div>
            ))}
        </div>
    );
};

export default CovidHistory;
