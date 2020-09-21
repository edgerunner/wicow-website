import Head from 'next/head';
import Link from 'next/link';
import { useLocale } from '../hooks';
import { KnowYourCows, SitBackAndRelax, Simple, NoBullshit, Horsemouth } from '../sections';

const locales = [ "en", "de", "tr" ];

export default function Home() {
  return (
    <>
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
    </>
  )
}

function Sections() {
  const locale = useLocale();
  return [ 
    KnowYourCows,
    SitBackAndRelax,
    Simple,
    NoBullshit,
    Horsemouth
  ].map(
    (section, index) => {
      const Section = section[locale];
      return <Section key={index} id={section.id}/>
    }
  );  
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