import { useCallback } from "react";
import useLocalStorage from "./useLocalStorage";

type InsightSession = {
  id: number;
  query: string;
  videos: string[];
  answers: {
    question: string;
    answer: string;
  }[];
  updatedAt: number;
};

const useInsightsSessions = () => {
  const [insightsSessions, setInsightsSessions] = useLocalStorage<
    InsightSession[]
  >("insightsSessions", []);

  const getSession = useCallback(
    (id: number) => {
      return insightsSessions.find((insight) => insight.id === id);
    },
    [insightsSessions]
  );

  const createSession = useCallback(
    (insight: Omit<InsightSession, "id" | "updatedAt">) => {
      const session: InsightSession = {
        id: Date.now(),
        query: insight.query,
        videos: insight.videos,
        answers: insight.answers,
        updatedAt: Date.now(),
      };
      setInsightsSessions((prev) => [session, ...prev]);
      return session;
    },
    []
  );

  const updateSession = useCallback(
    (id: number, insight: Partial<InsightSession>) => {
      setInsightsSessions((prev) => {
        const index = prev.findIndex((session) => session.id === id);
        if (index > -1) {
          prev[index] = {
            ...prev[index],
            ...insight,
            id,
            updatedAt: Date.now(),
          };
          return [...prev];
        }
        return prev;
      });
    },
    []
  );

  const deleteSession = useCallback((id: number) => {
    setInsightsSessions((prev) => prev.filter((session) => session.id !== id));
  }, []);

  return {
    insightsSessions,
    getSession,
    createSession,
    updateSession,
    deleteSession,
  };
};

export default useInsightsSessions;
