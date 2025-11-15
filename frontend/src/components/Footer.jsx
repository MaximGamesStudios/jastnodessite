import React from 'react';
import { Mail, MessageCircle, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="footer-section">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column">
            <img 
              src="https://customer-assets.emergentagent.com/job_jastnode-dual/artifacts/191b6uh3_im_799c2646-bcf7-4318-a1ee-1b2fd4916c6f.png" 
              alt="JastNodes" 
              className="footer-logo"
            />
            <p className="footer-description">
              Профессиональный Minecraft хостинг с надежными серверами в России и Германии
            </p>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Навигация</h3>
            <ul className="footer-links">
              <li><a href="#hero" className="footer-link">Главная</a></li>
              <li><a href="#pricing" className="footer-link">Тарифы</a></li>
              <li><a href="#testimonials" className="footer-link">Отзывы</a></li>
              <li><a href="#contact" className="footer-link">Контакты</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Поддержка</h3>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Документация</a></li>
              <li><a href="#" className="footer-link">FAQ</a></li>
              <li><a href="#" className="footer-link">Техподдержка</a></li>
              <li><a href="#" className="footer-link">Статус серверов</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Контакты</h3>
            <div className="footer-contacts">
              <a href="mailto:support@jastnodes.com" className="contact-item">
                <Mail className="contact-icon" />
                <span>support@jastnodes.com</span>
              </a>
              <a href="https://discord.gg/jastnodes" className="contact-item" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="contact-icon" />
                <span>Discord</span>
              </a>
              <a href="https://github.com/jastnodes" className="contact-item" target="_blank" rel="noopener noreferrer">
                <Github className="contact-icon" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} JastNodes. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;