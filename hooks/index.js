import { useRouter } from 'next/router';

export function useLocale() {
    return useRouter()?.query?.locale || "en"
}

export { useTranslation, Translate } from './useTranslation';
export { useEventBus } from "../components/EventBus";