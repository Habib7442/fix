"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase";

type Props = {};

const page = (props: Props) => {
  const [orderData, setOrderData] = useState<any>(null);
  const params = useParams();
  let number = params.number[0];
  let order;

  console.log(number);
  const phoneQuery = query(
    collection(db, "orders"),
    where("phone", "==", number)
  );
  useEffect(() => {
    const unsubscribe = onSnapshot(phoneQuery, (snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc.data());
        order = doc.data();
        setOrderData(order);
      });
    });
    return () => unsubscribe();
  }, []);

  if (orderData) {
    return (
      // <div className="text-center">
      //   <h1 className="text-2xl font-bold mb-4">Thank you for your order</h1>
      //   <p className="text-lg">
      //     {" "}
      //     {"mr '"}{orderData.name}
      //   </p>
      //   <p></p>
      //   <p className="text-lg">Order total: {orderData.total}</p>
      // </div>
      <div className="stats bg-primary text-primary-content flex flex-col items-center w-96 m-auto">
        <div className="stat">
          <div className="nav-title text-center">Name</div>
          <div className="stat-value text-center">{orderData.name}</div>
          <div className="stat-actions"></div>
        </div>
        <div className="stat">
          <div className="nav-title text-center">Adress </div>
          <div className="stat-value text-center">
            {orderData.commune} {orderData.state}
          </div>
          <div className="stat-actions"></div>
        </div>

        <div className="stat">
          <div className="nav-title text-center">Phone Number </div>
          <div className="stat-value text-center">{orderData.phone}</div>
          <div className="stat-actions"></div>
        </div>
        <div className="stat">
          <div className="nav-title text-center">Total</div>
          <div className="stat-value text-center">{orderData.total}</div>
          <div className="stat-actions"></div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">This order has</h1>
      </div>
    );
  }
};

export default page;
