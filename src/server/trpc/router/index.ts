// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { questionRouter } from "./question";
import { authRouter } from "./auth";
import { answerRouter } from "./answer";

export const appRouter = t.router({
  question: questionRouter,
  answer: answerRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
