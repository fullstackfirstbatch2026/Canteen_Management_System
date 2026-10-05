
import { useEffect, useState } from "react";
import api from "../services/api";
import SectionCard from "../components/SectionCard";

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [foodItems, setFoodItems] = useState([]);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [editingOrderId, setEditingOrderId] = useState(null);
    const [editFoodId, setEditFoodId] = useState("");
    const [editQuantity, setEditQuantity] = useState(1);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setError("");

            const response = await api.get(
                "/orders/with-details"
            );

            setOrders(response.data);
        } catch (err) {
            console.error(err);
            setError("Unable to load order history.");
        }
    };

    const loadFoodItems = async () => {
        try {
            const response = await api.get("/food-items");
            setFoodItems(response.data);
        } catch (err) {
            console.error(err);
            setError("Unable to load food items.");
        }
    };

    const handleConfirm = async (orderId) => {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            await api.put(
                `/orders/${orderId}/confirm`
            );

            setMessage(
                `Order #${orderId} confirmed successfully.`
            );

            await loadOrders();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to confirm order."
            );
        } finally {
            setLoading(false);
        }
    };

    const startEditing = async (order) => {
        setError("");
        setMessage("");

        await loadFoodItems();

        const firstItem = order.orderItems?.[0];

        if (!firstItem) {
            setError("No order item found.");
            return;
        }

        setEditingOrderId(order.orderId);
        setEditFoodId(firstItem.foodItem?.foodId || "");
        setEditQuantity(firstItem.quantity || 1);
    };

    const cancelEditing = () => {
        setEditingOrderId(null);
        setEditFoodId("");
        setEditQuantity(1);
    };

    const handleEdit = async (orderId) => {
        if (!editFoodId) {
            setError("Please select a food item.");
            return;
        }

        if (editQuantity <= 0) {
            setError("Quantity must be greater than zero.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setMessage("");

            await api.put(
                `/orders/${orderId}/edit`,
                {
                    foodId: Number(editFoodId),
                    quantity: Number(editQuantity)
                }
            );

            setMessage(
                `Order #${orderId} updated successfully.`
            );

            cancelEditing();

            await loadOrders();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to edit order."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">

            <div className="page-header">
                <div>
                    <h1>Order History</h1>
                    <p>
                        Review and manage previously placed
                        canteen orders.
                    </p>
                </div>
            </div>

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

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
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {orders.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="empty-state"
                                    >
                                        No order history
                                        available.
                                    </td>
                                </tr>
                            ) : (

                                orders.map((order) => {

                                    const isPlaced =
                                        order.status?.toUpperCase() ===
                                        "PLACED";

                                    const isConfirmed =
                                        order.status?.toUpperCase() ===
                                        "CONFIRMED";

                                    return (
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
                                                        "PLACED"}
                                                </span>
                                            </td>

                                            <td>

                                                {isPlaced && (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: "8px",
                                                            flexWrap: "wrap"
                                                        }}
                                                    >

                                                        <button
                                                            type="button"
                                                            className="secondary-button"
                                                            onClick={() =>
                                                                startEditing(
                                                                    order
                                                                )
                                                            }
                                                            disabled={
                                                                loading
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="primary-button"
                                                            onClick={() =>
                                                                handleConfirm(
                                                                    order.orderId
                                                                )
                                                            }
                                                            disabled={
                                                                loading
                                                            }
                                                        >
                                                            Confirm
                                                        </button>

                                                    </div>
                                                )}

                                                {isConfirmed && (
                                                    <span>
                                                        -
                                                    </span>
                                                )}

                                            </td>

                                        </tr>
                                    );
                                })
                            )}

                        </tbody>

                    </table>
                </div>

                {editingOrderId && (
                    <div
                        style={{
                            marginTop: "24px",
                            padding: "20px",
                            border: "1px solid #ddd",
                            borderRadius: "8px"
                        }}
                    >

                        <h3>
                            Edit Order #{editingOrderId}
                        </h3>

                        <div className="form-grid">

                            <div className="form-group">
                                <label htmlFor="editFood">
                                    Food Item
                                </label>

                                <select
                                    id="editFood"
                                    value={editFoodId}
                                    onChange={(event) =>
                                        setEditFoodId(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Food Item
                                    </option>

                                    {foodItems.map(
                                        (food) => (
                                            <option
                                                key={
                                                    food.foodId
                                                }
                                                value={
                                                    food.foodId
                                                }
                                            >
                                                {
                                                    food.foodName
                                                }{" "}
                                                - ₹
                                                {Number(
                                                    food.price
                                                ).toFixed(
                                                    2
                                                )}
                                            </option>
                                        )
                                    )}

                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="editQuantity">
                                    Quantity
                                </label>

                                <input
                                    id="editQuantity"
                                    type="number"
                                    min="1"
                                    value={
                                        editQuantity
                                    }
                                    onChange={(event) =>
                                        setEditQuantity(
                                            Number(
                                                event
                                                    .target
                                                    .value
                                            )
                                        )
                                    }
                                />
                            </div>

                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={() =>
                                        handleEdit(
                                            editingOrderId
                                        )
                                    }
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={
                                        cancelEditing
                                    }
                                    disabled={loading}
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    </div>
                )}

            </SectionCard>

        </div>
    );
}

export default OrderHistory;
