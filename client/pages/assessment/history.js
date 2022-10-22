import { useState } from "react";
import { Container } from "react-bootstrap";
import CovidHistory from "../../components/Assessment/CovidHistory";
import MentalHistory from "../../components/Assessment/MentalHistory";

const AssessmentHistoryPage = () => {
    const [selected, setSelected] = useState("MENTAL");

    return (
        <Container>
            <div
                className="mt-3 px-3 py-3 mx-5 rounded-3 bg-light"
                style={{
                    height: "45rem",
                    overflowY: "scroll",
                }}
            >
                <div>
                    <h2>ประวัติการทำแบบประเมิน</h2>
                    <div className="d-flex">
                        <div className="m-1">
                            <input
                                type="radio"
                                onClick={() => setSelected("MENTAL")}
                                className="btn-check"
                                id={`success-outlined_1`}
                                name="assessment"
                                checked={selected === "MENTAL"}
                            />
                            <label className="btn btn-outline-success px-3" htmlFor={`success-outlined_1`}>
                                สุขภาพจิต
                            </label>
                        </div>
                        <div className="m-1">
                            <input
                                type="radio"
                                onClick={() => setSelected("COVID")}
                                className="btn-check"
                                id={`success-outlined_2`}
                                name="assessment"
                                checked={selected === "COVID"}
                            />
                            <label className="btn btn-outline-success px-3" htmlFor={`success-outlined_2`}>
                                ความเสี่ยงการติดCovid-19
                            </label>
                        </div>
                    </div>
                </div>
                <hr />
                <div>
                    {selected === "MENTAL" && <MentalHistory />}
                    {selected === "COVID" && <CovidHistory />}
                </div>
            </div>
        </Container>
    );
};

export default AssessmentHistoryPage;
