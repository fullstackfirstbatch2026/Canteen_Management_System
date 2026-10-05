function Navbar({ activePage, setActivePage }) {
    const menuItems = [
        {
            id: "dashboard",
            label: "Dashboard",
        },
        {
            id: "students",
            label: "Students",
        },
        {
            id: "food",
            label: "Food Items",
        },
        {
            id: "orders",
            label: "Orders",
        },
        {
            id: "place-order",
            label: "Place Order",
        },
        {
            id: "history",
            label: "Order History",
        },
        {
            id: "reports",
            label: "Reports",
        },
    ];

    return (
        <aside className="sidebar">
            <div className="brand">
                <div className="brand-mark">C</div>

                <div>
                    <h1>Canteen</h1>
                    <span>Management System</span>
                </div>
            </div>

            <nav className="navigation">
                <div className="navigation-title">
                    MAIN MENU
                </div>

                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-item ${
                            activePage === item.id
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            setActivePage(item.id)
                        }
                    >
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="system-status">
                    <span className="status-dot"></span>

                    <div>
                        <strong>System Online</strong>
                        <small>Backend connected</small>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Navbar;