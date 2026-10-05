import { useEffect, useState } from "react";
import api from "../services/api";
import SectionCard from "../components/SectionCard";

function Reports() {
    const [foodItems, setFoodItems] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const loadReport = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get(
                "/food-items/reports/above-average"
            );

            setFoodItems(response.data);
        } catch (error) {
            console.error(error);

            setError(
                "Unable to load the above-average food report. Make sure the backend report endpoint is available."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReport();
    }, []);

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Reports</h1>
                    <p>
                        Analyze food ordering activity and
                        identify high-demand items.
                    </p>
                </div>

                <button
                    className="secondary-button"
                    onClick={loadReport}
                >
                    Refresh Report
                </button>
            </div>

            <SectionCard
                title="Food Items Ordered Above Average"
                subtitle="Items whose total ordered quantity is above the average"
            >
                {loading ? (
                    <div className="loading">
                        Loading report...
                    </div>
                ) : error ? (
                    <div className="error-message">
                        {error}
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Food ID</th>
                                    <th>Food Name</th>
                                    <th>Price</th>
                                    <th>Available Quantity</th>
                                </tr>
                            </thead>

                            <tbody>
                                {foodItems.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="empty-state"
                                        >
                                            No food items currently
                                            meet the report
                                            criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    foodItems.map(
                                        (food) => (
                                            <tr
                                                key={
                                                    food.foodId
                                                }
                                            >
                                                <td>
                                                    {
                                                        food.foodId
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        food.foodName
                                                    }
                                                </td>

                                                <td>
                                                    ₹
                                                    {Number(
                                                        food.price
                                                    ).toFixed(
                                                        2
                                                    )}
                                                </td>

                                                <td>
                                                    {
                                                        food.availableQuantity
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </SectionCard>
        </div>
    );
}

export default Reports;