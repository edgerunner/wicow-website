export {default as default} from './[locale]';

export async function getStaticProps() {
  return {
    props: { locale: "en" }
  }
}