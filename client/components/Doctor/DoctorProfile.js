import { Form } from "react-bootstrap";
import moment from "moment";
import { useState } from "react";
import DoctorBlogsModal from "./DoctorBlogsModal";

const DoctorProfile = ({ doctor }) => {
    const [isShow, setIsShow] = useState(false);

    const openBlogsModalHandler = () => {
        setIsShow(true);
    };

    const closeBlogsModalHandler = () => {
        setIsShow(false);
    };

    return (
        <div className="px-3">
            <DoctorBlogsModal isShow={isShow} doctorId={doctor.id} onCloseBlogsModalHandler={closeBlogsModalHandler} />
            <div className="text-center position-relative">
                <img
                    src={doctor.url}
                    style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        objectFit: "cover",
                    }}
                />
            </div>
            <div>
                <Form.Group className="mb-2">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" value={doctor.email} readOnly />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value={doctor.name} readOnly />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Personal information</Form.Label>
                    <Form.Control
                        as="textarea"
                        value={doctor.personal_information || ""}
                        style={{
                            height: "160px",
                        }}
                        readOnly
                    />
                </Form.Group>
            </div>
            <div className="mb-3">
                <span>Topicที่สนใจ</span>
                <div>
                    {doctor.interested_in.map((topic, index) => (
                        <button className="btn btn-outline-success me-2" disabled key={index}>
                            {topic.topic}
                        </button>
                    ))}
                </div>
            </div>
            <div className="d-flex align-items-center justify-content-between">
                <button className="btn btn-primary px-2 py-1" onClick={openBlogsModalHandler}>
                    Show blogs
                </button>
                <span className="text-muted">{moment(doctor.created_at).format("DD/MM/yyyy HH:mm")}</span>
            </div>
        </div>
    );
};

export default DoctorProfile;
