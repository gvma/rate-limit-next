import { NextPage } from 'next';
import React from 'react';

const HomePage: NextPage = () => {
  const getRequest = async () => {
    const res = await fetch('/api');
  }

  return (
    <button onClick={() => getRequest()}>
      Send request
    </button>
  );
}

export default HomePage;