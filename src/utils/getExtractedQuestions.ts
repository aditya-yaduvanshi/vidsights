import nlp from "compromise";

const getExtractedQuestions = (text: string): string[] => {
  const questions = nlp(text).questions().out("array");
  return questions;
};

export default getExtractedQuestions;
