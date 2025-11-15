import React from 'react';
import { Server, Zap, Shield } from 'lucide-react';
import { Button } from './ui/button';

const Hero = () => {
  const scrollToPricing = () => {
    const element = document.getElementById('pricing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Профессиональный
            <span className="hero-gradient"> Minecraft хостинг</span>
          </h1>
          <p className="hero-description">
            Надежные серверы в России и Германии с DDoS защитой, 
            быстрым SSD хранилищем и круглосуточной поддержкой
          </p>
          
          <div className="hero-buttons">
            <Button className="btn-primary" onClick={scrollToPricing}>
              Выбрать тариф
              <Zap className="btn-icon" />
            </Button>
            <Button className="btn-secondary" onClick={() => window.open('https://discord.gg/jastnodes', '_blank')}>
              Discord сообщество
            </Button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <Server className="stat-icon" />
              <div>
                <div className="stat-number">1000+</div>
                <div className="stat-label">Активных серверов</div>
              </div>
            </div>
            <div className="stat-item">
              <Shield className="stat-icon" />
              <div>
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
            </div>
            <div className="stat-item">
              <Zap className="stat-icon" />
              <div>
                <div className="stat-number">5 мин</div>
                <div className="stat-label">До запуска</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;