import { useAppSelector } from "@/lib/hooks";
import React from "react";

type Props = {};

const Heading = (props: Props) => {
  const storeData = useAppSelector((state) => state.storeSlice.store);

  return (
    <div className="flex flex-col justify-center items-center gap-3 py-6 sm:py-8">
      <div className="relative">
        {storeData?.texting?.heading2 && (
          <p className="text-[18px] sm:text-[24px] md:text-[28px] text-center font-semibold text-black">
            {storeData.texting.heading2}
          </p>
        )}
        <div
          className="absolute w-full h-[6px] -bottom-2 left-0 bg-purple/30"
          style={{
            background: `${storeData?.color1}40`,
          }}
        ></div>
      </div>
      {storeData?.texting?.heading3 && (
        <p className="text-[10px] sm:text-[16px] md:text-[18px] font-normal text-white-dark">
          {storeData?.texting?.heading3}
        </p>
      )}
    </div>
  );
};

export default Heading;
