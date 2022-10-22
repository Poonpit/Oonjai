import React, { useState } from "react";
import { Container } from "react-bootstrap";
import QuestionItem from "../../../components/Question/QuestionItem";
import axios from "axios";
import { serverUrl } from "../../../utils/serverApi";
import { toast } from "react-toastify";
import { getTokenCookie } from "../../../utils/cookies";
import useEffectOnce from "../../../hooks/use-effect-once";

const DUMMY_QUESTIONS = [
    {
        id: 1,
        title: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.",
        content:
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.",
        username: "Warathep",
        profileImageUrl: "/profile-icons/w.png",
        answers: 2,
        topic: "โรคผิวหนัง",
        doctor_answered: true,
        created_at: new Date(),
    },
    {
        id: 2,
        title: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.",
        content:
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.",
        username: "Warathep",
        profileImageUrl: "/profile-icons/w.png",
        answers: 2,
        topic: "โรคหัวใจ",
        doctor_answered: false,
        created_at: new Date(),
    },
    {
        id: 10,
        title: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.",
        content:
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.",
        username: "Warathep",
        profileImageUrl: "/profile-icons/w.png",
        answers: 5,
        topic: "โรคหัวใจ",
        doctor_answered: true,
        created_at: new Date(),
    },
    {
        id: 6,
        title: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.",
        content:
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.",
        username: "Warathep",
        profileImageUrl: "/profile-icons/w.png",
        answers: 5,
        topic: "โรคหัวใจ",
        doctor_answered: false,
        created_at: new Date(),
    },
    {
        id: 3,
        title: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.",
        content:
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.",
        username: "Warathep",
        profileImageUrl: "/profile-icons/w.png",
        answers: 5,
        topic: "โรคหัวใจ",
        doctor_answered: true,
        created_at: new Date(),
    },
    {
        id: 15,
        title: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.",
        content:
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.",
        username: "Warathep",
        profileImageUrl: "/profile-icons/w.png",
        answers: 33,
        topic: "โรคหัวใจ",
        doctor_answered: true,
        created_at: new Date(),
    },
];

const DoctorInterestingQuestionPage = () => {
    const [questions, setQuestions] = useState([]);

    const fetchQuestionsHandler = async (e) => {
        try {
            const { data } = await axios.get(serverUrl + "/questions/doctor/questions/interested", {
                headers: {
                    Authorization: "Bearer " + getTokenCookie(),
                },
            });
            setQuestions(data.questions);
        } catch (e) {
            console.log(e);
            toast.error(e.response.data.message);
        }
    };

    useEffectOnce(() => {
        fetchQuestionsHandler();
    });

    const banQuestionHandler = async (id) => {
        const answer = window.confirm("คุณต้องการที่จะแบนคำถามนี้หรือไม่?");
        if (answer) {
            try {
                await axios.delete(serverUrl + `/questions/${id}/ban`, {
                    headers: {
                        Authorization: "Bearer " + getTokenCookie(),
                    },
                });
                const filtered = questions.filter((question) => question.id !== id);
                setQuestions(filtered);
                toast("Banned");
            } catch (e) {
                toast.error(e.response.data.message);
            }
        }
    };

    return (
        <Container>
            <div className="mt-2 px-4 bg-light pt-3 pb-4" style={{
                height: "45rem",
                overflowY: "scroll"
            }}>
                <div>
                    <h1>คำถามล่าสุดที่ยังไม่มีแพทย์ตอบ</h1>
                    <hr />
                    <div className="px-3">
                        {questions.map((question) => (
                            <QuestionItem
                                question={question}
                                onBanQuestionHandler={banQuestionHandler}
                                isDoctor={true}
                                key={question.id}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default DoctorInterestingQuestionPage;
