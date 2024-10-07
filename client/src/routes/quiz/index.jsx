import { Loader } from "@mantine/core";
import Quiz from "templates/Quiz"

export default function QuizRoute() {
    const { quizId } = useParams();

    const fetchQuiz = async () => {
        const quiz = await axios.get(`/api/quiz/${quizId}`)
        return quiz.quiz
    }

    const { data, status } = useQuery({
        queryFn: fetchQuiz,
        queryKey: ["quiz", quizId],
    })

    return status === "pending" ? (
        <div className="loader-center">
            <Loader />
        </div>
    ) : status === "error" ? (
        <div className="loader-center">
            <p>Nastala chyba!</p>
        </div>
    ) : (
        <Quiz data={data} />
    )
}