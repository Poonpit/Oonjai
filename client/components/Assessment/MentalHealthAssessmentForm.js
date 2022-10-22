import { useState } from "react";
import { Form } from "react-bootstrap";
import { ArrowLeftCircle } from "react-bootstrap-icons";
import axios from "axios";
import { serverUrl } from "../../utils/serverApi";
import { toast } from "react-toastify";
import { getTokenCookie } from "../../utils/cookies";

const MentalHealthAssessmentForm = () => {
    const [selectedChoices, setSelectedChoices] = useState([null, null, null, null, null, null, null, null, null]);
    const [isShowResult, setIsShowResult] = useState(false);
    const [result, setResult] = useState(0);

    const submitHandler = async (e) => {
        e.preventDefault();
        for (const choice of selectedChoices) {
            if (choice !== 0 && !choice) {
                return toast.error("โปรดเลือกคำตอบทุกช้อ");
            }
        }
        try {
            const { data } = await axios.post(
                serverUrl + "/assessments/mental/create",
                {
                    choose: selectedChoices,
                },
                {
                    headers: {
                        Authorization: "Bearer " + getTokenCookie(),
                    },
                }
            );
            setIsShowResult(true);
            setResult(data.result);
        } catch (e) {
            toast.error(e.response.data.error);
        }
    };

    const choiceChangeHandler = (e) => {
        const { name, value } = e.target;
        const index = +name;
        const choice = +value;
        const copied = JSON.parse(JSON.stringify(selectedChoices));
        copied[index - 1] = choice;
        setSelectedChoices(copied);
    };

    const GetMentalResult = () => {
        if (result >= 0 && result <= 7) {
            return (
                <div className="text-center px-4 text-break">
                    <h2 className="text-success">ท่านไม่มีอาการซึมเศร้าหรือมีก็เพียงเล็กน้อย</h2>
                    <span className="fs-5">ไม่จำเป็นต้องรักษา</span>
                </div>
            );
        } else if (result > 7 && result <= 13) {
            return (
                <div className="text-center px-4 text-break">
                    <h2 className="text-warning">ท่านมีอาการซึมเศร้าระดับปานกลาง</h2>
                    <span className="fs-5">
                        ควรพักผ่อนให้เพียงพอ นอนหลับให้ได้ 6-8 ชั่วโมง ออกกำลังกายสม่ำเสมอ ทำกิจกรรมที่ทำให้ผ่อนคลาย
                        พบปะเพื่อนฝูง ควรขอคำปรึกษาช่วยเหลือจากผู้ที่ไว้วางใจ ไม่จมอยู่กับปัญหา มองหาหนทางคลี่คลาย
                        หากอาการที่ท่านเป็นมีผลกระทบต่อการทำงานหรือการเข้าสังคม (อาการซึมเศร้าทำให้ท่านมีปัญหาในการทำงาน
                        การดูแลสิ่งต่าง ๆ ในบ้าน หรือการเข้ากับผู้คน ในระดับมากถึงมากที่สุด)
                        หรือหากท่านมีอาการระดับนี้มานาน 1-2 สัปดาห์แล้วยังไม่ดีขึ้น ควรพบแพทย์เพื่อรับการช่วยเหลือรักษา
                    </span>
                </div>
            );
        } else {
            return (
                <div className="text-center px-4 text-break">
                    <h2 className="text-danger">ท่านมีอาการซึมเศร้าระดับรุนแรงมาก</h2>
                    <span className="fs-5">ต้องพบแพทย์เพื่อประเมินอาการและให้การรักษาโดยเร็ว ไม่ควรปล่อยทิ้งไว้</span>
                </div>
            );
        }
    };

    return isShowResult ? (
        <div className="mx-5 mt-5 text-center">
            <div className="px-5 text-break mb-3">{<GetMentalResult />}</div>
            <div>
                <button className="btn btn-outline-primary">
                    <ArrowLeftCircle />
                    <span className="ms-1" onClick={() => setIsShowResult(false)}>
                        ทำแบบประเมินอีกครั้ง
                    </span>
                </button>
            </div>
        </div>
    ) : (
        <Form
            style={{
                fontSize: "20px",
            }}
        >
            <Form.Group className="mb-4">
                <Form.Label>1. คุณรู้สึกเบื่อ ทำอะไร ๆ ก็ไม่เพลิดเพลิน?</Form.Label>
                <div
                    className="d-flex align-items-center"
                    style={{
                        fontSize: "17px",
                    }}
                >
                    <Form.Check
                        type="radio"
                        label="ไม่"
                        name="1"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={0}
                    />
                    <Form.Check
                        type="radio"
                        className="ms-3"
                        label="ไม่แน่ใจ"
                        name="1"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={1}
                    />
                    <Form.Check
                        type="radio"
                        className="ms-3"
                        label="ใช่"
                        name="1"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={2}
                    />
                </div>
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label>
                    2. คุณรู้สึกไม่สบายใจ ซึมเศร้า หรือท้อแท้?
                </Form.Label>
                <div
                    className="d-flex align-items-center"
                    style={{
                        fontSize: "17px",
                    }}
                >
                    <Form.Check
                        type="radio"
                        label="ไม่"
                        name="2"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={0}
                    />
                    <Form.Check
                        type="radio"
                        className="ms-3"
                        label="ไม่แน่ใจ"
                        name="2"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={1}
                    />
                    <Form.Check
                        type="radio"
                        className="ms-3"
                        label="ใช่"
                        name="2"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={2}
                    />
                </div>
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label>3. คุณรู้สึกหลับยาก หรือหลับ ๆ ตื่น ๆ หรือหลับมากไป?</Form.Label>
                <div
                    className="d-flex align-items-center"
                    style={{
                        fontSize: "17px",
                    }}
                >
                    <Form.Check
                        type="radio"
                        label="ไม่"
                        name="3"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={0}
                    />
                    <Form.Check
                        type="radio"
                        className="ms-3"
                        label="ไม่แน่ใจ"
                        name="3"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={1}
                    />
                    <Form.Check
                        type="radio"
                        className="ms-3"
                        label="ใช่"
                        name="3"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={2}
                    />
                </div>
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label>
                    4. คุณรู้สึกเหนื่อยง่าย หรือไม่ค่อยมีแรง?
                </Form.Label>
                <div
                    className="d-flex align-items-center"
                    style={{
                        fontSize: "17px",
                    }}
                >
                    <Form.Check
                        type="radio"
                        label="ไม่"
                        name="4"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={0}
                    />
                    <Form.Check
                        type="radio"
                        className="ms-3"
                        label="ไม่แน่ใจ"
                        name="4"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={1}
                    />
                    <Form.Check
                        type="radio"
                        className="ms-3"
                        label="ใช่"
                        name="4"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={2}
                    />
                </div>
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label>5. คุณรู้สึกเบื่ออาหาร หรือกินมากเกินไป?</Form.Label>
                <div
                    className="d-flex align-items-center"
                    style={{
                        fontSize: "17px",
                    }}
                >
                    <Form.Check
                        type="radio"
                        label="ไม่"
                        name="5"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={0}
                    />
                    <Form.Check
                        type="radio"
                        className="ms-3"
                        label="ไม่แน่ใจ"
                        name="5"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={1}
                    />
                    <Form.Check
                        type="radio"
                        className="ms-3"
                        label="ใช่"
                        name="5"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={2}
                    />
                </div>
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label>6. คุณรู้สึกรู้สึกไม่ดีกับตัวเอง คิดว่าตัวเองล้มเหลว หรือเป็นคนทำให้ตัวเอง หรือครอบครัวผิดหวัง?</Form.Label>
                <div
                    className="d-flex align-items-center"
                    style={{
                        fontSize: "17px",
                    }}
                >
                    <Form.Check
                        type="radio"
                        label="ไม่"
                        name="6"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={0}
                    />
                    <Form.Check
                        type="radio"
                        className="ms-3"
                        label="ไม่แน่ใจ"
                        name="6"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={1}
                    />
                    <Form.Check
                        type="radio"
                        className="ms-3"
                        label="ใช่"
                        name="6"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={2}
                    />
                </div>
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label>
                    7. คุณรู้สึกสมาธิไม่ดีเวลาทำอะไร เช่น ดูโทรทัศน์ ฟังวิทยุ หรือทำงานท่ีต้องใช้ความตั้งใจ?
                </Form.Label>
                <div
                    className="d-flex align-items-center"
                    style={{
                        fontSize: "17px",
                    }}
                >
                    <Form.Check
                        type="radio"
                        label="ไม่"
                        name="7"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={0}
                    />
                    <Form.Check
                        type="radio"
                        className="ms-3"
                        label="ไม่แน่ใจ"
                        name="7"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={1}
                    />
                    <Form.Check
                        type="radio"
                        className="ms-3"
                        label="ใช่"
                        name="7"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={2}
                    />
                </div>
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label>
                    8. คุณรู้สึกพูดหรือทำอะไรช้าจนคนอื่นมองเห็น หรือกระสับกระส่ายจนท่านอยู่ไม่นิ่งเหมือนเคย?
                </Form.Label>
                <div
                    className="d-flex align-items-center"
                    style={{
                        fontSize: "17px",
                    }}
                >
                    <Form.Check
                        type="radio"
                        label="ไม่"
                        name="8"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={0}
                    />
                    <Form.Check
                        type="radio"
                        className="ms-3"
                        label="ไม่แน่ใจ"
                        name="8"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={1}
                    />
                    <Form.Check
                        type="radio"
                        className="ms-3"
                        label="ใช่"
                        name="8"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={2}
                    />
                </div>
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label>
                    9. คุณรู้สึกคิดทำร้ายตนเอง หรือคิดว่าถ้าตาย ๆ ไปเสียคงจะดี?
                </Form.Label>
                <div
                    className="d-flex align-items-center"
                    style={{
                        fontSize: "17px",
                    }}
                >
                    <Form.Check
                        type="radio"
                        label="ไม่"
                        name="9"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={0}
                    />
                    <Form.Check
                        type="radio"
                        className="ms-3"
                        label="ไม่แน่ใจ"
                        name="9"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={1}
                    />
                    <Form.Check
                        type="radio"
                        className="ms-3"
                        label="ใช่"
                        name="9"
                        role="button"
                        onChange={choiceChangeHandler}
                        value={2}
                    />
                </div>
            </Form.Group>
            <div>
                <button className="btn btn-primary px-4" type="button" onClick={submitHandler}>
                    ประเมิน
                </button>
            </div>
        </Form>
    );
};

export default MentalHealthAssessmentForm;
