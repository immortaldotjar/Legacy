import InterviewHeader from "../components/Interview/InterviewHeader";
import ProgressBar from "../components/Interview/ProgressBar";
import QuestionCard from "../components/Interview/QuestionCard";
import NavigationButtons from "../components/Interview/NavigationButtons";
import AnimatedQuestion from "../components/Interview/AnimatedQuestion";
import LoadingScreen from "../components/Loading/LoadingScreen";
import useInterview from "../hooks/useInterview";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { generateLegacy } from "../services/gemini";

export default function Interview() {
    const {
        current,
        total,
        question,
        answers,
        updateAnswer,
        next,
        previous,
        clearInterview,
    } = useInterview();

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    async function handleGenerate() {
        try {
            setLoading(true);

            const story = await generateLegacy(answers);

            console.log("Generated Story:", story);

            localStorage.setItem(
                "legacy-story",
                JSON.stringify(story)
            );

            clearInterview();

            navigate("/story");
        } catch (error) {
            console.error(error);

            alert(
                error?.message ||
                JSON.stringify(error, null, 2)
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {loading ?
                (
                    <LoadingScreen />
                ) : (
                    <div className="min-h-screen bg-zinc-950 text-white">

                        <div className="mx-auto max-w-4xl px-6 py-20">

                            <InterviewHeader />

                            <ProgressBar
                                current={current}
                                total={total}
                            />

                            <AnimatedQuestion current={current}>

                                <QuestionCard
                                    question={question}
                                    value={answers[question.key]}
                                    updateAnswer={updateAnswer}
                                />

                            </AnimatedQuestion>

                            <NavigationButtons
                                current={current}
                                total={total}
                                previous={previous}
                                next={next}
                                onGenerate={handleGenerate}
                            />

                        </div>

                    </div>
                )}
        </>
    );
}