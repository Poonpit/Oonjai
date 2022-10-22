import Link from "next/link";
import { Dropdown, DropdownButton, ButtonGroup } from "react-bootstrap";
import { SuitHeartFill, ExclamationDiamond } from "react-bootstrap-icons";

const AssessmentButton = () => {
    return (
        <div>
            <DropdownButton
                as={ButtonGroup}
                drop="top"
                variant="success"
                title="แบบประเมิน"
                style={{
                    position: "fixed",
                    bottom: "5px",
                    right: "5px",
                    zIndex: "100",
                }}
            >
                <Dropdown.Item>
                    <Link href="/assessment/mental-health">
                        <div className="d-flex align-items-center">
                            <span>ประเมินสุขภาพจิต</span>
                            <SuitHeartFill
                                style={{
                                    color: "red",
                                    fontSize: "20px",
                                    marginLeft: "3px",
                                }}
                            />
                        </div>
                    </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                    <Link href="/assessment/covid">
                        <div className="d-flex align-items-center">
                            <span>ประเมินความเสียงการติดCovid-19</span>
                            <ExclamationDiamond
                                style={{
                                    color: "black",
                                    fontSize: "20px",
                                    marginLeft: "3px",
                                }}
                            />
                        </div>
                    </Link>
                </Dropdown.Item>
            </DropdownButton>
        </div>
    );
};

export default AssessmentButton;
