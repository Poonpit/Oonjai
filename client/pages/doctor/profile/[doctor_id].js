import { Container } from "react-bootstrap";
import { useRouter } from "next/router";
import axios from "axios";
import { serverUrl } from "../../../utils/serverApi";
import { useEffect, useState } from "react";

const ViewDoctorProfilePage = () => {
    const router = useRouter();
    const [profile, setProfile] = useState({
        interested_in: [],
        url: ""
    });

    const fetchProfileHandler = async (id) => {
        try {
            const { data } = await axios.get(serverUrl + `/profile/doctors/${id}`);
            console.log(data);
            setProfile(data);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (router.query.doctor_id) {
            fetchProfileHandler(router.query.doctor_id);
        }
    }, [router.query.doctor_id]);

    return (
        <Container>
            <div className="vh-100 bg-dark">
                <div className="d-flex mx-5 px-5 bg-light rounded-3 py-5 mt-3">
                    <div
                        style={{
                            width: "35%",
                        }}
                    >
                        <img
                            src={profile.url}
                            style={{
                                width: "20rem",
                                height: "20rem",
                                objectFit: "cover",
                                borderRadius: "50%",
                                margin: "0 auto",
                            }}
                        />
                    </div>
                    <div
                        style={{
                            width: "65%",
                        }}
                    >
                        <h1>Doctor profile</h1>
                        <hr />
                        <div>
                            <p className="fs-4">{profile.name}</p>
                            <span>{profile.personal_information}</span>
                            <div className="mt-3">
                                <span className="fs-5">ความสนใจ</span>
                                <div className="d-flex flex-wrap">
                                    {profile.interested_in.map((topic) => (
                                        <button className="btn btn-outline-success m-1 px-3" key={topic.topic_id}>
                                            {topic.topic}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default ViewDoctorProfilePage;
