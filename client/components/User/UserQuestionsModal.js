import { useState } from "react";
import { Modal } from "react-bootstrap";
import UserQuestionItem from "./UserQuestionItem";

const DUMMY_QUESTIONS = [
    {
        question_id: 1,
        title: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.",
        content:
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.",
        topic: "โรคผิวหนัง",
        created_at: new Date(),
    },
    {
        question_id: 2,
        title: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.",
        content:
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.",
        topic: "โรคหัวใจ",
        created_at: new Date(),
    },
    {
        question_id: 3,
        title: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.",
        content:
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.",
        topic: "โรคหัวใจ",
        created_at: new Date(),
    },
    {
        question_id: 3,
        title: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.",
        content:
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.",
        topic: "โรคหัวใจ",
        created_at: new Date(),
    },
    {
        question_id: 3,
        title: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.",
        content:
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non consequuntur sint consectetur in libero nesciunt.",
        topic: "โรคหัวใจ",
        created_at: new Date(),
    },
];

const UserQuestionsModal = ({isShow, onCloseModalHandler}) => {
    const [questions, setQuestions] = useState(DUMMY_QUESTIONS);

    return (
        <Modal show={isShow} onHide={onCloseModalHandler}>
            <Modal.Header closeButton>
                <Modal.Title>Questions</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="px-3">
                    {questions.map(question => <UserQuestionItem question={question} key={question.question_id} />)}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default UserQuestionsModal;
