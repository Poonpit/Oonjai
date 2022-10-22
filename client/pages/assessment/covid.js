import { useState } from "react";
import { Container } from "react-bootstrap";
import CovidAssessmentForm from "../../components/Assessment/CovidAssessmentForm";

const CovidAssessmentPage = () => {
    return (
        <Container>
            <div
                className="px-5 mx-5 mt-3 bg-light rounded-3 py-3"
                style={{
                    height: "45rem",
                    overflowY: "scroll",
                }}
            >
                <h2>แบบประเมินความเสี่ยงการติดเชื้อCovid-19</h2>
                <hr />
                <div className="px-3">
                    <CovidAssessmentForm />
                </div>
            </div>
        </Container>
    );
};

export default CovidAssessmentPage;
