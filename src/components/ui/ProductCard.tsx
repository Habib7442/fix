import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoStar } from "react-icons/io5";

type Props = {
  image: string;
  name: string;
  description: string;
  review: number;
  price: number;
  oldPrice: number;
  prams: string;
};

const ProductCard = ({
  image,
  name,
  description,
  price,
  oldPrice,
  review,
  prams,
}: Props) => {
  return (
    <>
      <Link href={prams}>
        <div className="w-full flex justify-center items-center">
          <div className="w-full max-w-[280px] flex flex-col justify-center items-center gap-2 px-0 py-0 sm:py-0 border-[1px] rounded-md hover:scale-105 duration-500 ease-in-out">
            <figure className="px-1 pt-1">
              <Image
                src={image}
                alt="Product"
                width={384}
                height={384}
                className="card-title rounded-md"
              />
            </figure>
            <div className=" items-center text-center  px-1 pt-1">
              <h3 className="text-[14px] text-center sm:text-[16px] font-medium text-black">
                {name}!
              </h3>

              <div className="rating px-1 pt-1">
                <input
                  type="radio"
                  name="rating-2"
                  className="mask mask-star-2 bg-orange-400"
                />
                <input
                  type="radio"
                  name="rating-2"
                  className="mask mask-star-2 bg-orange-400"
                  checked
                />
                <input
                  type="radio"
                  name="rating-2"
                  className="mask mask-star-2 bg-orange-400"
                />
                <input
                  type="radio"
                  name="rating-2"
                  className="mask mask-star-2 bg-orange-400"
                />
                <input
                  type="radio"
                  name="rating-2"
                  className="mask mask-star-2 bg-orange-400"
                />
              </div>
              {/* {[...Array(review)].map((_, index) => {
                return (
                  <IoStar
                    key={index}
                    className={`text-primary ${
                      index < review ? "text-primary" : "text-gray-300"
                    }`}
                  />
                );
              })}*/}
            </div>
            <div className="flex justify-center items-center gap-4 mb-1">
              <p className="text-[14px] sm:text-[16px] text-purple font-medium ">
                 {price} دج
              </p>
              <p className="text-[14px] sm:text-[16px] text-black/80 font-medium line-through">
                {oldPrice}دج
              </p>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default ProductCard;
