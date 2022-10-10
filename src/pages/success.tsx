import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useForm, SubmitHandler } from "react-hook-form";
import AnswerQuestion from "../components/AnswerQuestion";
import Header from "../components/Header";

const Home: NextPage = () => {
  const utils = trpc.useContext();
  const { data: questionData, isLoading } = trpc.question.getRandom.useQuery();
  const answerMutation = trpc.answer.addAnswer.useMutation({
    async onSuccess() {
      // refetches posts after a post is added
      await utils.question.getRandom.invalidate();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ userAnswer: string }>();

  const onSubmit: SubmitHandler<{ userAnswer: string }> = (formData) => {
    if (questionData) {
      answerMutation.mutateAsync({
        answer: formData.userAnswer,
        questionId: questionData.id,
      });
      reset();
    }
  };

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="container mx-auto flex flex-col items-center gap-10 p-4">
        {answerMutation.isLoading ? (
          "Saving your answer, one moment!"
        ) : (
          <>
            <p className="lg:w-2/3">
              Your question was added to the database successfully. We&apos;ll
              be letting you know when people answer it! You may continue
              answering questions in the meantime.
            </p>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-10 lg:w-2/3"
            >
              <AnswerQuestion
                title={"Answer a question:"}
                isLoading={isLoading}
                questionData={questionData}
                register={register}
              />
              <button
                className="w-full rounded-md border border-neutral-100 px-4 py-2 text-xl shadow-lg hover:bg-neutral-600"
                type="submit"
              >
                Answer
              </button>
              {errors.userAnswer && (
                <span className="text-center text-rose-300">
                  Please fill out the answer field!
                </span>
              )}
            </form>
          </>
        )}
      </main>
    </>
  );
};

export default Home;