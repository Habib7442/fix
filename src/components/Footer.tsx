import React from "react";
import Image from "next/image";
import { FaInstagram, FaFacebookSquare } from "react-icons/fa";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";

const Footer = () => {
  const store = useAppSelector((state) => state.storeSlice.store);
  const { footer: footerText, img, SocialMedia: socialMedia } = store || {};

  return (
    <>
      {footerText && img && socialMedia && (
          <div className="w-full flex justify-between items-center">
            {footerText && img && (
              <div className="flex flex-col gap-1 sm:gap-3 justify-center items-center">
                {/*  LOGO ------->  */}
                <div className="w-[45px] sm:w-[55px] h-[45px] sm:h-[50px] relative">
                  <Image
                    src={img}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover grayscale"
                    alt="slogn"
                  />
                </div>
                <p className="text-[12px] sm:text-[18px] font-medium text-black/80">
                  Hishop حقوق محفوظة
                </p>
              </div>
            )}
            {/* SOCIALS ICONS --------------> */}
            <div className="flex justify-center items-center gap-3 sm:gap-8">
              {socialMedia?.insta && (
                <Link
                  href={socialMedia?.insta}
                  target="blank"
                  style={{ color: "#8d8d8d" }}
                  className="flex justify-center items-center gap-6 hover:scale-105 duration-200 ease-in-out grayscale-100 hover:grayscale-0"
                >
                  <FaInstagram className="text-[30px] sm:text-[40px]" />
                </Link>
              )}
              {socialMedia?.facebook && (
                <Link
                  href={socialMedia?.facebook}
                  target="blank"
                  style={{ color: "#8d8d8d" }}
                  className="flex justify-center items-center gap-6 hover:scale-105 duration-200 ease-in-out grayscale-100 hover:grayscale-0"
                >
                  <FaFacebookSquare className="text-[30px] sm:text-[40px]" />
                </Link>
              )}
            </div>
          </div>
      )}
    </>
  );
};

export default Footer;
