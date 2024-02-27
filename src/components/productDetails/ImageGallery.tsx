import React from "react";
import ImageGallery from "react-image-gallery";
// import "../../styles/imageGallery.css";
import { useAppSelector } from "@/lib/hooks";

function ProductImageGallery() {
  const productDes = useAppSelector((state) => state.productSlice.productDes);
  const storeData = useAppSelector((state) => state.storeSlice.store);

  const customColor = storeData?.color1;

  const galleryItems = productDes?.gallery?.map((i: any) => ({
    original: i,
    thumbnail: i,
  }));

  return (
    <div className="text-center">
      <div style={{ padding: "0 0px" }} className="p-0">
        <ImageGallery
          showNav={false}
          showPlayButton={false}
          showFullscreenButton={false}
          isRTL={true}
          showThumbnails={galleryItems?.length > 1}
          items={galleryItems}
        />
        <style>
          {`
          .image-gallery-thumbnail:hover {
            border: 1px solid ${customColor} !important;
            width: 100px !important;
          }

          .image-gallery-thumbnail.active {
            border: 1px solid ${customColor} !important;
            width: 100px !important;
            z-index: 1 !important;
          }
        `}
        </style>
      </div>
    </div>
  );
}

export default ProductImageGallery;
