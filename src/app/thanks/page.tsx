"use client";

import React, { memo, useEffect, useState } from "react";
// import Wrapper from "../components/shared/wrappers/ComponentWrapper";
import Link from "next/link";
import { FaFacebookMessenger } from "react-icons/fa";
import Image from "next/image";
import { FiShoppingCart } from "react-icons/fi";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
// import Slogn from "../components/shared/slogn/Slogn";
import { getProductDescription } from "@/lib/reducers/productReducer";
// import Icons from "../components/shared/icons/socialmedia";
import ProductCard from "../../components/ui/ProductCard";

const ThanksPage = () => {
  const receipt = useAppSelector((state) => state.receiptSlice);
  const allProducts = useAppSelector((state) => state.productSlice.products);
  const storeData = useAppSelector((state) => state.storeSlice.store);
  const [upSellProducts, setUpSellProducts] = useState<any>();
  const distpatch = useAppDispatch();

  // getting the upsell products ======>
  useEffect(() => {
    if (allProducts) {
      const upSell = allProducts.filter(
        (product: any) => product.upsell !== false
      );
      setUpSellProducts(upSell);
    }
  }, [allProducts]);

  // ============ getting the product description ==============>
  const getProductDec = (id: string) => {
    if (upSellProducts) {
      const selectedProduct = upSellProducts?.find(
        (item: any) => item.url === id
      );
      distpatch(getProductDescription(selectedProduct));
    }
  };
  return (
    <>
      {/* for seo ========>  */}

      {/* <Slogn /> */}
      {/* <Icons /> */}
      <>
        <div className="w-full flex flex-col py-8 justify-center items-center">
          {/* Link to massenger account -----> */}
          <Link
            href="#"
            className="bg-[#0084ff] hover:bg-transparent ease-in-out duration-300 border-[1px] border-[#0084ff] group w-full flex justify-center items-center gap-3 max-w-[700px] rounded-md h-[45px] sm:h-[50px]"
          >
            <p className="text-[14px] sm:text-[16px] font-semibold text-white-main group-hover:text-[#0084ff]">
              إضغط هنا لتأكيد طلبك
            </p>
            <FaFacebookMessenger className="text-white-main text-[30px] sm:text-[32px] group-hover:text-[#0084ff]" />
          </Link>
          {/* shop logo -----------> */}
          <div className="w-[150px] sm:w-[300px] h-[150px] sm:h-[300px] relative">
            {/* <Image
              sizes="(max-width: 768px) 100vw, 33vw"
              src="/assets/logo.png"
              fill
              alt=""
              className="object-fill"
            /> */}
            {/* TODO REMEBER TO REPLACE THE LOGO  */}
          </div>
          {/* order summery ------------>  */}
          <div className="w-full max-w-[700px] border-[1px] border-white-light rounded-md">
            <p
              style={{ color: storeData?.color1 }}
              className="flex w-full py-[9px] sm:py-[10px] bg-[#f7f8f1] border-[1px] border-white-light px-4 justify-end items-center gap-1 text-[16px] sm:text-[18px] font-semibold"
            >
              ملخص الطلبية
              <FiShoppingCart
                style={{ color: storeData?.color1 }}
                className="text-[20px] sm:text-[22px]"
              />
            </p>
            {/* product name and its quantity -------->  */}
            {receipt?.products?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="w-full py-4  flex justify-between items-center px-4"
                >
                  <div className="flex justify-center items-center gap-1">
                    <div className="flex justify-center items-center gap-1">
                      <p className="text-[16px] text-black font-medium">
                        {item.price}
                      </p>
                      <p className="text-[16px] text-black font-medium">
                        {receipt.currencySymbol}
                      </p>
                    </div>
                    <p
                      style={{ background: storeData?.color2 }}
                      className="text-white-main w-[36px] text-center text-[12px] font-semibold py-[2px] rounded-md"
                    >
                      x {item.quantity}
                    </p>
                  </div>
                  <p className="text-[16px] text-end text-black font-medium sm:font-semibold">
                    {item.name && item.name}
                  </p>
                </div>
              );
            })}
            {/* Delivery price ----->  */}
            <div className="w-full py-4  flex justify-between items-center px-4 border-t-[1px] border-white-light">
              <div className="flex justify-center items-center gap-1">
                <p
                  className="text-white-main text-[12px] font-semibold px-[10px] py-[2px] bg-purple rounded-md"
                  style={{
                    background: storeData?.color1,
                  }}
                >
                  {receipt.currencySymbol} {receipt.deliveryPrice}
                </p>
              </div>
              <p className="text-[16px] text-black font-normal">
                سعر التوصيل 🚚
              </p>
            </div>
            {/* total price ----->  */}
            <div className="w-full py-4 flex justify-between items-center px-4 border-t-[1px] border-white-light">
              <div className="flex justify-center items-center gap-1">
                <div className="flex justify-center items-center gap-1">
                  <p
                    style={{ color: storeData?.color1 }}
                    className="text-[22px] font-semibold sm:font-bold"
                  >
                    {receipt.products &&
                      receipt.products.length > 0 &&
                      (
                        receipt.products.reduce(
                          (total, product) =>
                            total + product.price * (product.quantity || 1),
                          0
                        ) + (Number(receipt.deliveryPrice) || 0)
                      ).toFixed(2)}
                  </p>
                  <p
                    style={{ color: storeData?.color1 }}
                    className="text-[22px] font-semibold sm:font-bold"
                  >
                    {receipt.currencySymbol}
                  </p>
                </div>
              </div>
              <p className="text-[18px] text-black font-semibold sm:font-bold">
                المجموع
              </p>
            </div>
          </div>
          {/* related products --------------->  */}
          <div className="w-full flex flex-col gap-0 sm:gap-2 mt-2 sm:mt-8">
            {/* title ---->  */}
            {storeData?.Upsell && (
              <div className="flex flex-col justify-center items-center gap-3 py-6 sm:py-8">
                <div className="relative">
                  <p className="text-[26px] sm:text-[24px] md:text-[30px] text-center font-semibold text-black">
                    {storeData?.texting.heading4
                      ? storeData?.texting.heading4
                      : "منتجات أخرى تهمك"}
                  </p>
                  <div
                    style={{ background: storeData.color1 }}
                    className="absolute w-full h-[6px] -bottom-2 left-0 opacity-50"
                  ></div>
                </div>
                <p className="text-[14px] sm:text-[16px] md:text-[18px] font-normal text-white-dark">
                  {storeData?.texting.heading5
                    ? storeData?.texting.heading5
                    : "توصيل مجاني عند طلب اكثر من منتج"}
                </p>
              </div>
            )}
            {upSellProducts && (
              <div className="flex flex-wrap gap-6 justify-center">
                {upSellProducts.map((item: any, index: number) => {
                  return (
                    <ProductCard
                      image={item.image}
                      name={item.name}
                      key={index}
                      review={item.review}
                      price={item.price}
                      oldPrice={item.oldPrice}
                      prams={item.url}
                      description=""
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </>
      {/* <Footer /> */}
    </>
  );
};

export default memo(ThanksPage);
