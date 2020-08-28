import Head from 'next/head';
import Link from 'next/link';
import {KnowYourCows, SitBackAndRelax} from '../sections';

const locales = [ "en", "de", "tr" ];

export default function Home({ locale = "en" }) {

  return (
    <>
      <Head>
        <title>Wicow</title>
      </Head>

      

      <header>
        <img src="/wicow.svg" alt="Wicow" className="logo" />
        <LocaleNav/>
      </header>

      <main>
        <Sections locale={locale}/>
      </main>

      <footer>
        
      </footer>
    </>
  )
}

function Sections({locale}) {
  return [ 
    KnowYourCows,
    SitBackAndRelax
  ].map(section => section[locale])
   .map((Section, index) => <Section key={index}/>);
}

function LocaleNav() {
  return (
    <nav className="locale">
      { locales.map(loc => 
        <Link href="/[locale]" as={`/${loc}`} key={loc}>
          <a>{loc}</a>
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