import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const router = useRouter();
  const { data: allQuestionsData } = trpc.question.getAll.useQuery();

  if (!allQuestionsData)
    return (
      <div className="flex justify-center pt-[30vh]">
        <Image src="/puff.svg" alt="loading" height="48px" width="48px" />
      </div>
    );

  return (
    <main className="container mx-auto flex flex-col items-center gap-10 p-4">
      <p className="text-2xl text-teal-400 lg:w-2/3">
        Below are the questions you have asked so far. Please click on one, to
        see the corresponding answers:
      </p>
      <ul className="space-y-2 lg:w-2/3">
        {allQuestionsData.map((question) => {
          return (
            <li
              key={question.id}
              className="cursor-pointer rounded-lg border border-neutral-500 p-4 hover:bg-teal-600"
              onClick={() => router.push("/question/" + question.id)}
            >
              {question.question}
            </li>
          );
        })}
      </ul>
    </main>
  );
};

export default Home;
