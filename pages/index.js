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
        <Sections locale="en"/>
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