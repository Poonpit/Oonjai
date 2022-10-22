import React from "react";
import { PersonCheckFill, PersonXFill } from "react-bootstrap-icons";

const UserItem = ({ user, onSetSelectedUser }) => {
    const selectUserHandler = () => {
        onSetSelectedUser(user);
    };

    return (
        <div className="d-flex align-items-center border border-bottom p-2" role="button" onClick={selectUserHandler}>
            <div>
                <img
                    src={user.profileImageUrl}
                    style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        objectFit: "cover",
                    }}
                />
            </div>
            <div className="ms-2">
                <span>{user.username}</span>
            </div>
            <div className="ms-2">
                {user.is_verified ? (
                    <PersonCheckFill
                        style={{
                            color: "green",
                        }}
                        title="Verified"
                    />
                ) : (
                    <PersonXFill
                        style={{
                            color: "red",
                        }}
                        title="Not verify"
                    />
                )}
            </div>
        </div>
    );
};

export default UserItem;
