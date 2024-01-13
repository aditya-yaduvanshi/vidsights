const getAnswerForQuestion = async ({
  question,
}: {
  videos: string[];
  question: string;
}): Promise<{ question: string; answer: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const qa = {
        question,
        answer: "Sample Answer",
      };
      resolve(qa);
    }, 1000);
  });
};

export default getAnswerForQuestion;
