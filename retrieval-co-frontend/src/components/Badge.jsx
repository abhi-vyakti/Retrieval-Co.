import { Bot, Zap } from 'lucide-react';

export default function Badge({ type, variant, icon = true }) {
    // Accept either 'type' or 'variant' prop for flexibility
    const badges = {
        open: { class: 'badge-open', label: '● Open' },
        claimed: { class: 'badge-claimed', label: '● Claimed' },
        returned: { class: 'badge-returned', label: '✓ Returned' },
        expired: { class: 'badge-expired', label: 'Expired' },
        urgent: {
            class: 'badge-urgent',
            label: (
                <>
                    <Zap size={10} className="fill-urgent-text" /> Urgent
                </>
            )
        },
        lost: { class: 'badge-lost', label: 'Lost' },
        found: { class: 'badge-found', label: 'Found' },
        borrow: { class: 'badge-borrow', label: 'Borrow' },
        aimatch: {
            class: 'badge-aimatch',
            label: (
                <>
                    <Bot size={12} /> AI Match
                </>
            )
        }
    };

    const key = (type || variant || 'open').toLowerCase();
    const badgeObj = badges[key] || badges.open;

    return (
        <span className={`badge ${badgeObj.class}`}>
            {badgeObj.label}
        </span>
    );
}
