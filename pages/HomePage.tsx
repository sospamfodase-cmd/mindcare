import React from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { LinkGrid } from '../components/LinkGrid';
import { About } from '../components/About';
import { BlogSection } from '../components/BlogSection';
import { Newsletter } from '../components/Newsletter';
import { Footer } from '../components/Footer';

export const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <BlogSection />
        <LinkGrid />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
};
