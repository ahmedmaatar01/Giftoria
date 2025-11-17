"use client";
import dynamic from 'next/dynamic';

// Lazy load all modals with no SSR
export const LazyHomesModal = dynamic(() => import('./HomesModal'), { ssr: false });
export const LazyQuickView = dynamic(() => import('./QuickView'), { ssr: false });
export const LazyQuickAdd = dynamic(() => import('./QuickAdd'), { ssr: false });
export const LazyProductSidebar = dynamic(() => import('./ProductSidebar'), { ssr: false });
export const LazyCompare = dynamic(() => import('./Compare'), { ssr: false });
export const LazyShopCart = dynamic(() => import('./ShopCart'), { ssr: false });
export const LazyAskQuestion = dynamic(() => import('./AskQuestion'), { ssr: false });
export const LazyBlogSidebar = dynamic(() => import('./BlogSidebar'), { ssr: false });
export const LazyColorCompare = dynamic(() => import('./ColorCompare'), { ssr: false });
export const LazyDeliveryReturn = dynamic(() => import('./DeliveryReturn'), { ssr: false });
export const LazyFindSize = dynamic(() => import('./FindSize'), { ssr: false });
export const LazyLogin = dynamic(() => import('./Login'), { ssr: false });
export const LazyMobileMenu = dynamic(() => import('./MobileMenu'), { ssr: false });
export const LazyRegister = dynamic(() => import('./Register'), { ssr: false });
export const LazyResetPass = dynamic(() => import('./ResetPass'), { ssr: false });
export const LazySearchModal = dynamic(() => import('./SearchModal'), { ssr: false });
export const LazyToolbarBottom = dynamic(() => import('./ToolbarBottom'), { ssr: false });
export const LazyToolbarShop = dynamic(() => import('./ToolbarShop'), { ssr: false });
export const LazyNewsletterModal = dynamic(() => import('./NewsletterModal'), { ssr: false });
export const LazyShareModal = dynamic(() => import('./ShareModal'), { ssr: false });
