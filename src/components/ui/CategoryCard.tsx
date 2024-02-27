import React from "react";
import Image from "next/image";
import { useAppSelector } from "@/lib/hooks";
interface Props {
  category: string;
  img: string;
  onSelect: any;
}

const CategoryCard: React.FC<Props> = ({ category, img, onSelect }: Props) => {
  // states ------------->
  const selectedCategory = useAppSelector(
    (state) => state.productSlice.selectedCategory
  );
  const storeData = useAppSelector((state) => state.storeSlice.store);
  // states ends here --------------->

  return (
    <button
      onClick={onSelect}
      style={{
        borderColor:
          category === selectedCategory ? storeData?.color1 : "#dedede",
      }}
      className={`w-full py-[14px] flex justify-center items-center gap-4 border-[1px] rounded-md`}
    >
      {img && (
        <div className="w-[30px] sm:w-[40px] md:w-[50px] h-[30px] sm:h-[40px] md:h-[50px] relative">
          <Image
            sizes="(max-width: 500px) 100px, 200px"
            src={img}
            fill
            className="object-cover"
            alt="product-image"
            // placeholder='blur'
          />
        </div>
      )}
      <p className="text-[14px] sm:text-[18px] font-semibold text-black">
        {category}
      </p>
    </button>
  );
};

export default CategoryCard;
