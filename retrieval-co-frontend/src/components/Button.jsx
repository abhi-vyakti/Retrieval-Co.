export default function Button({ children, variant = 'primary', className = '', ...props }) {
    const baseClasses = "flex items-center justify-center gap-[8px] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-amber text-ink px-[20px] py-[10px] rounded-[10px] font-display text-[0.9rem] font-bold border-none hover:bg-[#00e5e4] hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(0,201,200,0.3)]",
        blue: "bg-[rgba(0,201,200,0.12)] text-amber px-[20px] py-[10px] rounded-[10px] font-display text-[0.9rem] font-bold border-none hover:bg-[rgba(0,201,200,0.2)]",
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
