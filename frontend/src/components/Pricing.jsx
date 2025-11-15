import React, { useState } from 'react';
import { Cpu, HardDrive, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { pricingPlans } from '../mockData';

const Pricing = () => {
  const [selectedLocation, setSelectedLocation] = useState('РФ');

  return (
    <section id="pricing" className="pricing-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Тарифные планы</h2>
          <p className="section-description">
            Выберите подходящий тариф для вашего сервера
          </p>
          
          <div className="location-filter">
            <Button 
              className={selectedLocation === 'РФ' ? 'filter-btn-active' : 'filter-btn'}
              onClick={() => setSelectedLocation('РФ')}
            >
              <span className="flag-icon">🇷🇺</span>
              Россия
            </Button>
            <Button 
              className={selectedLocation === 'Германия' ? 'filter-btn-active' : 'filter-btn'}
              onClick={() => setSelectedLocation('Германия')}
            >
              <span className="flag-icon">🇩🇪</span>
              Германия
            </Button>
          </div>
        </div>

        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <Card key={plan.id} className={plan.popular ? 'pricing-card pricing-card-popular' : 'pricing-card'}>
              {plan.popular && (
                <Badge className="popular-badge">Популярный</Badge>
              )}
              
              <CardHeader>
                <CardTitle className="plan-name">{plan.name}</CardTitle>
                <CardDescription className="plan-location">
                  <Database className="location-icon" />
                  {selectedLocation}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="plan-price">
                  <span className="price-amount">{plan.price}</span>
                  <span className="price-currency">{plan.currency}{plan.period}</span>
                </div>
                
                <div className="plan-features">
                  <div className="feature-item">
                    <Cpu className="feature-icon" />
                    <span>{plan.cpu}</span>
                  </div>
                  <div className="feature-item">
                    <Database className="feature-icon" />
                    <span>{plan.ram} RAM</span>
                  </div>
                  <div className="feature-item">
                    <HardDrive className="feature-icon" />
                    <span>{plan.storage} SSD</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button className="plan-btn">
                  Выбрать план
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;