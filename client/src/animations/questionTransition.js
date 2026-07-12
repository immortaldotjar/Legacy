export const questionTransition = {

    initial: {

        opacity: 0,

        y: 40,

        filter: "blur(10px)"

    },

    animate: {

        opacity: 1,

        y: 0,

        filter: "blur(0px)",

        transition: {

            duration: 0.5,

            ease: [0.22, 1, 0.36, 1]

        }

    },

    exit: {

        opacity: 0,

        y: -40,

        filter: "blur(10px)",

        transition: {

            duration: 0.35

        }

    }

};