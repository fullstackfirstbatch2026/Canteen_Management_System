import { useEffect, useState } from "react";
import api from "../services/api";
import SectionCard from "../components/SectionCard";

function OrderHistory() {
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
                setError(
                    "Unable to load order history."
                );
            }
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Order History</h1>
                    <p>
                        Review previously placed canteen
                        orders.
                    </p>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <SectionCard
                title="Order History"
                subtitle="All recorded orders"
            >
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Student</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="empty-state"
                                    >
                                        No order history
                                        available.
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
                                                "-"}
                                        </td>

                                        <td>
                                            {order.orderItems
                                                ?.map(
                                                    (
                                                        item
                                                    ) =>
                                                        `${
                                                            item
                                                                .foodItem
                                                                ?.foodName ||
                                                            "Food"
                                                        } × ${
                                                            item.quantity
                                                        }`
                                                )
                                                .join(
                                                    ", "
                                                ) ||
                                                "-"}
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

export default OrderHistory;