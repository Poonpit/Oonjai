import { useState } from "react";
import { Form } from "react-bootstrap";
import { EmojiFrownFill, ArrowLeftCircle } from "react-bootstrap-icons";
import axios from "axios";
import { serverUrl } from "../../utils/serverApi";
import { toast } from "react-toastify";
import { getTokenCookie } from "../../utils/cookies";

const CovidAssessmentForm = () => {
    const [selectedChoices, setSelectedChoices] = useState([null, null, null, null, null, null, null]);
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
                serverUrl + "/assessments/covid/create",
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

    const GetCovidResult = () => {
        if (result >= 0 && result <= 5) {
            return (
                <div className="text-center px-4 text-break">
                    <h2 className="text-success">คุณไม่มีความเสี่ยง COVID-19</h2>
                    <span className="fs-5">
                        สามารถใช้ชีวิตได้ปกติ แต่ควรต้องรักษาระยะห่างที่ปลอดภัยจากผู้อื่น สวมหน้ากากอนามัยในที่สาธารณะ
                        ล้างมือบ่อยๆ รับวัคซีนเมื่อได้รับสิทธิ์ ซึ่งจะช่วยปกป้องคุณ
                    </span>
                </div>
            );
        } else if (result > 5 && result <= 9) {
            return (
                <div className="text-center px-4 text-break">
                    <h2 className="text-warning">คุณมีความเป็นไปได้ที่คุณจะติดเชื้อ COVID-19</h2>
                    <span className="fs-5">
                        คุณควร แยกตัวอยู่ในห้องคนเดียว แยกการใช้ห้องน้ำส่วนตัว สวมหน้ากากอนามัยตลอดเวลา
                        รับประทานอาหารคนเดียว ติดต่อผู้อื่นในบ้านให้ได้น้อยที่สุด จัดให้มีการระบายอากาศที่ดี
                        เว้นระยะห่าง จากคนในบ้าน
                    </span>
                </div>
            );
        } else {
            return (
                <div className="text-center px-4 text-break">
                    <h2 className="text-danger">คุณมีโอกาสเป็น COVID-19 สูงมาก</h2>
                    <span className="fs-5">
                        คุณต้องกักตัวโดยด่วน แล้วแจ้งให้ทางโรงพยาบาลทราบ เพื่อที่จะได้ทำการตรวจวินิจฉัยเพื่อจะได้รู้ผล
                        ถ้าหากติดเชื้อ COVID-19จริงจะได้ส่งต่อการรักษาต่อไป{" "}
                    </span>
                </div>
            );
        }
    };

    return isShowResult ? (
        <div className="mx-5 mt-5 text-center">
            <div className="px-5 text-break mb-3">
                {<GetCovidResult />}
            </div>
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
                <Form.Label>1. คุณมีไข้สูงกว่า 38 องศาเซลเซียส?</Form.Label>
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
                    2. คุณมีอาการไข้ ไอ น้ำมูก เจ็บคอ คอแห้ง อ่อนเพลีย ปวดเมื่อย ท้องเสีย ตาแดง ผื่นขึ้น
                    เหงื่อออกตอนกลางคืน มีอาการอย่างใดอย่างหนึ่ง?
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
                <Form.Label>3. คุณรู้สึกพูดคุยลำบาก เนื่องจากหายใจติดขัด?</Form.Label>
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
                    4. คุณมีประวัติการเดินทางในประเทศที่มีการระบาดของเชื้อไวรัสโคโรนา ในช่วง 14 วันที่ผ่านมา?
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
                <Form.Label>5. คุณรู้สึกเสียการดมกลิ่น / ลิ้นไม่รับรส ?</Form.Label>
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
                <Form.Label>6. คุณไม่ได้สวมหน้ากากขณะอยู่ในสถานที่เสี่ยง?</Form.Label>
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
                    7. คุณรู้สึกหายใจลำบาก / เร็ว เจ็บแน่นหน้าอก เสียความสามารถในการพูด / เคลื่อนไหว?
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
            <div>
                <button className="btn btn-primary px-4" type="button" onClick={submitHandler}>
                    ประเมิน
                </button>
            </div>
        </Form>
    );
};

export default CovidAssessmentForm;
