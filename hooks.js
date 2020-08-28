import { useRouter } from 'next/router';

export function useLocale() {
    return useRouter()?.query?.locale || "en"
}