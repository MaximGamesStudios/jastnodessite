import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="header-fixed">
      <div className="header-container">
        <div className="header-logo">
          <img 
            src="https://customer-assets.emergentagent.com/job_jastnode-dual/artifacts/191b6uh3_im_799c2646-bcf7-4318-a1ee-1b2fd4916c6f.png" 
            alt="JastNodes Logo" 
            className="logo-image"
          />
        </div>
        
        <nav className="header-nav">
          <button className="nav-link" onClick={() => scrollToSection('hero')}>Главная</button>
          <button className="nav-link" onClick={() => scrollToSection('pricing')}>Тарифы</button>
          <button className="nav-link" onClick={() => scrollToSection('testimonials')}>Отзывы</button>
          <button className="nav-link" onClick={() => scrollToSection('contact')}>Контакты</button>
          
          <Button
            onClick={toggleTheme}
            className="theme-toggle"
            variant="ghost"
            size="icon"
          >
            {theme === 'dark' ? <Sun className="icon" /> : <Moon className="icon" />}
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;