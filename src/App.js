import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import Categories from "./Categories";
import items from "./data";
import logo from "./logo.JPG";
import OrderTable from "./OrderTable";
import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import {
  JsonRpcProvider,
  TransactionBlock,
  devnetConnection,
} from "@mysten/sui.js";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const allCategories = ["all", ...new Set(items.map((item) => item.category))];

export const CONTRACT_PACKAGE =
  "0xf0001c2165bc5541a3943468d0051c33ce4439933be00b8967c5f086d60ba8a7";
export const CONTRACT_DATA_OBJECT =
  "0x16d8e3676c9200f5c4d4d8747dd4216a7e6993f72593d64e9bf738f8aba5d5fd";
export const PIZZA_MODULE = "pizzahouse";
export const NFT_AMOUNT = 4 * 100000000;

const App = () => {
  const [menuItems, setMenuItems] = useState(items);
  const [activeCategory, setActiveCategory] = useState("");
  const [categories, setCategories] = useState(allCategories);
  const [showOrderTable, setShowOrderTable] = useState(false);
  const [nfts, setNfts] = useState([]);

  const wallet = useWallet();
  const provider = new JsonRpcProvider(devnetConnection);

  const refreshNFTs = async () => {
    if (!wallet.connected || !wallet.address) return;
    const ownedObjects = await provider.getOwnedObjects({
      owner: wallet.address,
      filter: {
        MatchAll: [{ StructType: `${CONTRACT_PACKAGE}::pizzahouse::OrderNFT` }],
      },
      options: {
        showType: true,
        showContent: true,
      },
    });
    const nfts = ownedObjects.data
      .map((val) => {
        const { data } = val;
        if (!data) return null;
        const { objectId, content } = data;
        if (!content || content.dataType !== "moveObject") return null;

        return {
          id: objectId,
          metadata: content.fields.metadata,
          payment: Number.parseInt(content.fields.payment),
          cancel_after: new Date(Number.parseInt(content.fields.cancel_after)),
        };
      })
      .filter((val) => val !== null);
    console.log(nfts);
    setNfts(nfts);
  };

  useEffect(() => {
    if (!wallet.connected) return;
    refreshNFTs();
  }, [wallet.connected]);

  const filterItems = (category) => {
    setActiveCategory(category);
    if (category === "all") {
      setMenuItems(items);
      return;
    }
    const newItems = items.filter((item) => item.category === category);
    setMenuItems(newItems);
  };

  const handleYourKartClick = async () => {
    await refreshNFTs();
    setShowOrderTable(!showOrderTable);
  };

  const signAndExecuteTransactionBlock = async (txb) => {
    if (!wallet.connected) return;
    try {
      const res = await wallet.signAndExecuteTransactionBlock({
        // @ts-ignore
        transactionBlock: txb,
      });
      console.log(res);
      await refreshNFTs();
      setTimeout(refreshNFTs, 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const placeOrder = async (metadata) => {
    if (!metadata) return;

    const txb = new TransactionBlock();

    const [coin] = txb.splitCoins(txb.gas, [txb.pure(NFT_AMOUNT)]);

    txb.moveCall({
      target: `${CONTRACT_PACKAGE}::${PIZZA_MODULE}::place_order`,
      arguments: [
        txb.pure(metadata), // Metadata
        coin, // Coin
        txb.object("0x6"),
      ],
    });

    await signAndExecuteTransactionBlock(txb);
  };

  const cancel = async (order_id) => {
    const txb = new TransactionBlock();

    txb.moveCall({
      target: `${CONTRACT_PACKAGE}::${PIZZA_MODULE}::cancel_order`,
      arguments: [txb.object(order_id), txb.object("0x6")],
    });

    await signAndExecuteTransactionBlock(txb);
  };

  const finish = async (order_id) => {
    const txb = new TransactionBlock();

    txb.moveCall({
      target: `${CONTRACT_PACKAGE}::${PIZZA_MODULE}::finish_order`,
      arguments: [txb.object(CONTRACT_DATA_OBJECT), txb.object(order_id)],
    });

    await signAndExecuteTransactionBlock(txb);
  };

  return (
    <main>
      {showOrderTable && <OrderTable nfts={nfts} cancel={cancel} finish={finish} />}
      <section className="menu section">
        <div className="title">
          <img src={logo} alt="logo" className="logo" />
          <ConnectButton />
          <h2>Menu List</h2>
          <div className="underline"></div>
        </div>
        <button onClick={handleYourKartClick}>YourKart</button>
        <Categories
          categories={categories}
          activeCategory={activeCategory}
          filterItems={filterItems}
        />
        <Menu items={menuItems} onClick={placeOrder} />
      </section>
    </main>
  );
};

export default App;
