import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="relative flex items-center justify-center">
      <Link href="/">
        <div className="cursor-pointer text-5xl font-extrabold leading-normal text-neutral-100 md:text-[5rem]">
          FMRL<span className="text-purple-300">Q</span>
        </div>
      </Link>
      {sessionData && (
        <button
          className="absolute right-2 rounded-md border border-neutral-100 px-4 py-2 text-xl shadow-lg hover:bg-neutral-600 lg:right-10"
          onClick={() => signOut()}
        >
          {"Sign out"}
        </button>
      )}
    </div>
  );
};

export default Header;
