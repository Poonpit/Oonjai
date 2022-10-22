import { Container } from "react-bootstrap";
import RecommendedBlogs from "../components/Blog/RecommendedBlogs";
import RecommendedTopics from "../components/Topic/RecommendedTopics";
import LatestQuestions from "../components/Question/LatestQuestions";

export default function Home() {
    return (
        <Container className="mt-3 pb-4">
            <div className="d-flex justify-content-around">
                <div className="bg-light rounded w-75">
                    <RecommendedBlogs />
                    <LatestQuestions />
                </div>
                <div className="bg-light rounded w-25 ms-3 h-100">
                    <RecommendedTopics />
                </div>
            </div>
        </Container>
    );
}
