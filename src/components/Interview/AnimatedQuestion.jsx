import { AnimatePresence, motion } from "framer-motion";

import { questionTransition } from "../../animations/questionTransition";

export default function AnimatedQuestion({

    current,

    children

}) {

    return (

        <AnimatePresence mode="wait">

            <motion.div

                key={current}

                variants={questionTransition}

                initial="initial"

                animate="animate"

                exit="exit"

            >

                {children}

            </motion.div>

        </AnimatePresence>

    );

}