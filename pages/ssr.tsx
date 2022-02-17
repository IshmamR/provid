import type { GetServerSideProps, NextPage } from "next";

const SSR: NextPage = () => {
  return <h1>hello</h1>;
};

export default SSR;

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log(context);
  return {
    props: {},
  };
};
