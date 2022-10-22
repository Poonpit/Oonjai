import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { serverUrl } from "../../utils/serverApi";
import useEffectOnce from "../../hooks/use-effect-once";
import { getTokenCookie } from "../../utils/cookies";
import moment from "moment";
import { EmojiSmileFill, EmojiNeutralFill, EmojiFrownFill } from "react-bootstrap-icons";

const MentalHistory = () => {
    const [histories, setHistories] = useState([]);

    const fetchHistoriesHandler = async () => {
        try {
            const { data } = await axios.get(serverUrl + "/assessments/mental", {
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
        if (assessment.result >= 0 && assessment.result <= 7) {
            return (
                <div className="px-2 text-break">
                    <div className="d-flex align-items-center">
                        <EmojiSmileFill
                            style={{
                                fontSize: "32px",
                                color: "green",
                            }}
                        />
                        <h5 className="text-success ms-2">ท่านไม่มีอาการซึมเศร้าหรือมีก็เพียงเล็กน้อย</h5>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mt-2">
                        <span>ไม่จำเป็นต้องรักษา</span>
                        <span className="text-muted">{moment(assessment.created_at).format("DD/MM/yyyy HH:mm")}</span>
                    </div>
                </div>
            );
        } else if (assessment.result > 7 && assessment.result <= 13) {
            return (
                <div className="px-2 text-break">
                    <div className="d-flex align-items-center">
                        <EmojiNeutralFill
                            style={{
                                fontSize: "32px",
                                color: "yellow",
                            }}
                        />
                        <h5 className="text-warning ms-2">ท่านมีอาการซึมเศร้าระดับปานกลาง</h5>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mt-2">
                        <span>
                            ควรพักผ่อนให้เพียงพอ นอนหลับให้ได้ 6-8 ชั่วโมง ออกกำลังกายสม่ำเสมอ ทำกิจกรรมที่ทำให้ผ่อนคลาย
                            พบปะเพื่อนฝูง
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
                        <h5 className="text-danger ms-2">ท่านมีอาการซึมเศร้าระดับรุนแรงมาก</h5>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mt-2">
                        <span>ต้องพบแพทย์เพื่อประเมินอาการและให้การรักษาโดยเร็ว ไม่ควรปล่อยทิ้งไว้</span>
                        <span className="text-muted">{moment(assessment.created_at).format("DD/MM/yyyy HH:mm")}</span>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="p-3">
            {histories.map((assessment) => (
                <div className="p-2 border rounded-2 p-2 mb-2" key={assessment.id}>
                    <AssessmentHistoryComponent assessment={assessment} />
                </div>
            ))}
        </div>
    );
};

export default MentalHistory;
