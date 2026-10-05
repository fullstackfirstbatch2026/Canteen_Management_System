import { useEffect, useState } from "react";
import api from "../services/api";
import SectionCard from "../components/SectionCard";

function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const response = await api.get(
                "/orders/details"
            );

            setOrders(response.data);
        } catch (error) {
            console.error(error);

            try {
                const response = await api.get("/orders");
                setOrders(response.data);
            } catch (fallbackError) {
                console.error(fallbackError);
                setError("Unable to load orders.");
            }
        }
    };

    const getFoodNames = (order) => {
        if (
            !order.orderItems ||
            order.orderItems.length === 0
        ) {
            return "-";
        }

        return order.orderItems
            .map(
                (item) =>
                    `${item.foodItem?.foodName || "Unknown"} × ${
                        item.quantity
                    }`
            )
            .join(", ");
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Order Management</h1>
                    <p>
                        View all orders and their associated
                        student and food information.
                    </p>
                </div>

                <button
                    className="secondary-button"
                    onClick={loadOrders}
                >
                    Refresh
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <SectionCard
                title="Orders"
                subtitle={`${orders.length} order(s)`}
            >
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Student</th>
                                <th>Food Items</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="empty-state"
                                    >
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr
                                        key={order.orderId}
                                    >
                                        <td>
                                            #{order.orderId}
                                        </td>

                                        <td>
                                            {order.student
                                                ?.name ||
                                                order.student
                                                    ?.studentName ||
                                                "-"}
                                        </td>

                                        <td>
                                            {getFoodNames(
                                                order
                                            )}
                                        </td>

                                        <td>
                                            {order.orderDate
                                                ? new Date(
                                                      order.orderDate
                                                  ).toLocaleString()
                                                : "-"}
                                        </td>

                                        <td>
                                            ₹
                                            {Number(
                                                order.totalAmount ||
                                                    0
                                            ).toFixed(2)}
                                        </td>

                                        <td>
                                            <span className="badge available">
                                                {order.status ||
                                                    "CONFIRMED"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </SectionCard>
        </div>
    );
}

export default OrderManagement;