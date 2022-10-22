import { useState } from "react";
import { Container } from "react-bootstrap";
import MentalHealthAssessmentForm from "../../components/Assessment/MentalHealthAssessmentForm";
import { ExclamationTriangleFill } from "react-bootstrap-icons";

const MentalHealthAssessmentPage = () => {
    return (
        <Container>
            <div
                className="px-5 mx-5 mt-3 bg-light rounded-3 py-3"
                style={{
                    height: "45rem",
                    overflowY: "scroll",
                }}
            >
                <h2>แบบประเมินสุขภาพจิต</h2>
                <hr />
                <div className="px-3">
                    <MentalHealthAssessmentForm />
                </div>
            </div>
        </Container>
    );
};

export default MentalHealthAssessmentPage;
