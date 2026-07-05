import { ShieldCheck, Eye, Database, Cookie, UserCheck, Mail, RefreshCw } from 'lucide-react';

const sections = [
    {
        icon: Database,
        title: 'Information We Collect',
        content: 'We collect information you provide directly, such as your name, email address, and campus ID when you create an account. We also collect data about lost, found, and borrowed items that you post on the platform, including descriptions, images, and location data.',
    },
    {
        icon: Eye,
        title: 'How We Use Your Information',
        content: 'Your information is used to facilitate the recovery of lost items, coordinate borrowing between campus members, power our AI-matching engine, and maintain the Karma leaderboard. We never sell your personal data to third parties.',
    },
    {
        icon: Cookie,
        title: 'Cookies & Local Storage',
        content: 'We use essential cookies and local storage to keep you logged in and remember your preferences (such as dark/light theme). We do not use tracking cookies or third-party analytics.',
    },
    {
        icon: UserCheck,
        title: 'Data Sharing & Security',
        content: 'Your contact information is only shared with other verified campus users when you mutually agree to a handoff. All data is transmitted over encrypted connections (HTTPS) and stored securely. QR-based handoffs use one-time codes that expire after use.',
    },
    {
        icon: RefreshCw,
        title: 'Data Retention & Deletion',
        content: 'Item posts are automatically archived after 90 days. You can request deletion of your account and all associated data at any time by contacting us. Upon deletion, all personal information is permanently removed within 30 days.',
    },
    {
        icon: Mail,
        title: 'Contact Us',
        content: 'If you have any questions about this Privacy Policy or your data, please reach out to us through the Contact link in the footer or email us at privacy@retrievalco.app.',
    },
];

export default function PrivacyPage() {
    return (
        <main className="min-h-screen pt-28 pb-20 px-4 md:px-8 bg-background">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-5">
                        <ShieldCheck className="text-primary" size={28} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-display font-[800] tracking-tight mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-text-muted text-sm max-w-lg mx-auto leading-relaxed">
                        Your privacy matters to us. This policy explains how RetrievalCo. collects, uses, and protects your information.
                    </p>
                    <span className="inline-block mt-4 text-[11px] text-text-muted/50 font-medium tracking-wide">
                        Last updated: July 5, 2026
                    </span>
                </div>

                {/* Sections */}
                <div className="flex flex-col gap-6">
                    {sections.map((section, i) => {
                        const Icon = section.icon;
                        return (
                            <div
                                key={i}
                                className="glass-panel p-6 rounded-xl border border-border hover:border-primary/30 transition-all duration-300 group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Icon className="text-primary" size={18} />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-display font-bold mb-2 text-text">
                                            {section.title}
                                        </h2>
                                        <p className="text-[13px] text-text-muted leading-relaxed">
                                            {section.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom note */}
                <div className="mt-12 text-center">
                    <p className="text-[12px] text-text-muted/50 leading-relaxed max-w-md mx-auto">
                        By using RetrievalCo., you agree to this Privacy Policy. We may update this policy from time to time — we'll notify you of significant changes via email or an in-app notice.
                    </p>
                </div>
            </div>
        </main>
    );
}
