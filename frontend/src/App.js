import React from 'react';
import './App.css';
import { ThemeProvider } from './components/ThemeProvider';
import Header from './components/Header';
import Hero from './components/Hero';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Header />
        <main>
          <Hero />
          <Pricing />
          <Testimonials />
          <Footer />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;