import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { IoExitOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  return (
    <div className="relative flex items-center justify-center">
      {sessionData && (
        <button
          className="absolute left-2 flex justify-center rounded-md border border-neutral-100 px-4 py-2 text-xl shadow-lg hover:bg-neutral-600 lg:left-10 lg:w-24"
          onClick={() => router.push("/profile")}
        >
          <CgProfile className="text-3xl" width={48} />
        </button>
      )}
      <Link href="/">
        <div className="cursor-pointer text-5xl font-extrabold leading-normal text-neutral-100 md:text-[5rem]">
          FMRL<span className="text-purple-300">Q</span>
        </div>
      </Link>
      {sessionData && (
        <button
          className="absolute right-2 flex justify-center rounded-md border border-neutral-100 px-4 py-2 text-xl shadow-lg hover:bg-neutral-600 lg:right-10 lg:w-24"
          onClick={() => signOut()}
        >
          <IoExitOutline className="text-3xl" width={48} />
        </button>
      )}
    </div>
  );
};

export default Header;
