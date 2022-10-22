import { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { serverUrl } from "../../utils/serverApi";
import { toast } from "react-toastify";
import axios from "axios";
import useEffectOnce from "../../hooks/use-effect-once";
import { getTokenCookie } from "../../utils/cookies";

const ClearQuestionModal = ({ isShow, onCloseClearQuestionModal, onFetchAggregationHandler }) => {
    const [number, setNumber] = useState(1);
    const [selectedOpt, setSelectedOpt] = useState("Days");

    const clearQuestionsHandler = async () => {
        try {
            const { data } = await axios.delete(serverUrl + `/admin/questions/remove?number=${number}&period=${selectedOpt}`, {
                headers: {
                    Authorization: "Bearer " + getTokenCookie(),
                },
            });
            toast(data.message);
            onCloseClearQuestionModal();
            onFetchAggregationHandler();
        } catch (e) {
            toast.error(e.response.data.message);
        }
    };

    return (
        <Modal show={isShow} onHide={onCloseClearQuestionModal}>
            <Modal.Header closeButton>
                <Modal.Title>เคลียร์คำถามที่ไม่มีการตอบกลับ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <div>
                        <div>
                            <span>เคลียร์คำถามตั้งแต่ช่วงเวลา</span>
                        </div>
                        <div className="d-flex align-items-center">
                            <input
                                type="number"
                                className="form-control w-75"
                                min={1}
                                value={number}
                                onChange={(e) => setNumber(+e.target.value)}
                            />
                            <Form.Select
                                className="w-25 ms-1"
                                defaultChecked={"Days"}
                                checked={selectedOpt}
                                onChange={(e) => setSelectedOpt(e.target.value)}
                            >
                                <option value="Days">Days</option>
                                <option value="Weeks">Weeks</option>
                            </Form.Select>
                        </div>
                    </div>
                    <div className="text-end mt-2">
                        <button className="btn btn-danger px-4" onClick={clearQuestionsHandler}>
                            Clear
                        </button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ClearQuestionModal;
