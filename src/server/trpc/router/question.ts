import { t } from "../trpc";
import { z } from "zod";

export const questionRouter = t.router({
  addQuestion: t.procedure
    .input(z.object({ question: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const entry = await ctx.prisma.question.create({
        data: {
          question: input.question,
          user: { connect: { id: ctx.session?.user?.id } },
        },
      });
      return entry;
    }),
  getRandom: t.procedure.query(({ ctx }) => {
    return ctx.prisma.question.findFirst({
      where: { answers: { none: {} } },
    });
  }),
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.question.findMany();
  }),
});
