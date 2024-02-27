import * as React from "react";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { Bar, BarChart, ResponsiveContainer } from "recharts";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FaChartSimple } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import Image from "next/image";
import { useAppSelector } from "@/lib/hooks";

export function DrawerChart() {
  const [goal, setGoal] = React.useState(350);

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)));
  }
  const storeData = useAppSelector((state) => state.storeSlice.store);
  const recipt = useAppSelector((state) => state.receiptSlice);
  const img = storeData?.img;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <FaChartSimple />
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div className="w-full max-w-[1000px] m-auto flex flex-col gap-4 lg:gap-2 py-8 lg:px-0 px-4 justify-center items-center">
            {/* top header ------>  */}
            <div className="flex w-full justify-between items-center lg:px-0 px-8">
              <p className="text-black text-[20px] sm:text-[30px] font-medium">
                قائمة المشتريات
              </p>
            </div>
            {/* shop logo -----------> */}
            <div className="w-[100px] sm:w-[150px] h-[100px] sm:h-[150px] relative">
              <Image
                src={img}
                fill
                alt=""
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-fill"
              />
            </div>
            {/* products table ------->  */}
            <div className="w-full max-h-[300px] overflow-auto hideScroll max-w-[750px] flex flex-col  border-[1px] border-black/20 rounded-md ">
              {/* header -->  */}
              <div className="w-full py-[6px] sm:py-2 grid grid-cols-[1fr,1fr,3.2fr] bg-black/10 px-6">
                {/* price */}
                <p
                  style={{ color: storeData?.color1 }}
                  className="w-full text-[18px] sm:text-[20px] flex justify-start items-center font-medium"
                >
                  سعر
                </p>
                {/* quantity */}
                <p
                  style={{ color: storeData?.color1 }}
                  className="w-full text-[18px] sm:text-[20px] flex justify-center items-center font-medium"
                >
                  كمية
                </p>
                {/* name*/}
                <p
                  style={{ color: storeData?.color1 }}
                  className="w-full text-[18px] sm:text-[20px] flex justify-end items-center font-medium"
                >
                  اسم المنتج
                </p>
              </div>
              {/* rows ---->  */}
              {recipt?.products.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`w-full py-[6px] sm:py-2 grid grid-cols-[1fr,1fr,3.2fr] ${
                      recipt?.products.length === index + 1
                        ? "border-none"
                        : "border-b-[1px] border-black/20"
                    }  px-6`}
                  >
                    {/* price */}
                    <p className="w-full text-[14px] sm:text-[16px] flex justify-start items-center font-medium">
                      {item.price}
                    </p>
                    {/* quantity */}
                    <p className="w-full  text-[14px] sm:text-[16px] flex justify-center items-center font-medium">
                      {item.quantity}
                    </p>
                    {/* name*/}
                    <p className="w-full text-[14px] sm:text-[16px]  text-end flex justify-end items-center font-medium">
                      {item.name}
                    </p>
                  </div>
                );
              })}
            </div>
            {/* total and delivery price --------->  */}
            <div className="w-full max-w-[750px] flex flex-col border-[1px] border-black/20 rounded-md mt-2">
              {/* delivery ---->  */}
              <div className="w-full py-[10px] sm:py-[12px] flex flex-row-reverse justify-between items-center px-6">
                <p className="text-[16px] font-semibold">سعر التوصيل 🚚</p>
                <div className="flex justify-center items-center gap-1">
                  <p
                    className="text-white-main text-[12px] font-semibold px-[10px] py-[2px] bg-purple rounded-md"
                    style={{
                      background: storeData?.color1,
                    }}
                  >
                    {recipt?.currencySymbol} {recipt.deliveryPrice}
                  </p>
                </div>
              </div>
              {/* total price ------>  */}
              <div className="w-full py-[6px] sm:py-2 flex justify-between items-center px-6 border-t-[1px] border-white-light">
                <div className="flex justify-center items-center gap-1">
                  <div className="flex flex-row-reverse justify-center items-center gap-1">
                    <p
                      style={{ color: storeData?.color1 }}
                      className="text-[20px] sm:text-[22px] font-semibold sm:font-bold"
                    >
                      {recipt.products &&
                        recipt.products.length > 0 &&
                        (
                          recipt.products.reduce(
                            (total, product) =>
                              total + product.price * (product.quantity || 1),
                            0
                          ) + (Number(recipt.deliveryPrice) || 0)
                        ).toFixed(2)}
                    </p>
                    <p
                      style={{ color: storeData?.color1 }}
                      className="text-[20px] sm:text-[22px] font-semibold sm:font-bold"
                    >
                      {recipt.currencySymbol}
                    </p>
                  </div>
                </div>
                <p className="text-[18px] text-black font-semibold sm:font-bold">
                  المجموع
                </p>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button>CheckOut</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
