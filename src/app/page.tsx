"use client";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { FetchData } from "../lib/FetchData";
import Filter from "@/components/Filter";
import {
  fetchFilteredProducts,
  setSelectedCategory,
} from "@/lib/reducers/productReducer";
import Footer from "../components/Footer";
import { FiLoader } from "react-icons/fi";

export default function Home() {
  FetchData();
  const distpatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const user = useAppSelector((state) => state.authSlice.userId);
  const storeData = useAppSelector((state) => state.storeSlice.store);
  const allProducts = useAppSelector((state) => state.productSlice?.products);
  const filterProduts = useAppSelector(
    (state) => state.productSlice.filteredProducts
  );

  useEffect(() => {
    setIsLoading(!filterProduts || !storeData);
  }, [filterProduts, storeData]);

  const handleFilterProduct = useCallback(
    (category: any) => {
      distpatch(setSelectedCategory(category));
      const filtered =
        category === "كل المنتجات"
          ? allProducts
          : allProducts?.filter(
              (product: any) => product.category_id === category
            );
      distpatch(fetchFilteredProducts(filtered));
      console.log(filtered);
    },
    [distpatch, allProducts]
  );

  return (
    <>
      {isLoading ? (
        <div className="w-full h-[100vh] flex justify-center items-center">
          <FiLoader className="w-[50px] h-[50px]" />
        </div>
      ) : (
        <div className="w-full flex flex-col justify-center items-center">
          {/*   PROMO BANNER ---------> */}
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

          {/*   DIFFERENT CATEGORIES -------------> */}
          <div className="w-full">
            <Filter filterProducts={handleFilterProduct} />
          </div>
          {/* PRODUCTS --------------->   */}
          <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 py-4 sm:py-6">
            {/* PRODUCT CARD ------->  */}
            {filterProduts?.map((item: any, index: number) => {
              return (
                <ProductCard
                  key={index + item.id}
                  image={item.image}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  oldPrice={item.oldPrice}
                  prams={item.url}
                  review={item.review}
                />
              );
            })}
          </div>
          <Footer />
        </div>
      )}
    </>
  );
}
