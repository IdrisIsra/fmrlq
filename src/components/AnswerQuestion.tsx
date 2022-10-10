import { Question } from "@prisma/client";
import { UseFormRegister } from "react-hook-form";
import { Inputs } from "../pages/index";

type AnswerQuestionProps = {
  title: string;
  questionData?: Question | null;
  isLoading: boolean;
  register: UseFormRegister<Inputs>;
};

const AnswerQuestion = ({
  title,
  questionData,
  isLoading,
  register,
}: AnswerQuestionProps) => {
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="rounded-lg border border-dashed border-neutral-600 p-5 text-center text-2xl font-bold text-purple-300">
        {isLoading ? "fetching a question..." : questionData?.question}
      </div>
      <textarea
        placeholder="Answer"
        className="min-h-[10rem] w-full"
        {...register("userAnswer", { required: true })}
      />
    </div>
  );
};

export default AnswerQuestion;
