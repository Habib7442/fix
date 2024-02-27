"use client";

import React, { useEffect, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "./hooks";
import { setStore } from "./reducers/storeReducer";
import { fetchAccount } from "./reducers/accountReducer";
import { loginUser } from "./reducers/userReducer";

import {
  getProducts,
  setSelectedCategory,
  fetchFilteredProducts,
} from "./reducers/productReducer";
import { db } from "@/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

export const FetchData = () => {
  // states --------------------->

  const dispatch = useAppDispatch();
  const currentUrl = "https://areza.foorweb.store";
  const subdomain = currentUrl.split(".")[0];
  const subdomainWithoutProtocol = subdomain.replace(/(^\w+:|^)\/\//, "");

  const user = useAppSelector((state) => state.authSlice.userId);

  //states ends here ===============>

  // functions for fetching the data ===========>
  const fetchAllData = useCallback(() => {
    const accountQuery = query(
      collection(db, "account"),
      where("store", "==", `https://${subdomainWithoutProtocol}.foorweb.store/`)
    );
    const storeQuery = query(
      collection(db, "store"),
      where("user", "==", user)
    );
    const productsQuery = query(
      collection(db, "products"),
      where("user", "==", user)
    );

    const unsub1 = onSnapshot(accountQuery, (snapShot) => {
      const account: any = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))[0];
      dispatch(loginUser(account?.user));
      dispatch(fetchAccount(account));
    });

    const unsub2 = onSnapshot(storeQuery, (snapShot) => {
      const store: any = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))[0];
      if (store?.categories?.length) {
        dispatch(setSelectedCategory(store.categories[0]));
      }
      dispatch(setStore(store));
    });

    const unsub3 = onSnapshot(productsQuery, (snapShot) => {
      const products = snapShot.docs
        .map((doc) => {
          const { timeStamp, ...data } = doc.data();
          return { id: doc.id, ...data };
        })
        .filter((product: any) => product.deleted !== 1);

      dispatch(getProducts(products));
      dispatch(fetchFilteredProducts(products));
    });
    console.log("fetching data");
    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, [user, dispatch]);
  useEffect(() => {
    const unsubscribe = fetchAllData();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchAllData]);
};
