function SectionCard({
    title,
    subtitle,
    children,
    actions,
}) {
    return (
        <section className="section-card">
            <div className="section-header">
                <div>
                    <h2>{title}</h2>

                    {subtitle && (
                        <p>{subtitle}</p>
                    )}
                </div>

                {actions && (
                    <div className="section-actions">
                        {actions}
                    </div>
                )}
            </div>

            <div className="section-body">
                {children}
            </div>
        </section>
    );
}

export default SectionCard;