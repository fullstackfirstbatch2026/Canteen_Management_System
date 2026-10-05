import { useEffect, useState } from "react";
import api from "../services/api";
import SectionCard from "../components/SectionCard";

function Dashboard() {
    const [stats, setStats] = useState({
        students: 0,
        foodItems: 0,
        orders: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const [
                studentsResponse,
                foodResponse,
                ordersResponse,
            ] = await Promise.all([
                api.get("/students"),
                api.get("/food-items"),
                api.get("/orders"),
            ]);

            setStats({
                students: studentsResponse.data.length,
                foodItems: foodResponse.data.length,
                orders: ordersResponse.data.length,
            });
        } catch (error) {
            console.error(
                "Unable to load dashboard:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>

                    <p>
                        Overview of the canteen management
                        system.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="loading">
                    Loading dashboard...
                </div>
            ) : (
                <>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <span className="stat-label">
                                Total Students
                            </span>

                            <strong>
                                {stats.students}
                            </strong>

                            <span className="stat-description">
                                Registered students
                            </span>
                        </div>

                        <div className="stat-card">
                            <span className="stat-label">
                                Food Items
                            </span>

                            <strong>
                                {stats.foodItems}
                            </strong>

                            <span className="stat-description">
                                Items in the menu
                            </span>
                        </div>

                        <div className="stat-card">
                            <span className="stat-label">
                                Total Orders
                            </span>

                            <strong>
                                {stats.orders}
                            </strong>

                            <span className="stat-description">
                                Orders recorded
                            </span>
                        </div>
                    </div>

                    <SectionCard
                        title="System Overview"
                        subtitle="Current application status"
                    >
                        <div className="overview-grid">
                            <div>
                                <span>Backend API</span>
                                <strong className="online">
                                    Connected
                                </strong>
                            </div>

                            <div>
                                <span>Database</span>
                                <strong className="online">
                                    Connected
                                </strong>
                            </div>

                            <div>
                                <span>Application Port</span>
                                <strong>8085</strong>
                            </div>

                            <div>
                                <span>Frontend Port</span>
                                <strong>5173</strong>
                            </div>
                        </div>
                    </SectionCard>
                </>
            )}
        </div>
    );
}

export default Dashboard;