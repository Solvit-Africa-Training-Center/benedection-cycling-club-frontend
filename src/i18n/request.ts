import {cookies} from 'next/headers';
import {getRequestConfig} from 'next-intl/server';

export const locales = ['en', 'nl'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
export const localeCookieName = 'NEXT_LOCALE';

export async function getLocaleFromCookie(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(localeCookieName)?.value;
  return value === 'nl' ? 'nl' : 'en';
}

export default getRequestConfig(async () => {
  const locale = await getLocaleFromCookie();
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
