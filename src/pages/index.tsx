import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { useForm, SubmitHandler } from "react-hook-form";
import AnswerQuestion from "../components/AnswerQuestion";
import { useRouter } from "next/router";
import Image from "next/image";

export type Inputs = {
  userQuestion?: string;
  userAnswer: string;
};

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const utils = trpc.useContext();
  const router = useRouter();
  const { data: questionData, isLoading } = trpc.question.getRandom.useQuery();
  const questionMutation = trpc.question.addQuestion.useMutation();
  const answerMutation = trpc.answer.addAnswer.useMutation({
    async onSuccess() {
      // invalidates the question query and then navigates to success page
      await utils.question.getRandom.invalidate();
      await router.push("/success");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    if (questionData && formData.userQuestion) {
      questionMutation.mutateAsync({ question: formData.userQuestion });
      answerMutation.mutateAsync({
        answer: formData.userAnswer,
        questionId: questionData.id,
      });
    }
  };

  if (!sessionData?.user) {
    return (
      <main className="container mx-auto flex flex-col justify-center gap-5 p-4 lg:w-1/2">
        <h1 className="text-xl font-bold">
          {`Hello ${sessionData?.user ?? "stranger"},`}
        </h1>
        <p>
          Here you may ask a question, and answer questions others before you
          have asked. To do this, you will have to authenticate. There are 2
          main reasons for this requirement:
        </p>
        <ul className="list-decimal pl-5">
          <li>I wanted to implement authentication</li>
          <li>I didn&apos;t want people answering their own questions.</li>
        </ul>
        <p>
          Only your name and email address is subject to collection. They
          shan&apos;t be used for{" "}
          <span className="relative z-10 text-rose-500">
            neferious{" "}
            <span className="absolute left-4 top-3 z-0 text-xs text-neutral-200">
              spooky
            </span>
            <span className="absolute left-0 -top-2 z-0 text-xs text-neutral-200">
              spooooooky
            </span>
          </span>
          purposes. All your data, as ever, are belong to you. When you&apos;re
          ready:
        </p>
        <button
          className="rounded-md border border-neutral-100 px-4 py-2 text-xl shadow-lg hover:bg-neutral-600"
          onClick={sessionData ? () => signOut() : () => signIn()}
        >
          {sessionData ? "Sign out" : "Sign in"}
        </button>
      </main>
    );
  }

  return (
    <>
      <main className="container mx-auto flex flex-col items-center p-4">
        {answerMutation.isLoading ? (
          <Image src="/puff.svg" alt="loading" height="48px" width="48px" />
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-10 lg:w-2/3"
          >
            <div className="space-y-2">
              <h1 className="text-xl font-bold ">Ask a question:</h1>
              <input
                placeholder="Write"
                spellCheck="false"
                className=" w-full text-purple-300"
                {...register("userQuestion", { required: true })}
              />
            </div>
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
              Proceed!
            </button>
            {errors.userQuestion && (
              <span className="text-center text-rose-300">
                Please fill out the question field!
              </span>
            )}
            {errors.userAnswer && (
              <span className="text-center text-rose-300">
                Please fill out the answer field!
              </span>
            )}
          </form>
        )}
      </main>
    </>
  );
};

export default Home;
