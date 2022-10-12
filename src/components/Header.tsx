import Link from "next/link";

const Header = () => {
  return (
    <div className="relative flex items-center justify-center">
      <Link href="/">
        <div className="cursor-pointer text-5xl font-extrabold leading-normal text-neutral-100 md:text-[5rem]">
          FMRL<span className="text-purple-300">Q</span>
        </div>
      </Link>
    </div>
  );
};

export default Header;
