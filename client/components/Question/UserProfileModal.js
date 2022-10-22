import moment from "moment";
import { Modal } from "react-bootstrap";

const UserProfileModal = ({ isShow, onSetIsShow, user }) => {
    return (
        <Modal show={isShow} onHide={() => onSetIsShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>User information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="text-start p-2">
                    <div className="mb-3">
                        <label htmlFor="username" className="mb-2">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            defaultValue={user.name}
                            id="username"
                            readOnly
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="birthday" className="mb-2">birthday</label>
                        <input
                            type="text"
                            className="form-control"
                            defaultValue={moment(user.birthday).format("DD/MM/yyyy")}
                            id="birthday"
                            readOnly
                        />
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default UserProfileModal;
