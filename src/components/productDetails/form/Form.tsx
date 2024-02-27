import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch, useAppStore } from "@/lib/hooks";
import { MdArrowDropDown } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { FaMinus } from "react-icons/fa6";
import { data } from "./Data";
import { FiShoppingCart } from "react-icons/fi";
import { useRouter } from "next/navigation";

import { setupInitialReceipt, addProduct } from "@/lib/reducers/receiptReducer";
import { setOrderId } from "@/lib/reducers/productReducer";
import RoundSpinner from "../../ui/RoundSpinner";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  getDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import axios from "axios";
import { FaCheck } from "react-icons/fa";
import { BsCheck } from "react-icons/bs";
import Link from "next/link";

const Form = () => {
  const router = useRouter();
  const distpatch = useAppDispatch();

  // states ------------------------->
  const [isFocused, setFocus] = useState(false);
  const productDes = useAppSelector((state) => state.productSlice.productDes);
  const receipt = useAppSelector((state) => state.receiptSlice);
  const storeData = useAppSelector((state) => state.storeSlice.store);
  const user = useAppSelector((state) => state.authSlice.userId);
  const productsInCart = useAppSelector((state) => state.receiptSlice.products);
  const orderId = useAppSelector((state) => state.productSlice.orderId);
  const [currentDate, setCurrentDate] = useState<number>(0); // قم بتحديد النوع كرقم (number)
  const [communeNames, setcommuneNames] = useState<any>();
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFreeDelivery, setIsFreeDelivery] = useState(false);
  const [isLimitExceed, setIsLimitExceed] = useState(false);

  // form data ---->
  const [formData, setFormData] = useState<any>({
    productId: productDes?.id,
    name: "",
    phone: "",
    state: "",
    commune: "",
    note: "",
    deleveryStatus: "1",
    deleveryPrice: "",
    paid: "0",
    qty: 1,
    options: {
      color: "",
      size: "",
      offer: "",
    },
    total: 0,
    paymentType: "دفع عند الاستلام",
    timeStamp: serverTimestamp(),
  });

  /**---- for create order with creat 10 numbers -------- */
  const handleDataCheckAndUpdate = async () => {
    if (formData.phone.length === 10) {
      // Check if product exists and add to 'orders' if not
      const q = query(
        collection(db, "orders"),
        where("name", "==", formData.name)
      );
      const querySnapshot = await getDocs(q);
      const { options, qty, productId, ...formDataWithoutQuantity } = formData;
      const dataToAdd = {
        ...formDataWithoutQuantity,
        productId: productId || "id", // Add a check to ensure productId is not undefined
        deleveryStatus: "20",
        user: user,
      };
      if (querySnapshot.empty) {
        const docRef = await addDoc(collection(db, "orders"), dataToAdd);
        distpatch(
          setOrderId({
            id: docRef.id,
          })
        );
      }
    }

    // Updating specific fields in 'orders'
    const fieldsToUpdate = ["name", "state", "commune", "phone", "qty"];
    for (let field of fieldsToUpdate) {
      const q = query(
        collection(db, "orders"),
        where("name", "==", formData.name)
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (docSnapshot) => {
        const docRef = doc(db, "orders", docSnapshot.id);
        await updateDoc(docRef, { [field]: formData[field] });
      });
    }
  };

  useEffect(() => {
    handleDataCheckAndUpdate();
  }, [
    formData.phone,
    formData.name,
    formData.state,
    formData.commune,
    formData.qty,
  ]);

  let isOrderCreated = false; // إنشاء متغير flag

  // --------A function to update information in the document -------//

  // formating date ========>

  // states ends here --------------------------->

  // useEffects starts here  --------------------------->
  useEffect(() => {
    const selectedStateItem = storeData?.delevery.states.find(
      (item: any) => item.name === formData?.state
    );
    if (selectedStateItem) {
      setFormData({
        ...formData,
        deleveryPrice: selectedStateItem.price,
      });
      const wilayaCode = selectedStateItem.wilaya_code;
      const matchingcommuneItems = data.filter(
        (commune: any) => commune.wilaya_code === wilayaCode
      );
      const communeNames = matchingcommuneItems.map(
        (commune: any) => commune.daira_name
      );
      setcommuneNames(communeNames);
    }
  }, [formData.state]);

  /**this useEffect to fetch time for subscription dashbord */
  useEffect(() => {
    const fetchDate = () => {
      const dateObj = new Date();
      const seconds = Math.floor(dateObj.getTime() / 1000);
      setCurrentDate(seconds);
    };

    fetchDate();

    const interval = setInterval(() => fetchDate(), 10000); // جلب التاريخ كل 10 ثوانٍ

    return () => clearInterval(interval); // دالة التنظيف
  }, []);

  // useEffect for setting the default quantity of product ---->

  useEffect(() => {
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      name: receipt.userName,
      phone: receipt.phone,
      state: receipt.nation,
      commune: receipt.commune,
      options: {
        ...prevFormData.options,
        offer: productDes?.offers[0]?.title,
        color: productDes?.options[0]?.colorOption[0]?.option,
        size: productDes?.options[1]?.colorOption[0]?.option,
      },
    }));
  }, [receipt]);

  // useEffects ends here  ----------------------------->

  // functions starts here ---------------------------->

  // handle form submission --------------->

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    /** for Api notification Telegram  */
    const maxChars = 25;
    // code for limiting the user order =====>

    const reqNum = storeData?.reqNumber;
    const reqTime = storeData?.reqTime;
    const storedRequests = JSON.parse(
      localStorage.getItem("requestTimestamps") || "[]"
    );
    const now = Date.now();
    // Filter out requests outside the reqTime window
    const recentRequests = storedRequests.filter(
      (timestamp: any) => now - timestamp < reqTime * 60 * 60 * 1000
    );
    // Check if request limit is exceeded
    if (recentRequests.length >= reqNum) {
      setIsLimitExceed(true);
      console.error("Request limit exceeded");
      // Optionally, you can show an error message to the user
      setIsLoading(false);
      return;
    }
    router.push("/thanks");
    // code for limiting the user order ends here =======>
    const truncateText = (text: string, maxLength: number) => {
      if (text.length > maxLength) {
        return text.substring(0, maxLength - 3) + "...";
      }
      return text;
    };
    const truncatedProductName = truncateText(productDes?.name, maxChars);
    const telegramBotToken = "6672968395:AAHFokejZq4r6GRRDHlm2FDqXk0-pXoQmOs";
    const chatId = storeData?.Idtelegram;

    /**-------- custom commune and state to arabic or french with dashbord to received in Api google sheet ---------- */
    let stateValue = "";
    let communeValue = "";
    if (storeData?.frenchs) {
      stateValue = data.filter((d) => d.wilaya_name === formData.state)[0]
        .wilaya_name_ascii;
      communeValue = data.filter((d) => d.commune_name === formData.commune)[0]
        .commune_name_ascii;
    } else if (storeData?.arabics) {
      stateValue = formData.state;
      communeValue = formData.commune;
    } else if (storeData?.numberS) {
      stateValue = data.filter((d) => d.wilaya_name === formData.state)[0]
        .wilaya_code;
      communeValue = data.filter((d) => d.commune_name === formData.commune)[0]
        .commune_name_ascii;
    } else {
      stateValue = formData.state;
      communeValue = formData.commune;
    }
    e.preventDefault();
    setIsLoading(true);

    distpatch(
      setupInitialReceipt({
        products: [],
        currencySymbol: storeData?.currencySymbol,
        userName: formData?.name,
        deliveryPrice: formData.deleveryPrice,
        phone: formData?.phone,
        nation: formData?.state,
        commune: formData?.commune,
      })
    );
    distpatch(
      addProduct({
        name: productDes?.name,
        price: productDes?.price,
        quantity: formData?.qty,
        options: {
          offer: formData?.options?.offer,
          size: formData?.options?.size,
          color: formData?.options?.color,
        },
      })
    );

    const newProduct = {
      name: productDes?.name,
      price: productDes?.price,
      quantity: formData?.qty,
      options: {
        offer: formData?.options?.offer,
        size: formData?.options?.size,
        color: formData?.options?.color,
      },
    };

    // Store the timestamp of the current request
    localStorage.setItem(
      "requestTimestamps",
      JSON.stringify([...recentRequests, now])
    );

    // update the existing document ----->
    if (orderId) {
      const orderRef = doc(db, "orders", orderId);
      const orderSnapshot = await getDoc(orderRef);
      const currentOrder = orderSnapshot.data();
      const updatedProducts = currentOrder?.products
        ? [...currentOrder.products, newProduct]
        : [newProduct];
      const updatedTotal = updatedProducts.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      );
      // Add the deliveryPrice to the total
      const totalWithDelivery = updatedTotal + formData?.deleveryPrice;

      updateDoc(orderRef, {
        deleveryPrice: formData?.deleveryPrice,
        deleveryStatus: "1",
        products: updatedProducts,
        total: totalWithDelivery,
      });
      console.log("Order updated");
    }

    // data adding to gooleSheet -------->
    const googleSheetsData = {
      ...formData,
    };
    try {
      const response = await axios.post(
        `${storeData?.googleShit}?action=addUser`,
        googleSheetsData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log("Data sent to Google Sheets -----> ");
    } catch (error) {
      console.error("Error sending data to Google Sheets:", error);
    }
  };

  // setFormValues ------------>
  const handleSetFormValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((prevValue: any) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  // functions ends here ------------------------------->

  return (
    <div className="w-full border-[1px] border-white-light rounded-md">
      <form
        onSubmit={handleFormSubmission}
        className="w-full bg-[#fbfbfb] flex flex-col gap-5 p-3 sm:p-4 rounded-md"
      >
        <div className="grid w-full grid-cols-2 h-[45px] sm:h-[50px] gap-4">
          <input
            type="text"
            required
            disabled={receipt.userName !== ""}
            name="name"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleSetFormValue(e)
            }
            placeholder="💁‍♂️ الاسم الكامل"
            className="w-full order-2 placeholder:text-[14px] text-end tracking-wide px-3 border-[1px] border-white-light rounded-md focus:outline-none placeholder:text-white-dark text-[16px] font-medium"
          />
          <input
            type="text"
            placeholder="📞 رقم الهاتف"
            name="phone"
            disabled={receipt.phone !== ""}
            autoComplete="off"
            required={true}
            minLength={10}
            maxLength={10}
            pattern="\d*"
            title="Enter the numeric values."
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleSetFormValue(e)
            }
            value={formData.phone}
            className="w-full order-1 text-end tracking-wide  placeholder:text-[14px] px-3 border-[1px] border-white-light rounded-md focus:outline-none placeholder:text-white-dark text-[16px] font-medium"
          />
        </div>
        <div className="grid w-full grid-cols-2 h-[45px] sm:h-[50px] gap-4">
          {/* state select box ---> */}
          <div className="w-full order-2 h-full relative">
            <select
              name="state"
              required
              disabled={receipt.nation !== ""}
              value={formData.state || "none"}
              onChange={(e: any) => handleSetFormValue(e)}
              className="w-full text-right h-full focus:outline-none border-[1px] border-white-light rounded-md px-3"
            >
              <option value="none" selected disabled hidden>
                اختر الولاية
              </option>
              {storeData?.delevery.states
                .filter((item: any) => item.hide === true)
                .map((item: any, index: number) => {
                  return (
                    <option key={index} value={item.name}>
                      {item.name}
                    </option>
                  );
                })}
            </select>
            <MdArrowDropDown className="text-[24px] sm:text-[28px] text-black absolute left-1 top-2 sm:top-3" />
          </div>
          {/* muncipal select box ---> */}
          <div className="w-full order-1 h-full relative">
            <select
              name="commune"
              required
              value={formData.commune}
              disabled={receipt.commune !== ""}
              onChange={(e: any) => handleSetFormValue(e)}
              className="w-full h-full text-right focus:outline-none border-[1px] border-white-light rounded-md px-3"
            >
              <>
                {communeNames ? (
                  communeNames.map((item: any, index: number) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))
                ) : (
                  <option value="none" selected disabled hidden>
                    اختر البلدية
                  </option>
                )}
              </>
            </select>
            <MdArrowDropDown className="text-[24px] sm:text-[28px] text-black absolute left-1 top-2 sm:top-3" />
          </div>
        </div>

        {/* Delivery price -----> */}
        <div className="w-full flex justify-between items-center">
          <div
            className="flex gap-1 justify-center items-center text-white-main bg-purple px-2 py-[2px] rounded-md text-[12px]"
            style={{
              background: storeData?.color2,
            }}
          >
            {isFreeDelivery ? (
              <p>مجانا</p>
            ) : (
              <>
                {formData.deleveryPrice ? (
                  <p>
                    {storeData?.currencySymbol} {formData?.deleveryPrice}
                  </p>
                ) : (
                  "اختر الولاية"
                )}
              </>
            )}
          </div>
          <p className="text-[16px] font-semibold text-black">سعر التوصيل 🚚</p>
        </div>

        {/* product more details --------->  */}
        <div className="w-full flex flex-col gap-5 sm:gap-6">
          {/* radio buttons ------>  */}
          {productDes?.offers.map((item: any, index: number) => {
            // التحقق من وجود قيمة item.price وأنها غير مساوية لـ null أو undefined
            if (item?.price) {
              return (
                <div key={index} className="flex flex-col gap-3 w-full">
                  <div
                    key={index}
                    onClick={() => {
                      setFormData((prevFormData: any) => ({
                        ...prevFormData,
                        options: {
                          ...prevFormData.options,
                          offer: item.title,
                        },
                      }));
                      if (item.deleveryoffre) {
                        setIsFreeDelivery(item.deleveryoffre);
                      } else setIsFreeDelivery(false);
                    }}
                    className="w-full flex justify-end items-center gap-3 cursor-pointer"
                  >
                    <div className="flex flex-row-reverse justify-center items-center gap-2 ">
                      <p className="text-[14px] sm:text-[16px] font-normal text-black">
                        {item.title}
                      </p>
                      <p
                        style={{ color: storeData?.color1 }}
                        className="font-semibold text-[14px] sm:text-[16px] flex"
                      >
                        <span>{storeData?.currencySymbol}</span>
                        <span> {item?.price}</span>
                      </p>
                    </div>
                    <div
                      style={{
                        borderWidth: "1px",
                        background:
                          formData?.options?.offer === item.title &&
                          storeData?.color1,
                        borderColor:
                          formData?.options?.offer === item.title
                            ? storeData?.color1
                            : "#000000",
                      }}
                      className="w-[22px] sm:w-[26px] cursor-pointer h-[22px] sm:h-[26px] rounded-full flex justify-center items-center"
                    >
                      <FaCheck className="text-white-main text-[12px] sm:text-[14px]" />
                    </div>
                  </div>
                </div>
              );
            }
            return null; // إذا كانت قيمة item.price تساوي null أو undefined
          })}

          {/* different colors of products ----->  */}

          {productDes?.options.map((option: any, index: number) => {
            if (option.color === "1") {
              return (
                <div
                  key={index}
                  className="flex flex-col gap-2 w-full items-end"
                >
                  <p className="text-[16px] font-semibold">
                    <b>{option.title}</b>
                  </p>
                  <div className="flex justify-center items-center gap-2">
                    {option.colorOption?.map(
                      (item: any, colorIndex: number) => (
                        <button
                          onClick={() =>
                            setFormData((prevFormData: any) => ({
                              ...prevFormData,
                              options: {
                                ...prevFormData.options,
                                color: item.option,
                              },
                            }))
                          }
                          key={colorIndex}
                          type="button"
                          style={{ background: item.color }}
                          className={`w-[30px] h-[30px] rounded-full flex justify-center items-center`}
                        >
                          {formData?.options?.color === item.option && (
                            <BsCheck className="text-[30px] text-white-main" />
                          )}
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            }
            return null; // إذا كانت قيمة option.color لا تساوي "1"
          })}

          {/* Choose the measurement */}
          {productDes?.options.map((option: any, index: number) => {
            if (option.color === "0") {
              return (
                <div
                  key={index}
                  className="flex flex-col gap-3 w-full items-end"
                >
                  <p className="text-[16px] font-semibold">
                    <b>{option.title}</b>
                  </p>
                  <div className="flex justify-center items-center gap-2 sm:gap-3">
                    {option.colorOption?.map((item: any, sizeIndex: number) => (
                      <button
                        key={sizeIndex}
                        type="button"
                        onClick={() =>
                          setFormData((prevFormData: any) => ({
                            ...prevFormData,
                            options: {
                              ...prevFormData.options,
                              size: item.option,
                            },
                          }))
                        }
                        style={{
                          background:
                            formData?.options?.size === item.option
                              ? storeData?.color1
                              : "#ffffff",
                          color:
                            formData?.options?.size === item.option
                              ? "#ffffff"
                              : "#000000",
                          outline:
                            formData?.options?.size === item.option
                              ? "2px solid " + storeData?.color1
                              : "",
                          outlineOffset: "3px",
                        }}
                        className="flex justify-center px-4 sm:px-5 hover:opacity-90 py-[5px] sm:py-[6px] rounded-[50px] items-center uppercase text-[14px] sm:text-[16px] font-semibold text-white-main"
                      >
                        {item.option}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }
            return null; // إذا كانت قيمة option.color لا تساوي "1"
          })}
        </div>

        {/* counter + submit button ----->  */}
        <div className="w-full h-[42px] sm:h-[50px] grid grid-cols-[3fr,1.3fr] gap-4 mt-2">
          <div className="flex flex-col gap-2">
            {isLimitExceed && (
              <p className="text-[12px] sm:text-[14px] text-red-800 -mt-7">
                Your limit exceed you cant do more order in an hour!
              </p>
            )}
            <button
              style={{
                background: !isFocused && storeData?.color2,
                borderColor: isFocused && storeData?.color2,
                color: isFocused ? storeData?.color2 : "#ffffff",
              }}
              onMouseEnter={() => setFocus(true)}
              onMouseLeave={() => setFocus(false)}
              type="submit"
              className={`text-center w-full h-[42px] sm:h-[50px] flex justify-center items-center gap-4 text-[14px] sm:text-[16px] font-semibold rounded-md hover:bg-transparent hover:border-[1px] hover:text-purple duration-200 ease-in-out`}
            >
              {isLoading && <RoundSpinner />}
              {productsInCart.length === 0 ? (
                <p>اشتري الان</p>
              ) : (
                <p> إضافة إلى الطلبات</p>
              )}
            </button>
          </div>

          <div className="w-full flex justify-end gap-2 sm:gap-4 items-center">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  qty: formData.qty + 1,
                })
              }
              className="w-[30px] sm:w-[36px] h-[30px] sm:h-[36px] border-[1px] border-white-light flex justify-center items-center rounded-md"
            >
              <AiOutlinePlus className="text-[18px] sm:text-[20px] text-black" />
            </button>
            <p className="text-[18px] sm:text-[20px] text-black font-semibold">
              {formData.qty}
            </p>
            <button
              type="button"
              disabled={formData.qty === 1}
              onClick={() =>
                setFormData({
                  ...formData,
                  qty: formData.qty - 1,
                })
              }
              className="w-[30px] sm:w-[36px] h-[30px] sm:h-[36px] disabled:opacity-50 border-[1px] border-white-light flex justify-center items-center rounded-md"
            >
              <FaMinus className="text-[18px] sm:text-[20px] text-black" />
            </button>
          </div>
        </div>
      </form>
      {/* Order summary ----->  */}
      <button
        style={{ color: storeData?.color2 }}
        onClick={() => setShowOrderSummary(!showOrderSummary)}
        className="flex w-full py-[9px] sm:py-[10px] bg-[#f7f8f1] border-[1px] border-white-light px-4 justify-end items-center gap-1 text-[16px] sm:text-[18px] font-semibold"
      >
        ملخص الطلبية
        <FiShoppingCart
          style={{ color: storeData?.color2 }}
          className="text-[20px] sm:text-[22px]"
        />
      </button>
      {showOrderSummary && (
        <div>
          {/* product name -----> */}
          {productsInCart.map((pro, index) => {
            return (
              <div
                key={index}
                className="w-full py-4 sm:py-5 flex justify-between items-center px-4"
              >
                <div className="flex justify-center items-center gap-1">
                  <div className="flex justify-center items-center">
                    <p className="text-[16px] text-black font-medium">
                      {storeData?.currencySymbol}
                    </p>
                    <p className="text-[14px] text-black font-medium">
                      {pro?.price}
                    </p>
                  </div>
                  <p
                    style={{ background: storeData?.color2 }}
                    className="text-white-main text-[12px] font-semibold px-[7px] py-[1px] rounded-md"
                  >
                    x{pro?.quantity}
                  </p>
                </div>
                <p className="text-[16px] text-end text-black font-medium sm:font-semibold">
                  {pro?.name}
                </p>
              </div>
            );
          })}

          {/* Delivery price ----->  */}
          <div className="w-full py-4 sm:py-5 flex justify-between items-center px-4 border-t-[1px] border-white-light">
            <div
              className="flex gap-1 justify-center items-center text-white-main bg-purple px-2 py-[2px] rounded-md text-[12px]"
              style={{
                background: storeData?.color2,
              }}
            >
              {isFreeDelivery ? (
                <p>مجانا</p>
              ) : (
                <>
                  {formData.deleveryPrice ? (
                    <p>
                      {storeData?.currencySymbol} {formData.deleveryPrice}
                    </p>
                  ) : (
                    "اختر الولاية"
                  )}
                </>
              )}
            </div>
            <p className="text-[16px] text-black font-medium sm:font-semibold">
              سعر التوصيل 🚚
            </p>
          </div>
          {/* total price ----->  */}
          <div className="w-full py-4 sm:py-5 flex justify-between items-center px-4 border-t-[1px] border-white-light">
            <div className="flex justify-center items-center gap-1">
              <p
                style={{ color: storeData?.color2 }}
                className="text-[22px] font-semibold sm:font-bold"
              >
                {storeData?.currencySymbol}
              </p>
              <p
                className="text-[22px] font-semibold sm:font-bold text-purple"
                style={{ color: storeData?.color2 }}
              >
                {productDes?.price * formData.qty + formData.deleveryPrice}
              </p>
            </div>
            <p className="text-[18px] text-black font-semibold sm:font-bold">
              المجموع
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
