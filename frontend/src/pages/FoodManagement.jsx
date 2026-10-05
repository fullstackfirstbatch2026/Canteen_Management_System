import { useEffect, useState } from "react";
import api from "../services/api";
import SectionCard from "../components/SectionCard";

function FoodManagement() {
    const [foodItems, setFoodItems] = useState([]);

    const [form, setForm] = useState({
        foodName: "",
        price: "",
        availableQuantity: "",
        available: true,
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadFoodItems();
    }, []);

    const loadFoodItems = async () => {
        try {
            const response = await api.get("/food-items");
            setFoodItems(response.data);
        } catch (error) {
            console.error(error);
            setError("Unable to load food items.");
        }
    };

    const handleChange = (event) => {
        const { name, value, type, checked } =
            event.target;

        setForm({
            ...form,
            [name]:
                type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        try {
            await api.post("/food-items", {
                foodName: form.foodName,
                price: Number(form.price),
                availableQuantity: Number(
                    form.availableQuantity
                ),
                available: form.available,
            });

            setMessage(
                "Food item has been added successfully."
            );

            setForm({
                foodName: "",
                price: "",
                availableQuantity: "",
                available: true,
            });

            await loadFoodItems();
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                    "Unable to add food item."
            );
        }
    };

    const deleteFoodItem = async (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this food item?"
            )
        ) {
            return;
        }

        try {
            await api.delete(`/food-items/${id}`);

            setMessage(
                "Food item has been deleted successfully."
            );

            await loadFoodItems();
        } catch (error) {
            console.error(error);
            setError("Unable to delete food item.");
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Food Management</h1>
                    <p>
                        Manage the canteen menu, pricing and
                        availability.
                    </p>
                </div>
            </div>

            <SectionCard
                title="Add Food Item"
                subtitle="Enter food item details"
            >
                <form
                    className="form-grid"
                    onSubmit={handleSubmit}
                >
                    <div className="form-group">
                        <label>Food Name</label>

                        <input
                            type="text"
                            name="foodName"
                            value={form.foodName}
                            onChange={handleChange}
                            placeholder="Enter food name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Price</label>

                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="Enter price"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Available Quantity</label>

                        <input
                            type="number"
                            name="availableQuantity"
                            value={
                                form.availableQuantity
                            }
                            onChange={handleChange}
                            placeholder="Enter quantity"
                            min="0"
                            required
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="available"
                                checked={form.available}
                                onChange={handleChange}
                            />

                            Available for ordering
                        </label>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="primary-button"
                        >
                            Add Food Item
                        </button>
                    </div>
                </form>

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
            </SectionCard>

            <SectionCard
                title="Food Items"
                subtitle={`${foodItems.length} item(s) in menu`}
            >
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Food Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Availability</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {foodItems.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="empty-state"
                                    >
                                        No food items found.
                                    </td>
                                </tr>
                            ) : (
                                foodItems.map((food) => (
                                    <tr
                                        key={food.foodId}
                                    >
                                        <td>
                                            {food.foodId}
                                        </td>

                                        <td>
                                            {food.foodName}
                                        </td>

                                        <td>
                                            ₹
                                            {Number(
                                                food.price
                                            ).toFixed(2)}
                                        </td>

                                        <td>
                                            {
                                                food.availableQuantity
                                            }
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    food.available
                                                        ? "badge available"
                                                        : "badge unavailable"
                                                }
                                            >
                                                {food.available
                                                    ? "Available"
                                                    : "Unavailable"}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                className="danger-button small"
                                                onClick={() =>
                                                    deleteFoodItem(
                                                        food.foodId
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
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

export default FoodManagement;