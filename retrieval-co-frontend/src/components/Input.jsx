export default function Input({ label, error, icon: Icon, required, className = '', containerClassName = '', ...props }) {
    return (
        <div className={`flex flex-col w-full ${containerClassName}`}>
            {label && (
                <label className="form-label">
                    {label} {required && <span className="text-amber">*</span>}
                </label>
            )}
            <div className="relative w-full">
                {Icon && (
                    <div className="absolute left-[14px] top-1/2 -translate-y-1/2 text-text-muted">
                        <Icon size={16} />
                    </div>
                )}
                <input
                    className={`form-input ${Icon ? 'pl-[38px]' : ''} ${error ? 'border-red' : ''} ${className}`}
                    {...props}
                />
            </div>
            {error && <span className="text-red text-[11px] font-body mt-1 ml-1">{error}</span>}
        </div>
    );
}
