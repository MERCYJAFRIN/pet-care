import React from 'react';
import '../styles/landing.css';

const LandingPage = ({ onAuthClick }) => {
  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <span className="logo-paw">🐾</span>
          <span className="logo-text">PetCare</span>
        </div>
        <div className="nav-links">
          <a href="#services">GROOMING</a>
          <a href="#services">TRAINING</a>
          <a href="#services">WALKING</a>
          <a href="#about">BLOG</a>
          <a href="#about">ABOUT US</a>
        </div>
        <div className="nav-contact">
          <span className="phone-icon">📞</span>
          <span className="phone-number">+91 8882424040</span>
          <button className="btn-login user" onClick={() => onAuthClick('login', 'user')}>USER LOGIN</button>
          <button className="btn-login doctor" onClick={() => onAuthClick('login', 'doctor')}>DOCTOR LOGIN</button>
          <button className="btn-join" onClick={() => onAuthClick('register')}>JOIN NOW</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content animate-slide-in">
          <span className="hero-badge">🐾 India's Most Trusted Pet Clinic</span>
          <h1>Expert Care for Your <span className="text-gradient">Furry Friends</span></h1>
          <p>Book instant appointments with top-rated veterinarians, manage health records, and shop the best products for your pets.</p>
          <div className="hero-cta-group">
            <button className="btn-primary-large" onClick={() => onAuthClick('login')}>Book Appointment</button>
            <button className="btn-secondary-large" onClick={() => onAuthClick('login')}>Shop Marketplace</button>
          </div>
        </div>
        <div className="hero-image-wrapper animate-fade-in">
          <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800" alt="Professional Pet Care" className="hero-main-img" />
          <div className="floating-card expert-card">
            <div className="expert-avatars">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Vet" />
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Vet" />
              <span>+150 Vets Online</span>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="features-highlight-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">🚀</div>
            <h3>Fast Delivery</h3>
            <p>24-hour delivery in major cities.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">🛍️</div>
            <h3>Large Product Catalog</h3>
            <p>17,000+ pet products from multiple trusted brands.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">🩺</div>
            <h3>Online Vet Consultation</h3>
            <p>Connect with veterinarians through video or chat.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">💊</div>
            <h3>Pet Pharmacy</h3>
            <p>Buy medicines, supplements, and health products.</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section section-padding">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <p>Everything your pet needs, delivered to your doorstep</p>
        </div>
        <div className="categories-grid">
          <div className="category-card" onClick={() => onAuthClick('login')}>
            <div className="category-img-wrapper">
              <img src="https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400" alt="Dog Products" />
            </div>
            <h3>Dog Products</h3>
            <p>Food, Toys, Beds & Grooming</p>
          </div>
          <div className="category-card" onClick={() => onAuthClick('login')}>
            <div className="category-img-wrapper">
              <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400" alt="Cat Products" />
            </div>
            <h3>Cat Products</h3>
            <p>Food, Litter, Toys & Accessories</p>
          </div>
          <div className="category-card" onClick={() => onAuthClick('login')}>
            <div className="category-img-wrapper">
              <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400" alt="Health & Wellness" />
            </div>
            <h3>Health & Wellness</h3>
            <p>Supplements, Dental & Vet Diets</p>
          </div>
          <div className="category-card pharmacy" onClick={() => onAuthClick('login')}>
            <div className="category-img-wrapper">
              <img src="https://images.unsplash.com/photo-1544568100-847a948585b9?w=400" alt="Pet Pharmacy" />
            </div>
            <h3>Pet Pharmacy</h3>
            <p>Prescribed Medicines & Preventives</p>
          </div>
          <div className="category-card" onClick={() => onAuthClick('login')}>
            <div className="category-img-wrapper">
              <img src="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=400" alt="Pet Grooming" />
            </div>
            <h3>Pet Grooming</h3>
            <p>Shampoos, Brushes & Spa Kits</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about" className="why-us-section">
        <h2 className="section-title">Why Choose Us?</h2>
        <p className="section-subtitle">
          With over 5 years of experience, we mark our presence across 25 cities across India.
          We're focused towards offering top-tier pet care, grooming, and training services.
        </p>

        <div className="why-us-content">
          <div className="why-us-left">
            <div className="feature">
              <span className="feature-icon">📝</span>
              <div>
                <h4>Personalized Pet Care Plans</h4>
                <p>Tailored services to suit each pet's unique needs and preferences.</p>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">🛡️</span>
              <div>
                <h4>Certified Professional Team</h4>
                <p>Trained experts ensuring your pet receives the highest quality care.</p>
              </div>
            </div>
          </div>

          <div className="why-us-center">
            <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600" alt="Dogs together" />
          </div>

          <div className="why-us-right">
            <div className="feature">
              <span className="feature-icon">🥗</span>
              <div>
                <h4>Holistic Wellness Approach</h4>
                <p>Comprehensive services encompassing grooming, training, and vet consultations.</p>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">🕒</span>
              <div>
                <h4>Convenience & Flexibility</h4>
                <p>Easy scheduling, online booking, and a range of service options.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Clinics Section */}
      <section id="services" className="vet-services-section">
        <h2 className="section-title">Expert Pet Care Services</h2>
        <p className="section-subtitle">Comprehensive care from qualified veterinarians and groomers.</p>

        <div className="vet-services-grid">
          <div className="service-banner-card consult">
            <div className="banner-content">
              <h3>Online Vet Consultation</h3>
              <p>Connect with expert veterinarians instantly via video or chat for nutrition, illness, or behavioral advice.</p>
              <button className="btn-book-sm" onClick={() => onAuthClick('login')}>Consult Now</button>
            </div>
            <img src="/src/assets/vet_consultation_modern.png" alt="Online Vet" className="banner-img" />
          </div>

          <div className="service-banner-card clinic">
            <div className="banner-content">
              <h3>Visit Pet Clinics</h3>
              <p>Find top-rated offline clinics near you for vaccinations, checkups, surgeries, and diagnostics.</p>
              <button className="btn-book-sm" onClick={() => onAuthClick('login')}>Find Clinic</button>
            </div>
            <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800" alt="Pet Clinic" className="banner-img" />
          </div>

          <div className="service-banner-card athome">
            <div className="banner-content">
              <h3>At-Home Services</h3>
              <p>Book professional pet grooming, nail trimming, and health sample collection right at your doorstep.</p>
              <button className="btn-book-sm" onClick={() => onAuthClick('login')}>Book Service</button>
            </div>
            <img src="/src/assets/pet_grooming_professional.png" alt="At Home Grooming" className="banner-img" />
          </div>
        </div>
      </section>

      {/* Happy Moments Gallery */}
      <section className="gallery-section">
        <h2 className="section-title">Happy Moments</h2>
        <p className="section-subtitle">Celebrating happy clients, skilled groomers, and their adorable pets behind the scenes.</p>

        <div className="gallery-grid">
          <div className="gallery-item large"><img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800" alt="Moment 1" /></div>
          <div className="gallery-item"><img src="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=400" alt="Moment 2" /></div>
          <div className="gallery-item"><img src="https://images.unsplash.com/photo-1544568100-847a948585b9?w=400" alt="Moment 3" /></div>
          <div className="gallery-item wide"><img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800" alt="Moment 4" /></div>
          <div className="gallery-item"><img src="/src/assets/moment5.png" alt="Moment 5" /></div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title">What Pet Parents Say</h2>
        <p className="section-subtitle">Real experiences from our loving community.</p>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">"The grooming service was exceptional! My golden retriever looks amazing, and the groomer was so patient with him."</p>
            <div className="testimonial-author">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" alt="Sarah J." />
              <div>
                <h4>Sarah J.</h4>
                <span>Pet Parent</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">"The vet consultation at home is a game changer. Less stress for my cat and immediate professional advice."</p>
            <div className="testimonial-author">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" alt="Michael R." />
              <div>
                <h4>Michael R.</h4>
                <span>Cat Owner</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">"Very reliable dog walking service. I get updates and pictures, which gives me peace of mind while I'm at work."</p>
            <div className="testimonial-author">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" alt="Emily T." />
              <div>
                <h4>Emily T.</h4>
                <span>Dog Lover</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <span className="logo-paw">🐾</span>
              <span className="logo-text">PetCare</span>
            </div>
            <p>Your ultimate digital pet care ecosystem. Shopping, veterinary services, and education explicitly designed for pet parents.</p>
            <div className="app-download-links">
              <button className="download-btn">🍏 App Store</button>
              <button className="download-btn">▶️ Google Play</button>
            </div>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <a href="#dog">Dog Products</a>
            <a href="#cat">Cat Products</a>
            <a href="#health">Health & Wellness</a>
            <a href="#pharmacy">Pet Pharmacy</a>
          </div>

          <div className="footer-col">
            <h4>Services</h4>
            <a href="#vet">Online Vet Consultation</a>
            <div className="footer-brand">
              <div className="logo-text">Pet<span>Care</span></div>
              <p>Your one-stop destination for absolute pet wellbeing. Expertise you can trust, care you can feel.</p>
            </div>
            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-social">
              <h4>Follow Us</h4>
              <div className="social-icons">
                <span>🔵</span> <span>🔴</span> <span>🟣</span>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 PetCare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
