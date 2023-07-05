import React from "react";
import "./OrderTable.css";

const OrderTable = ({ nfts, cancel, finish }) => {
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
          {nfts.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.metadata}</td>
              <td>{order.payment / Math.pow(10, 9)} SUI</td>
              <td>
                <button
                  onClick={() => cancel(order.id)}
                  disabled={new Date() < order.cancel_after}
                >
                  {new Date() < order.cancel_after
                    ? `Cancel in ${
                        (order.cancel_after.getTime() - new Date().getTime()) /
                        1000
                      }s`
                    : "Cancel"}
                </button>
                <button onClick={() => finish(order.id)}>Complete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
