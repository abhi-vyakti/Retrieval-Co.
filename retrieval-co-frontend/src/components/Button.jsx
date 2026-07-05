export default function Button({ children, variant = 'primary', className = '', ...props }) {
    const baseClasses = "flex items-center justify-center gap-[8px] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary text-background px-[20px] py-[10px] rounded-[10px] font-body text-[0.9rem] font-semibold border-none hover:opacity-90 hover:-translate-y-[1px] hover:shadow-hover",
        blue: "bg-primary/10 text-primary px-[20px] py-[10px] rounded-[10px] font-body text-[0.9rem] font-semibold border-none hover:bg-primary/20",
        ghost: "bg-transparent text-text px-[20px] py-[10px] rounded-[10px] border border-border text-[0.9rem] font-semibold hover:border-text-muted hover:-translate-y-[1px]",
        outline: "bg-transparent text-text px-[20px] py-[10px] rounded-[10px] border border-border text-[0.9rem] font-semibold hover:border-text-muted",
        hero: "btn-hero bg-amber text-ink",
        heroGhost: "btn-hero bg-transparent text-text border border-border hover:border-text-muted shadow-none",
        action: "h-full min-h-[32px] border border-border rounded-[8px] text-[12px] font-semibold flex-1 text-text hover:border-text-muted",
    };

    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
