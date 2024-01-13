const getAnswersFromVideos = async ({
  questions,
}: {
  videos: string[];
  questions: string[];
}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const qa = questions.map((question) => ({
        question,
        answer: "Sample Answer",
      }));
      resolve(qa);
    }, 3000);
  });
};

export default getAnswersFromVideos;
