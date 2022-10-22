import { Trash3 } from "react-bootstrap-icons";

const DoctorItem = ({ doctor, onSetSelectedDoctor, onDeleteDoctorHandler }) => {
    const selectDoctorHandler = () => {
        onSetSelectedDoctor(doctor.id);
    };

    return (
        <div className="d-flex align-items-center justify-content-between border border-bottom p-2">
            <div className="d-flex align-items-center" onClick={selectDoctorHandler} role="button">
                <div>
                    <img
                        src={doctor.url}
                        style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            objectFit: "cover",
                        }}
                    />
                </div>
                <div className="ms-2">
                    <span>{doctor.name}</span>
                </div>
            </div>
            <div>
                <Trash3 style={{ color: "red", fontSize: "20px" }} role="button" onClick={() => onDeleteDoctorHandler(doctor.id)} />
            </div>
        </div>
    );
};

export default DoctorItem;
