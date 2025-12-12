export type AnalyticsEvent =
    | 'view_item'
    | 'add_to_cart'
    | 'begin_checkout'
    | 'purchase'
    | 'generate_lead';

declare global {
    interface Window {
        dataLayer: any[];
    }
}

export const trackEvent = (event: AnalyticsEvent, params: Record<string, any> = {}) => {
    if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event,
            ...params,
            timestamp: new Date().toISOString(),
        });

        // Log for development visibility
        if (process.env.NODE_ENV === 'development') {
            console.log('📊 [Analytics]', event, params);
        }
    }
};
