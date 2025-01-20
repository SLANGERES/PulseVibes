import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Section } from './components/Section';
import { Service } from './components/Service';
import './App.css'; // Import your CSS
import { Loading } from './components/Loading';
import { Footer } from './components/Footer';


function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="App">
      <Header />
      {isLoading ? (
        <Loading />
      ) : (
        <>

          <Section />
        </>
      )}
      <Footer/>
    </div>
    
  );
}

export default App;
