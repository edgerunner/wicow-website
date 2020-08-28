import Head from 'next/head';
import {KnowYourCows, SitBackAndRelax} from '../sections';

export default function Home({ locale = "en" }) {

  return (
    <>
      <Head>
        <title>Wicow</title>
      </Head>

      

      <header>
        <img src="/wicow.svg" alt="Wicow" className="logo" />
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

export async function getStaticProps({params: {locale}}) {
  return {
    props: { locale }
  }
}

export async function getStaticPaths() {
  return {
    paths: [ "en", "de", "tr" ].map(locale => ({ params: { locale } })), 
    fallback: false
  };
}