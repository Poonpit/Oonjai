import { useState } from "react";
import { Container } from "react-bootstrap";
import ClearQuestionModal from "../../../components/Admin/ClearQuestionModal";
import { serverUrl } from "../../../utils/serverApi";
import { toast } from "react-toastify";
import axios from "axios";
import useEffectOnce from "../../../hooks/use-effect-once";
import { getTokenCookie } from "../../../utils/cookies";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top",
        },
        title: {
            display: true,
            text: "Chart.js Line Chart",
        },
    },
};

const mainLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const labels = [];
const today = (new Date().getDay() % 7) - 1;
for (let i = today + 1; i < mainLabels.length; i++) {
    labels.push(mainLabels[i]);
}
for (let i = 0; i < today; i++) {
    labels.push(mainLabels[i]);
}
labels.push(mainLabels[today]);

const AdminDashboardPage = () => {
    const [isShow, setIsShow] = useState(false);
    const [unansweredQuestionsStat, setUnansweredQuestionStat] = useState([]);
    const [registerUsersStat, setRegisterUsersStat] = useState([]);

    const data1 = {
        labels,
        datasets: [
            {
                label: "จำนวนคำถาม",
                data: labels.map((item, index) =>
                    unansweredQuestionsStat[index] ? unansweredQuestionsStat[index].count : 0
                ),
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
        ],
    };
    const data2 = {
        labels,
        datasets: [
            {
                label: "จำนวนผู้ใช้",
                data: labels.map((item, index) => (registerUsersStat[index] ? registerUsersStat[index].count : 0)),
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
        ],
    };

    const openModalHandler = () => {
        setIsShow(true);
    };

    const closeModalHandler = () => {
        setIsShow(false);
    };

    const fetchAggregationHandler = async () => {
        try {
            const { data } = await axios.get(serverUrl + "/admin/aggregate", {
                headers: {
                    Authorization: "Bearer " + getTokenCookie(),
                },
            });
            setUnansweredQuestionStat(data.unansweredStatistic);
            setRegisterUsersStat(data.registerUserStatistic);
        } catch (e) {
            toast.error(e.response.data.message);
        }
    };

    useEffectOnce(() => {
        fetchAggregationHandler();
    });

    return (
        <Container>
            <ClearQuestionModal
                isShow={isShow}
                onCloseClearQuestionModal={closeModalHandler}
                onFetchAggregationHandler={fetchAggregationHandler}
            />
            <div className="text-end">
                <button className="btn btn-outline-danger" onClick={openModalHandler}>
                    Clear questions
                </button>
            </div>
            <div className="mt-3 d-flex">
                <div className="w-50 text-center">
                    <Line options={options} data={data1} />
                    <h5 className="text-secondary mt-3">สถิติของคำถามที่ไม่มีแพทย์ตอบ</h5>
                </div>
                <div className="w-50 text-center">
                    <Line options={options} data={data2} />
                    <h5 className="text-secondary mt-3">สถิติของการสมัครสมาชิก</h5>
                </div>
            </div>
        </Container>
    );
};

export default AdminDashboardPage;
