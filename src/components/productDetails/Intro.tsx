import React, { useEffect, useState } from "react";
import { IoStar } from "react-icons/io5";
import { useAppSelector } from "../../lib/hooks";
import Image from "next/image";
import Form from "./form/Form";

const Intro = () => {
  const productDes = useAppSelector((state) => state.productSlice.productDes);
  const storeData = useAppSelector((state) => state.storeSlice.store);
  const [discount, setDiscount] = useState<number>();

  const calculateDiscount = () => {
    const dis =
      ((productDes?.oldPrice - productDes?.price) / productDes?.oldPrice) * 100;
    setDiscount(Math.floor(dis));
  };

  useEffect(() => {
    calculateDiscount();
  }, []);

  return (
    <div className="hero min-h-screen ">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center flex flex-col items-center  ">
          <h1 className="text-3xl font-bold">
            {" "}
            {productDes?.name && productDes?.name}
          </h1>{" "}
          <Image
            src={productDes?.image}
            alt="product"
            width={500}
            height={500}
          />
          <p className="py-6">{productDes?.short && productDes?.short}</p>{" "}
        </div>
        {""}
        <div className="card shrink-0 w-full max-w-sm shadow-2xl  ">
          {" "}
          <div className="card-body bg-white">
            <Form />
            <div className="flex justify-center items-center gap-4">
              <div className="flex justify-center items-center">
                <p className="text-[18px] text-black text-end font-semibold">
                  {productDes?.short && productDes?.short}
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center gap-4">
              <div className="flex justify-center items-center">
                <p className="text-[20px] line-through font-normal text-black/80">
                  {storeData?.currencySymbol}
                </p>
                <p className="text-[20px] line-through font-normal text-black/80">
                  {productDes?.oldPrice}
                </p>
              </div>
              <div className="flex justify-center items-center">
                <p
                  style={{ color: storeData?.color1 }}
                  className="text-[24px] font-bold"
                >
                  {storeData?.currencySymbol}
                </p>
                <p
                  style={{ color: storeData?.color1 }}
                  className="text-[24px] font-bold"
                >
                  {productDes?.price}
                </p>
              </div>
              {/* discount ----->  */}
              <p
                style={{ background: storeData?.color2 }}
                className="text-white font-semibold px-4 py-[3px] text-white-main rounded-2xl"
              >
                {discount}%
              </p>
            </div>
            <div className="flex items-center gap-2">
              {[...Array(productDes?.review)].map((_, index) => {
                return (
                  <IoStar
                    key={index}
                    className={`text-yeyellow-500 ${
                      index < productDes?.review
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;

// <div className="w-full flex flex-col gap-0 lg:gap-3 items-end">
//   <div className="flex justify-center items-center gap-2">
//     {storeData?.comment && (
//       <div className="px-[10px] py-[3px] bg-[#ffc10a] text-[12px] tracking-wider font-bold text-white-main rounded-md">
//         {storeData?.comment}
//       </div>
//     )}
//     <p className="text-[26px] text-black text-end font-semibold">
//       {productDes?.name && productDes?.name}
//     </p>
//   </div>
//   <div className="flex justify-center items-center gap-4">
//     <div className="flex justify-center items-center">
//       <p className="text-[18px] text-black text-end font-semibold">
//         {productDes?.short && productDes?.short}
//       </p>
//     </div>
//   </div>
//   <div className="flex justify-center items-center gap-4">
//     <div className="flex justify-center items-center">
//       <p className="text-[20px] line-through font-normal text-black/80">
//         {storeData?.currencySymbol}
//       </p>
//       <p className="text-[20px] line-through font-normal text-black/80">
//         {productDes?.oldPrice}
//       </p>
//     </div>
//     <div className="flex justify-center items-center">
//       <p
//         style={{ color: storeData?.color1 }}
//         className="text-[24px] font-bold"
//       >
//         {storeData?.currencySymbol}
//       </p>
//       <p
//         style={{ color: storeData?.color1 }}
//         className="text-[24px] font-bold"
//       >
//         {productDes?.price}
//       </p>
//     </div>
//     {/* discount ----->  */}
//     <p
//       style={{ background: storeData?.color2 }}
//       className="text-white font-semibold px-4 py-[3px] text-white-main rounded-2xl"
//     >
//       {discount}%
//     </p>
//   </div>
//   <div className="flex justify-center items-center gap-1">
//     {Array.from(Array(parseInt(productDes?.review || 0)).keys()).map(
//       (item, index) => (
//         <IoStar
//           key={index}
//           className="text-[20px] sm:text-[24px] text-yellow"
//         />
//       )
//     )}
//   </div>
// </div>
