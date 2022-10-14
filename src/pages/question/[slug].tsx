import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const QuestionPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  // to make TS happy for now
  if (!slug) {
    return <div className="text-center">you should not be here, be gone</div>;
  }

  const { data: questionData } = trpc.question.getSpecific.useQuery({
    questionId: slug.toString(),
  });
  const { data: allAnswersData } = trpc.answer.getAnswers.useQuery({
    questionId: slug.toString(),
  });

  if (!allAnswersData)
    return (
      <div className="flex justify-center pt-[30vh]">
        <Image src="/puff.svg" alt="loading" height="48px" width="48px" />
      </div>
    );

  return (
    <main className="container mx-auto flex flex-col items-center gap-10 p-4">
      <p className="text-2xl text-teal-400 lg:w-2/3">
        {questionData?.question}
      </p>
      <ul className="space-y-2 lg:w-2/3">
        {allAnswersData.length > 0 ? (
          allAnswersData.map((answer) => {
            return (
              <li
                key={answer.id}
                className="rounded-lg border border-dashed  border-neutral-500 p-4"
              >
                {answer.answer}
              </li>
            );
          })
        ) : (
          <li>Nobody has answered your question yet, check back later...</li>
        )}
      </ul>
    </main>
  );
};

export default QuestionPage;
