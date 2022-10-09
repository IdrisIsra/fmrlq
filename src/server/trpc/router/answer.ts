import { t } from "../trpc";
import { z } from "zod";

export const answerRouter = t.router({
  addAnswer: t.procedure
    .input(z.object({ answer: z.string(), questionId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const entry = await ctx.prisma.answer.create({
        data: {
          answer: input.answer,
          user: { connect: { id: ctx.session?.user?.id } },
          question: { connect: { id: input.questionId } },
        },
      });
      return entry;
    }),
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.answer.findMany();
  }),
});
