import Image from "next/image";

const Loader = () => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center text-black">
      <div className="w-10 h-10 relative animate-spin">
        <Image src="/loader.svg" width={100} height={100} alt="loader" />
      </div>
    </div>
  );
};

export default Loader;
