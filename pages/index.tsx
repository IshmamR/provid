import type { NextPage } from "next";
import Head from "next/head";
import App from "../src/components/app";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Provid</title>
        <meta
          name="description"
          content="Download your favorite youtube videos from any device for free!"
        />
      </Head>

      <main className={styles.main}>
        <App />
      </main>

      <footer className={styles.footer}>
        Powered by <a href="mailto:ishmam785@gmail.com">Promethewz</a>
      </footer>
    </div>
  );
};

export default Home;

export async function getStaticProps() {
  return {
    props: {},
  };
}
