export const questions = [
  {
    id: 0,
    key: "name",
    type: "text",
    chapter: "Rolling Camera... and Action...",
    question: "What's your name?",
    placeholder: "e.g. Arjun",
    extraField: {
      key: "gender",
      label: "Character gender",
      helper: "The Name will be used to generate an accurate portrait for your chapters.",
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "", label: "Prefer not to say" },
      ],
    },
  },
  {
    id: 1,
    key: "passion",
    chapter: "The Spark",
    question: "What is the one thing you're truly passionate about?",
    placeholder: "Tell us about it..."
  },
  {
    id: 2,
    key: "beginning",
    chapter: "The Beginning",
    question: "How did it all start?",
    placeholder: "Describe the beginning of your Story..."
  },
  {
    id: 3,
    key: "challenge",
    chapter: "The Storm",
    question: "What was your biggest challenge?",
    placeholder: "Share the experience..."
  },
  {
    id: 4,
    key: "motivation",
    chapter: "The Fire",
    question: "What keeps you going?",
    placeholder: "What motivates you?"
  },
  {
    id: 5,
    key: "achievement",
    chapter: "The Victory",
    question: "What achievement makes you most proud?",
    placeholder: "Describe your proudest moment..."
  },
  {
    id: 6,
    key: "future",
    chapter: "The Future",
    question: "Where do you see yourself next?",
    placeholder: "Share your vision..."
  }
];