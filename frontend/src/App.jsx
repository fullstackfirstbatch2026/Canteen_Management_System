import { useState } from "react";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import StudentManagement from "./pages/StudentManagement";
import FoodManagement from "./pages/FoodManagement";
import OrderManagement from "./pages/OrderManagement";
import OrderForm from "./pages/OrderForm";
import OrderHistory from "./pages/OrderHistory";
import Reports from "./pages/Reports";

function App() {
    const [activePage, setActivePage] = useState("dashboard");

    const renderPage = () => {
        switch (activePage) {
            case "dashboard":
                return <Dashboard />;

            case "students":
                return <StudentManagement />;

            case "food":
                return <FoodManagement />;

            case "orders":
                return <OrderManagement />;

            case "place-order":
                return <OrderForm />;

            case "history":
                return <OrderHistory />;

            case "reports":
                return <Reports />;

            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="app">
            <Navbar
                activePage={activePage}
                setActivePage={setActivePage}
            />

            <main className="main-content">
                {renderPage()}
            </main>
        </div>
    );
}

export default App;