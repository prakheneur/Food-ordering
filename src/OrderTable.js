import React from "react";
import "./OrderTable.css";

const orders = [
  { id: 1, order: "Pizza", payment: "Credit Card" },
  { id: 2, order: "Burger", payment: "Cash" },
  { id: 3, order: "Salad", payment: "PayPal" },
  { id: 4, order: "Pasta", payment: "Credit Card" },
];

const OrderTable = () => {
  const handleCancelOrder = (orderId) => {
    // Logic to cancel the order with the given orderId
    console.log(`Cancel order with ID ${orderId}`);
  };

  const handleCompleteOrder = (orderId) => {
    // Logic to mark the order with the given orderId as complete
    console.log(`Complete order with ID ${orderId}`);
  };

  return (
    <div className="order-table-container">
      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Your Order</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.order}</td>
              <td>{order.payment}</td>
              <td>
                <button onClick={() => handleCancelOrder(order.id)}>
                  Cancel
                </button>
                <button onClick={() => handleCompleteOrder(order.id)}>
                  Complete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
