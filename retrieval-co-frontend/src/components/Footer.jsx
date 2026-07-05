import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-card border-t border-border relative overflow-hidden">
            {/* Decorative Watermark */}
            <div className="footer-watermark absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none select-none text-[64px] sm:text-[100px] md:text-[160px] font-display font-black tracking-tighter leading-none whitespace-nowrap bg-clip-text text-transparent opacity-50 md:opacity-100">
                RetrievalCo.
            </div>

            <div className="max-w-6xl mx-auto px-6 md:px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 items-start">
                    {/* Brand Column */}
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <span className="font-display font-bold text-lg text-amber">
                            Retrieval<span className="text-text">Co.</span>
                        </span>
                        <span className="text-[13px] text-text-muted leading-relaxed max-w-xs">
                            The smart campus platform for recovering lost items
                            and borrowing resources.
                        </span>
                    </div>

                    {/* Platform Links */}
                    <div className="flex flex-col gap-3">
                        <span className="font-bold text-[11px] text-text-muted tracking-widest uppercase">
                            Platform
                        </span>
                        <Link
                            to="/dashboard?tab=lost_found"
                            className="text-[13px] text-text-muted/70 hover:text-text transition-colors no-underline"
                        >
                            Lost &amp; Found
                        </Link>
                        <Link
                            to="/dashboard?tab=borrow"
                            className="text-[13px] text-text-muted/70 hover:text-text transition-colors no-underline"
                        >
                            Borrow
                        </Link>
                        <Link
                            to="/hotspots"
                            className="text-[13px] text-text-muted/70 hover:text-text transition-colors no-underline"
                        >
                            Hotspots
                        </Link>
                        <Link
                            to="/leaderboard"
                            className="text-[13px] text-text-muted/70 hover:text-text transition-colors no-underline"
                        >
                            Leaderboard
                        </Link>
                    </div>

                    {/* Support Links */}
                    <div className="flex flex-col gap-3">
                        <span className="font-bold text-[11px] text-text-muted tracking-widest uppercase">
                            Support
                        </span>
                        <Link
                            to="/about"
                            className="text-[13px] text-text-muted/70 hover:text-text transition-colors no-underline"
                        >
                            About
                        </Link>
                        <a
                            href="https://www.linkedin.com/in/abhijeet-barik"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[13px] text-text-muted/70 hover:text-text transition-colors no-underline"
                        >
                            Contact
                        </a>
                        <a
                            href="https://www.linkedin.com/in/abhijeet-barik"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[13px] text-text-muted/70 hover:text-text transition-colors no-underline"
                        >
                            Report Issue
                        </a>
                        <Link
                            to="/privacy"
                            className="text-[13px] text-text-muted/70 hover:text-text transition-colors no-underline"
                        >
                            Privacy
                        </Link>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <span className="text-[11px] text-text-muted/50">
                        © 2026 RetrievalCo. All rights reserved.
                    </span>
                    <span className="text-[11px] text-text-muted/50">
                        Built with 🤍 by Abhijeet :)
                    </span>
                </div>
            </div>
        </footer>
    );
}
