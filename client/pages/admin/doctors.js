import { Container, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import DoctorItem from "../../components/Doctor/DoctorItem";
import DoctorProfile from "../../components/Doctor/DoctorProfile";
import AddDoctorModal from "../../components/Doctor/AddDoctorModal";
import { serverUrl } from "../../utils/serverApi";
import { toast } from "react-toastify";
import axios from "axios";
import useEffectOnce from "../../hooks/use-effect-once";
import { getTokenCookie } from "../../utils/cookies";

const AdminDoctorManagementPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDoctorProfile, setSelectedDoctorProfile] = useState(null);
    const [isShowAddDoctorModal, setIsShowAddDoctorModal] = useState(false);

    const fetchDoctorsHandler = async () => {
        try {
            const { data } = await axios.get(serverUrl + "/admin/doctors", {
                headers: {
                    Authorization: "Bearer " + getTokenCookie(),
                },
            });
            setDoctors(data.doctors);
        } catch (e) {
            toast.error(e.response.data.error);
        }
    };

    useEffectOnce(() => {
        fetchDoctorsHandler();
    });

    const removeDoctorHandler = async (id) => {
        const answer = window.confirm(`คุณต้องการที่จะลบแพทย์คนนี้หรือไม่`);
        if (answer) {
            try {
                const { data } = await axios.delete(serverUrl + `/admin/doctors/${id}`, {
                    headers: {
                        Authorization: "Bearer " + getTokenCookie(),
                    },
                });
                toast(data.message);
                setDoctors(doctors.filter((doctor) => doctor.id !== id));
                if (selectedDoctor === id) {
                    setSelectedDoctor(null);
                    setSelectedDoctorProfile(null);
                }
            } catch (e) {
                toast.error(e.response.data.error);
            }
        }
    };

    const fetchSpecifiedDoctorHandler = async (id) => {
        try {
            const { data } = await axios.get(serverUrl + `/admin/doctors/${id}`, {
                headers: {
                    Authorization: "Bearer " + getTokenCookie(),
                },
            });
            setSelectedDoctor(data.doctor.id);
            setSelectedDoctorProfile(data.doctor);
        } catch (e) {
            toast.error(e.response.data.error);
        }
    };

    const showAddDoctorModal = () => {
        setIsShowAddDoctorModal(true);
    };

    const closeAddDoctorModal = () => {
        setIsShowAddDoctorModal(false);
    };

    return (
        <Container>
            <AddDoctorModal isShowAddDoctorModal={isShowAddDoctorModal} onCloseAddDoctorModal={closeAddDoctorModal} onSetDoctors={setDoctors} />
            <div className="d-flex w-100">
                <div
                    className="bg-light rounded-3 p-3"
                    style={{
                        width: "60%",
                        height: "45rem",
                        overflowY: "scroll",
                    }}
                >
                    <div className="d-flex align-items-center justify-content-between">
                        <h2>จัดการแพทย์</h2>
                        <button className="btn btn-outline-primary ms-2" onClick={showAddDoctorModal}>
                            Add doctor
                        </button>
                    </div>
                    <hr />
                    <div className="px-2 mb-2">
                        {doctors.map((doctor) => (
                            <DoctorItem
                                doctor={doctor}
                                key={doctor.id}
                                onSetSelectedDoctor={fetchSpecifiedDoctorHandler}
                                onDeleteDoctorHandler={removeDoctorHandler}
                            />
                        ))}
                    </div>
                </div>
                <div
                    className="ms-3 bg-light rounded-3 px-1 py-3"
                    style={{
                        width: "40%",
                        height: "42rem",
                    }}
                >
                    {selectedDoctor ? (
                        <DoctorProfile doctor={selectedDoctorProfile} />
                    ) : (
                        <div className="w-100 text-center">
                            <span>-- โปรดเลือกแพทย์ --</span>
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default AdminDoctorManagementPage;
