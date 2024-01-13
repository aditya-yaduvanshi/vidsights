const getTextFromAnswers = ({
  answers,
  type = "text",
}: {
  answers: { question: string; answer: string }[];
  type?: "text" | "html";
}) => {
  return answers
    .map((ans, i) => {
      if (type === "text")
        return `Que ${i + 1}. ${ans.question} \nAns ${i + 1}. ${ans.answer}`;
      return `
        <p><strong>Que ${i + 1}. </strong>${ans.question}</p>
        <p><strong>Ans ${i + 1}. </strong>${ans.answer}</p>
      `;
    })
    .join(type === "text" ? "\n\n" : "<br/>");
};

export default getTextFromAnswers;
