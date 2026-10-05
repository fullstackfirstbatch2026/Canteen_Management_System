import { useEffect, useState } from "react";
import api from "../services/api";
import SectionCard from "../components/SectionCard";

function OrderForm() {
    const [students, setStudents] = useState([]);
    const [foodItems, setFoodItems] = useState([]);

    const [studentId, setStudentId] = useState("");
    const [foodId, setFoodId] = useState("");
    const [quantity, setQuantity] = useState(1);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadStudents();
        loadFoodItems();
    }, []);

    const loadStudents = async () => {
        try {
            const response = await api.get("/students");
            setStudents(response.data);
        } catch (err) {
            setError("Unable to load students.");
        }
    };

    const loadFoodItems = async () => {
        try {
            const response = await api.get("/food-items");
            setFoodItems(response.data);
        } catch (err) {
            setError("Unable to load food items.");
        }
    };

    const selectedFood = foodItems.find(
        (food) => String(food.foodId) === String(foodId)
    );

    const totalAmount =
        selectedFood && quantity > 0
            ? Number(selectedFood.price) * Number(quantity)
            : 0;

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        if (!studentId) {
            setError("Please select a student.");
            return;
        }

        if (!foodId) {
            setError("Please select a food item.");
            return;
        }

        if (quantity <= 0) {
            setError("Quantity must be greater than zero.");
            return;
        }

        if (
            selectedFood &&
            quantity > selectedFood.availableQuantity
        ) {
            setError(
                `Only ${selectedFood.availableQuantity} item(s) are available.`
            );
            return;
        }

        try {
            setLoading(true);

            const orderData = {
                studentId: Number(studentId),
                foodId: Number(foodId),
                quantity: Number(quantity),
            };

            await api.post("/orders", orderData);

            setMessage("Order placed successfully.");

            setStudentId("");
            setFoodId("");
            setQuantity(1);

            await loadFoodItems();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to place the order."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Place Order</h1>
                    <p>
                        Create a new canteen order for a student.
                    </p>
                </div>
            </div>

            <SectionCard
                title="Order Details"
                subtitle="Select the student, food item and quantity."
            >
                <form className="form-grid" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="student">
                            Student
                        </label>

                        <select
                            id="student"
                            value={studentId}
                            onChange={(event) =>
                                setStudentId(event.target.value)
                            }
                        >
                            <option value="">
                                Select Student
                            </option>

                            {students.map((student) => (
                                <option
                                    key={student.studentId}
                                    value={student.studentId}
                                >
                                    {student.name} - {student.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="food">
                            Food Item
                        </label>

                        <select
                            id="food"
                            value={foodId}
                            onChange={(event) =>
                                setFoodId(event.target.value)
                            }
                        >
                            <option value="">
                                Select Food Item
                            </option>

                            {foodItems
                                .filter(
                                    (food) =>
                                        food.available &&
                                        food.availableQuantity > 0
                                )
                                .map((food) => (
                                    <option
                                        key={food.foodId}
                                        value={food.foodId}
                                    >
                                        {food.foodName} - ₹
                                        {Number(food.price).toFixed(2)}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantity">
                            Quantity
                        </label>

                        <input
                            id="quantity"
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(event) =>
                                setQuantity(
                                    Number(event.target.value)
                                )
                            }
                        />
                    </div>

                    {selectedFood && (
                        <div className="order-summary">
                            <div>
                                <span>Food Item</span>
                                <strong>
                                    {selectedFood.foodName}
                                </strong>
                            </div>

                            <div>
                                <span>Unit Price</span>
                                <strong>
                                    ₹
                                    {Number(
                                        selectedFood.price
                                    ).toFixed(2)}
                                </strong>
                            </div>

                            <div>
                                <span>Available Quantity</span>
                                <strong>
                                    {selectedFood.availableQuantity}
                                </strong>
                            </div>

                            <div>
                                <span>Total Amount</span>
                                <strong>
                                    ₹{totalAmount.toFixed(2)}
                                </strong>
                            </div>
                        </div>
                    )}

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

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Placing Order..."
                                : "Place Order"}
                        </button>
                    </div>
                </form>
            </SectionCard>
        </div>
    );
}

export default OrderForm;