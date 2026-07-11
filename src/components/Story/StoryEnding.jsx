import { useNavigate } from "react-router-dom";

export default function StoryEnding({

    ending

}) {

    const navigate = useNavigate();

    return (

        <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">

            <h2 className="font-serif text-5xl">

                The End

            </h2>

            <p className="mt-10 max-w-3xl text-2xl leading-10 text-zinc-300">

                {ending}

            </p>

            <button

                onClick={() => {

                    localStorage.removeItem("legacy-story");

                    navigate("/");

                }}

                className="mt-20 rounded-full bg-white px-8 py-4 font-medium text-black transition hover:-translate-y-1"

            >
                Create Another Story
            </button>

        </section>

    )

}