import { t } from "../trpc";
import { z } from "zod";
import { PrismaPromise, Question } from "@prisma/client";

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
  getSpecific: t.procedure
    .input(z.object({ questionId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.question.findFirst({
        where: { id: input.questionId },
      });
    }),
  getRandom: t.procedure.query(({ ctx }) => {
    // return ctx.prisma.question.findFirst({
    //   where: { answers: { none: {} } },
    // });

    const result = ctx.prisma.$queryRawUnsafe(
      `SELECT * FROM "Question" WHERE "userId" <> '${ctx.session?.user?.id}' ORDER BY RANDOM() LIMIT 1;`
    ) as PrismaPromise<Question[]>;
    return result;
  }),
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.question.findMany({
      where: { userId: ctx.session?.user?.id },
    });
  }),
});
