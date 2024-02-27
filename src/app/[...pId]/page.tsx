"use client";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getProductDescription } from "@/lib/reducers/productReducer";
import { useParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { FetchData } from "../../lib/FetchData";
import dynamic from "next/dynamic";
import RoundSpinner from "@/components/ui/RoundSpinner";
import Intro from "@/components/productDetails/Intro";
// import ProductCard from "@/components/ui/ProductCard";
// import LazyHTMLContent from "@/components/LazyHTMLContent";
// import Image from "next/image";

type Props = {};

const page = (props: Props) => {
  const params = useParams();
  const [upSellProducts, setUpSellProducts] = useState<any>();
  FetchData();
  let pId = params.pId[0];
  const user = useAppSelector((state) => state.authSlice?.userId);
  const productDes = useAppSelector((state) => state.productSlice?.productDes);
  const allProducts = useAppSelector((state) => state.productSlice?.products);
  const storeData = useAppSelector((state) => state.storeSlice?.store);
  const filterProduts = useAppSelector(
    (state) => state.productSlice.filteredProducts
  );
  const distpatch = useAppDispatch();
  console.log(pId, productDes);
  useEffect(() => {
    if (filterProduts && storeData && user) {
      const selectedProduct = filterProduts?.find(
        (item: any) => item.url === pId
      );
      distpatch(getProductDescription(selectedProduct));
    }
  }, [filterProduts, storeData]);
  useEffect(() => {
    if (allProducts) {
      const upSell = allProducts.filter(
        (product: any) => product.upsell !== false && product.url !== pId
      );
      setUpSellProducts(upSell);
    }
  }, [allProducts, pId]);

  const ProductImageGallery = dynamic(
    () => import("@/components/productDetails/ImageGallery"),
    {
      loading: () => (
        <div className="w-full flex justify-center items-center">
          {" "}
          <RoundSpinner />
        </div>
      ),
    }
  );

  const Form = dynamic(() => import("@/components/productDetails/form/Form"), {
    loading: () => (
      <div className="w-full h-full mt-12 flex justify-center items-center">
        <RoundSpinner />
      </div>
    ),
  });
  return (
    <div className="bg-red-300">
      <Intro />
      {/* <ProductImageGallery /> */}
    </div>
  );
};

export default page;
