// Phrase types for Negotiation Phrasebook feature

export interface Phrase {
    id: string;
    category: PhraseCategory;
    arabic: string;
    chinese: string;
    pinyin: string;
    isFavorite: boolean;
}

export type PhraseCategory =
    | 'greetings'      // التحية والترحيب
    | 'bargaining'     // المساومة والأسعار
    | 'quantities'     // الكميات والطلبات
    | 'payment'        // الدفع والشحن
    | 'quality'        // الجودة والضمان
    | 'closing';      // الإجراءات والخاتمة

export interface PhraseCategoryInfo {
    id: PhraseCategory;
    label: string;
    icon: string;
    count: number;
}

export const PHRASE_CATEGORIES: PhraseCategoryInfo[] = [
    { id: 'greetings', label: '👋 التحية والترحيب', icon: 'HandWave', count: 5 },
    { id: 'bargaining', label: '💰 المساومة والأسعار', icon: 'Banknote', count: 10 },
    { id: 'quantities', label: '📦 الكميات والطلبات', icon: 'Package', count: 8 },
    { id: 'payment', label: '💳 الدفع والشحن', icon: 'CreditCard', count: 10 },
    { id: 'quality', label: '✅ الجودة والضمان', icon: 'ShieldCheck', count: 7 },
    { id: 'closing', label: '🤝 الإجراءات والخاتمة', icon: 'Handshake', count: 10 },
];

export const PHRASE_CATEGORY_LABELS: Record<PhraseCategory, string> = {
    greetings: 'التحية والترحيب',
    bargaining: 'المساومة والأسعار',
    quantities: 'الكميات والطلبات',
    payment: 'الدفع والشحن',
    quality: 'الجودة والضمان',
    closing: 'الإجراءات والخاتمة',
};
