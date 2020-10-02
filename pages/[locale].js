import Head from 'next/head';
import Link from 'next/link';
import { useLocale } from '../hooks';
import Sections from '../sections';
import EventBus from '../components/EventBus';

const locales = [ "en", "de", "tr" ];

export default function Home() {
  return (
    <EventBus>
      <Head>
        <title>wiCow</title>
      </Head>

      

      <header>
        <img src="/wicow.svg" alt="Wicow" className="logo" />
        <LocaleNav/>
      </header>

      <main>
        <Sections/>
      </main>

      <footer>
        
      </footer>
    </EventBus>
  )
}



function LocaleNav() {
  const names = {
    en: "English",
    de: "Deutsch",
    tr: "Türkçe"
  }
  const locale = useLocale();
  return (
    <nav className="locale">
      { locales.map(loc => 
        <Link href="/[locale]" as={`/${loc}`} key={loc}>
          <a lang={loc} title={names[loc]} className={{[locale]:"current"}[loc]}>{loc}</a>
        </Link>
      ) }
    </nav>
  );
}

export async function getStaticProps({params: {locale}}) {
  return {
    props: { locale }
  }
}

export async function getStaticPaths() {
  return {
    paths: locales.map(locale => ({ params: { locale } })), 
    fallback: false
  };
}