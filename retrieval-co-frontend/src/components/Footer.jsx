import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-card border-t border-border flex justify-between px-[48px] py-[36px] relative overflow-hidden">
            {/* Decorative Watermark */}
            <div className="absolute -bottom-[30px] right-0 pointer-events-none select-none text-[140px] font-display font-black tracking-tighter text-[rgba(0,201,200,0.06)] leading-none">
                Retrieval
            </div>

            <div className="flex flex-col gap-[8px] z-10">
                <span className="font-display font-bold text-[18px] text-amber">
                    Retrieval<span className="text-text">Co.</span>
                </span>
                <span className="font-body text-[13px] text-text-muted">
                    The smart campus platform for recovering lost items.
                </span>
            </div>

            <div className="flex gap-[64px] z-10">
                <div className="flex flex-col gap-[12px]">
                    <span className="font-body font-bold text-[12px] text-text-muted tracking-wider uppercase mb-[4px]">
                        Platform
                    </span>
                    <Link to="/" className="text-[12px] text-[#7a9aab] hover:text-text transition-colors no-underline">Lost & Found</Link>
                    <Link to="/" className="text-[12px] text-[#7a9aab] hover:text-text transition-colors no-underline">Borrow</Link>
                    <Link to="/hotspots" className="text-[12px] text-[#7a9aab] hover:text-text transition-colors no-underline">Hotspots</Link>
                    <Link to="/leaderboard" className="text-[12px] text-[#7a9aab] hover:text-text transition-colors no-underline">Leaderboard</Link>
                </div>

                <div className="flex flex-col gap-[12px]">
                    <span className="font-body font-bold text-[12px] text-text-muted tracking-wider uppercase mb-[4px]">
                        Support
                    </span>
                    <Link to="/" className="text-[12px] text-[#7a9aab] hover:text-text transition-colors no-underline">About</Link>
                    <Link to="/" className="text-[12px] text-[#7a9aab] hover:text-text transition-colors no-underline">Contact</Link>
                    <Link to="/" className="text-[12px] text-[#7a9aab] hover:text-text transition-colors no-underline">Report Issue</Link>
                    <Link to="/" className="text-[12px] text-[#7a9aab] hover:text-text transition-colors no-underline">Privacy</Link>
                </div>
            </div>
        </footer>
    );
}
