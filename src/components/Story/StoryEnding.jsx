import { useNavigate } from "react-router-dom";

export default function StoryEnding({

    ending

}) {

    const navigate = useNavigate();

    return (

        <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">

            <p className="eyebrow text-xs text-paper-dim">End of Reel</p>

            <h2 className="mt-4 font-display text-5xl">

                The End

            </h2>

            <p className="mt-10 max-w-3xl font-display text-2xl italic leading-10 text-paper/80">

                {ending}

            </p>

            <button

                onClick={() => {

                    localStorage.removeItem("legacy-story");

                    navigate("/");

                }}

                className="mt-20 flex items-center gap-2 rounded-full bg-paper px-8 py-4 font-medium text-ink transition hover:-translate-y-1"

            >
                Record Another Story
            </button>

        </section>

    )

}
