import React, { useState } from "react";
import Menu from "./Menu";
import Categories from "./Categories";
import items from "./data";
import logo from "./logo.JPG";
import OrderTable from "./OrderTable";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const allCategories = ["all", ...new Set(items.map((item) => item.category))];

const App = () => {
  const [menuItems, setMenuItems] = useState(items);
  const [activeCategory, setActiveCategory] = useState("");
  const [categories, setCategories] = useState(allCategories);
  const [showOrderTable, setShowOrderTable] = useState(false);

  const filterItems = (category) => {
    setActiveCategory(category);
    if (category === "all") {
      setMenuItems(items);
      return;
    }
    const newItems = items.filter((item) => item.category === category);
    setMenuItems(newItems);
  };

  const handleYourKartClick = () => {
    setShowOrderTable(!showOrderTable);
  };

  return (
    <Router>
      <main>
        {showOrderTable && <OrderTable />}
        <section className="menu section">
          <div className="title">
            <img src={logo} alt="logo" className="logo" />
            <h2>Menu List</h2>
            <div className="underline"></div>
          </div>
          <Route path="/order-table">
            <OrderTable />
          </Route>
          <Categories
            categories={categories}
            activeCategory={activeCategory}
            filterItems={filterItems}
          />
          <Menu items={menuItems} />
        </section>
      </main>
    </Router>
  );
};

export default App;
