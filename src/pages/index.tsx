import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { useForm, SubmitHandler } from "react-hook-form";
import AnswerQuestion from "../components/AnswerQuestion";
import Header from "../components/Header";
import { useRouter } from "next/router";

export type Inputs = {
  userQuestion?: string;
  userAnswer: string;
};

const Home: NextPage = () => {
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

  return (
    <>
      <Header />

      <main className="container mx-auto flex flex-col items-center p-4">
        {answerMutation.isLoading ? (
          "Saving your answer, one moment!"
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-10 lg:w-2/3"
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
