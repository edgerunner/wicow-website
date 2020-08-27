import Head from 'next/head';
import {KnowYourCows, SitBackAndRelax} from '../sections';

export default function Home() {
  return (
    <>
      <Head>
        <title>Wicow</title>
      </Head>

      

      <header>
        <img src="/wicow.svg" alt="Wicow" className="logo" />
      </header>

      <main>
        <KnowYourCows.en/>
        <SitBackAndRelax.en/>
      </main>

      <footer>
        
      </footer>
    </>
  )
}
