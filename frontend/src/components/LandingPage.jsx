import React from 'react';

// Realistic generated photographs served from the public folder
const HERO_OCEAN_BG = '/hero_underwater_marine.png';
const DIVER_RESEARCH_IMG = '/research_diver_marine_debris.png';

// *** LEGACY SVG PLACEHOLDER (unused — kept for reference only) ***
const _HERO_OCEAN_BG_SVG_LEGACY = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="700" viewBox="0 0 1400 700">
  <defs>
    <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0a3c42"/>
      <stop offset="40%" stop-color="#072a2f"/>
      <stop offset="80%" stop-color="#041b1e"/>
      <stop offset="100%" stop-color="#020e10"/>
    </linearGradient>
    <linearGradient id="sunRay" x1="20%" y1="0%" x2="70%" y2="100%">
      <stop offset="0%" stop-color="rgba(156, 234, 216, 0.28)"/>
      <stop offset="60%" stop-color="rgba(156, 234, 216, 0.05)"/>
      <stop offset="100%" stop-color="rgba(156, 234, 216, 0)"/>
    </linearGradient>
    <radialGradient id="rovGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.9)"/>
      <stop offset="30%" stop-color="rgba(156,234,216,0.5)"/>
      <stop offset="100%" stop-color="rgba(156,234,216,0)"/>
    </radialGradient>
  </defs>

  <!-- Background Base -->
  <rect width="1400" height="700" fill="url(#oceanGrad)"/>

  <!-- Light Beams from Surface -->
  <polygon points="200,0 450,0 800,700 450,700" fill="url(#sunRay)"/>
  <polygon points="600,0 850,0 1200,700 850,700" fill="url(#sunRay)"/>
  <polygon points="50,0 200,0 400,700 200,700" fill="url(#sunRay)"/>

  <!-- Seabed Seabed Dunes -->
  <path d="M0,580 Q350,520 700,590 T1400,550 L1400,700 L0,700 Z" fill="#031214"/>
  <path d="M0,620 Q450,570 900,630 T1400,600 L1400,700 L0,700 Z" fill="#010809"/>

  <!-- Coral & Seaweed Silhouettes -->
  <path d="M1100,580 Q1120,500 1140,580 T1180,520 T1220,580" fill="none" stroke="#063237" stroke-width="8" stroke-linecap="round"/>
  <path d="M1250,600 Q1270,530 1290,600 T1330,540 T1360,600" fill="none" stroke="#05262a" stroke-width="10" stroke-linecap="round"/>
  <path d="M100,600 Q120,530 140,600 T180,540" fill="none" stroke="#063237" stroke-width="7" stroke-linecap="round"/>

  <!-- Underwater ROV Drone -->
  <g transform="translate(860, 180)">
    <!-- ROV Body -->
    <rect x="0" y="0" width="130" height="75" rx="14" fill="#09454b" stroke="#9cead8" stroke-width="2.5"/>
    <rect x="15" y="15" width="40" height="30" rx="6" fill="#115a62"/>
    <!-- Thrusters -->
    <rect x="-18" y="10" width="18" height="22" rx="4" fill="#063035"/>
    <rect x="-18" y="44" width="18" height="22" rx="4" fill="#063035"/>
    <rect x="130" y="10" width="18" height="22" rx="4" fill="#063035"/>
    <rect x="130" y="44" width="18" height="22" rx="4" fill="#063035"/>
    <!-- Headlights & Light Cone -->
    <circle cx="28" cy="62" r="10" fill="#ffffff"/>
    <circle cx="102" cy="62" r="10" fill="#ffffff"/>
    <polygon points="28,62 102,62 -200,450 350,450" fill="url(#sunRay)"/>
    <circle cx="28" cy="62" r="25" fill="url(#rovGlow)"/>
    <circle cx="102" cy="62" r="25" fill="url(#rovGlow)"/>
  </g>

  <!-- Fish Silhouettes -->
  <path d="M300,280 Q320,270 330,280 Q320,290 300,280 L290,285 L290,275 Z" fill="#0e535b"/>
  <path d="M340,310 Q355,302 365,310 Q355,318 340,310 L332,314 L332,306 Z" fill="#0e535b"/>
  <path d="M400,260 Q420,250 430,260 Q420,270 400,260 L390,265 L390,255 Z" fill="#0c444b"/>
</svg>
`)}`;

// *** LEGACY SVG PLACEHOLDER (unused — kept for reference only) ***
const _DIVER_RESEARCH_IMG_SVG_LEGACY = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="480" viewBox="0 0 600 480">
  <defs>
    <linearGradient id="diverBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a525a"/>
      <stop offset="100%" stop-color="#031e22"/>
    </linearGradient>
    <linearGradient id="waterRay" x1="0%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="rgba(156,234,216,0.3)"/>
      <stop offset="100%" stop-color="rgba(156,234,216,0)"/>
    </linearGradient>
  </defs>

  <rect width="600" height="480" rx="16" fill="url(#diverBg)"/>
  <polygon points="100,0 250,0 450,480 300,480" fill="url(#waterRay)"/>
  <polygon points="350,0 500,0 600,480 500,480" fill="url(#waterRay)"/>

  <!-- Coral Reef Bottom -->
  <path d="M0,360 Q150,330 300,380 T600,350 L600,480 L0,480 Z" fill="#021417"/>

  <!-- Debris / Net Mesh on Reef -->
  <path d="M320,380 Q380,330 450,390 T540,370" fill="none" stroke="#e07a5f" stroke-width="3" stroke-dasharray="6,4"/>
  <path d="M340,360 L480,410 M360,410 L520,350 M330,390 L460,340" fill="none" stroke="#f4a261" stroke-width="1.8" opacity="0.8"/>

  <!-- Scuba Diver Figure -->
  <g transform="translate(220, 100) rotate(15)">
    <!-- Oxygen Tank -->
    <rect x="40" y="20" width="70" height="26" rx="8" fill="#e9c46a"/>
    <!-- Diver Body Suit -->
    <ellipse cx="70" cy="55" rx="45" ry="22" fill="#111827"/>
    <!-- Legs & Fins -->
    <path d="M25,55 L-30,40 L-60,48 M-30,40 L-65,28" stroke="#111827" stroke-width="14" stroke-linecap="round"/>
    <polygon points="-60,48 -95,60 -80,38" fill="#00f5d4"/>
    <polygon points="-65,28 -100,38 -85,18" fill="#00f5d4"/>
    <!-- Head & Mask -->
    <circle cx="120" cy="55" r="18" fill="#111827"/>
    <rect x="124" y="46" width="16" height="18" rx="4" fill="#9cead8"/>
    <!-- Arm holding research camera / tablet -->
    <path d="M90,65 L135,90 L160,85" fill="none" stroke="#111827" stroke-width="10" stroke-linecap="round"/>
    <!-- Camera/Flash -->
    <rect x="155" y="75" width="22" height="18" rx="4" fill="#f4a261"/>
    <circle cx="166" cy="84" r="5" fill="#ffffff"/>
  </g>
</svg>
`)}`;

export default function LandingPage({ onNavigateToAnalysis }) {
  return (
    <div className="ns-landing-container">
      {/* Top Navbar */}
      <header className="ns-landing-nav">
        <div className="ns-landing-nav-inner">
          <div className="ns-landing-brand" onClick={onNavigateToAnalysis}>
            <div className="ns-landing-logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d4844" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12c2.5-3 5.5-3 8 0s5.5 3 8 0 5.5-3 8 0" />
                <path d="M2 17c2.5-3 5.5-3 8 0s5.5 3 8 0 5.5-3 8 0" />
                <circle cx="12" cy="7" r="2.5" fill="#0d4844" />
              </svg>
            </div>
            <span className="ns-landing-brand-name">NirmalSagar</span>
          </div>

          <nav className="ns-landing-links">
            <a href="#about" className="ns-landing-link">About</a>
            <a href="#research" className="ns-landing-link">Research</a>
            <a href="#workflow" className="ns-landing-link">How It Works</a>
          </nav>

          <div className="ns-landing-nav-actions">
            <button
              type="button"
              className="ns-landing-btn-nav"
              onClick={onNavigateToAnalysis}
            >
              Start Analyzing
            </button>
            <div className="ns-landing-user-badge" title="User Profile">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="ns-landing-hero">
        <div className="ns-landing-hero-bg">
          <img src={HERO_OCEAN_BG} alt="Underwater Marine Research" />
          <div className="ns-landing-hero-overlay"></div>
        </div>

        <div className="ns-landing-hero-content">
          <span className="ns-landing-hero-badge">UNDERWATER MARINE RESEARCH</span>
          <h1 className="ns-landing-hero-title">
            AI-Powered Underwater<br />
            Marine Debris Detection
          </h1>
          <p className="ns-landing-hero-subtitle">
            Detect, segment, and assess marine debris from underwater imagery using computer vision.
          </p>

          <div className="ns-landing-hero-cta-group">
            <button
              type="button"
              className="ns-landing-btn-hero-primary"
              onClick={onNavigateToAnalysis}
            >
              Analyze an Image →
            </button>

            <a href="#research" className="ns-landing-btn-hero-secondary">
              Explore the Research 🧪
            </a>
          </div>
        </div>
      </section>

      {/* Section 2: Features ("From Underwater Imagery to Insight") */}
      <section id="about" className="ns-landing-section ns-landing-bg-light">
        <div className="ns-landing-section-inner">
          <div className="ns-landing-header-group">
            <h2 className="ns-landing-section-title">From Underwater Imagery to Insight</h2>
            <p className="ns-landing-section-subtitle">
              Advanced machine learning models engineered specifically for the complexities of the benthic environment.
            </p>
          </div>

          <div className="ns-landing-features-grid">
            {/* Feature Card 1 */}
            <div className="ns-landing-feature-card">
              <div className="ns-landing-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0d4844" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h3 className="ns-landing-card-title">Detection & Segmentation</h3>
              <p className="ns-landing-card-desc">
                Identify and localize marine debris in underwater imagery using instance segmentation models.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="ns-landing-feature-card">
              <div className="ns-landing-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0d4844" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2a10 10 0 0 0 0 20z" fill="#0d4844" opacity="0.3"></path>
                </svg>
              </div>
              <h3 className="ns-landing-card-title">Underwater Image Analysis</h3>
              <p className="ns-landing-card-desc">
                Analyze challenging underwater imagery affected by turbidity, low light, and visual clutter without manual pre-processing.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="ns-landing-feature-card">
              <div className="ns-landing-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0d4844" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="6" cy="6" r="3"></circle>
                  <circle cx="18" cy="18" r="3"></circle>
                  <circle cx="6" cy="18" r="2"></circle>
                </svg>
              </div>
              <h3 className="ns-landing-card-title">Debris Density Assessment</h3>
              <p className="ns-landing-card-desc">
                Estimate debris density to support pollution assessment and cleanup prioritization across expansive surveyed areas.
              </p>
            </div>
          </div>

          {/* Analysis Workflow Timeline */}
          <div id="workflow" className="ns-landing-workflow-container">
            <h3 className="ns-landing-workflow-title">Analysis Workflow</h3>

            <div className="ns-landing-workflow-steps">
              <div className="ns-landing-step">
                <div className="ns-landing-step-circle">01</div>
                <h4 className="ns-landing-step-heading">Upload</h4>
                <p className="ns-landing-step-text">Upload underwater imagery for analysis.</p>
              </div>
              <div className="ns-landing-step-line"></div>

              <div className="ns-landing-step">
                <div className="ns-landing-step-circle">02</div>
                <h4 className="ns-landing-step-heading">Analyze</h4>
                <p className="ns-landing-step-text">Process underwater imagery for AI-based analysis.</p>
              </div>
              <div className="ns-landing-step-line"></div>

              <div className="ns-landing-step">
                <div className="ns-landing-step-circle">03</div>
                <h4 className="ns-landing-step-heading">Detect</h4>
                <p className="ns-landing-step-text">Identify and segment marine debris categories.</p>
              </div>
              <div className="ns-landing-step-line"></div>

              <div className="ns-landing-step">
                <div className="ns-landing-step-circle">04</div>
                <h4 className="ns-landing-step-heading">Assess</h4>
                <p className="ns-landing-step-text">Estimate debris density and pollution-related indicators.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Researching Smarter Underwater Monitoring */}
      <section id="research" className="ns-landing-section ns-landing-bg-white">
        <div className="ns-landing-section-inner ns-landing-research-layout">
          <div className="ns-landing-research-info">
            <h2 className="ns-landing-section-title left">Researching Smarter Underwater Monitoring</h2>
            <p className="ns-landing-section-subtitle left">
              NirmalSagar is built upon continuous research into solving the unique challenges of benthic computer vision. We focus on rigorous validation and architectural improvements to handle diverse underwater domains.
            </p>

            <div className="ns-landing-research-list">
              <div className="ns-landing-research-item">
                <div className="ns-landing-check-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d4844" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <h4 className="ns-landing-item-title">Instance Segmentation</h4>
                  <p className="ns-landing-item-desc">Precise pixel-level boundary definition for accurate volume and type estimation.</p>
                </div>
              </div>

              <div className="ns-landing-research-item">
                <div className="ns-landing-check-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d4844" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <h4 className="ns-landing-item-title">Underwater Image Enhancement</h4>
                  <p className="ns-landing-item-desc">Algorithmic mitigation of color distortion and light attenuation inherent to deep water.</p>
                </div>
              </div>

              <div className="ns-landing-research-item">
                <div className="ns-landing-check-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d4844" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <h4 className="ns-landing-item-title">Domain Generalization</h4>
                  <p className="ns-landing-item-desc">Ensuring model reliability across different oceans, lighting conditions, and camera sensors.</p>
                </div>
              </div>

              <div className="ns-landing-research-item">
                <div className="ns-landing-check-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d4844" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <h4 className="ns-landing-item-title">Debris-Density Estimation</h4>
                  <p className="ns-landing-item-desc">Translating localized detections into broader environmental impact metrics.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="ns-landing-research-media">
            <img src={DIVER_RESEARCH_IMG} alt="Benthic Underwater Research" className="ns-landing-diver-img" />
          </div>
        </div>
      </section>

      {/* Section 4: Call To Action Banner */}
      <section className="ns-landing-cta-banner">
        <div className="ns-landing-cta-inner">
          <h2 className="ns-landing-cta-title">Turn underwater imagery into actionable insight.</h2>
          <p className="ns-landing-cta-subtitle">
            Deploy advanced machine learning models to accelerate marine cleanup initiatives and environmental research.
          </p>
          <button
            type="button"
            className="ns-landing-btn-banner"
            onClick={onNavigateToAnalysis}
          >
            Start Image Analysis 🚀
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="ns-landing-footer">
        <div className="ns-landing-footer-inner">
          <div className="ns-landing-footer-left">
            <div className="ns-landing-brand text-light">
              <div className="ns-landing-logo-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9cead8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12c2.5-3 5.5-3 8 0s5.5 3 8 0 5.5-3 8 0" />
                  <path d="M2 17c2.5-3 5.5-3 8 0s5.5 3 8 0 5.5-3 8 0" />
                  <circle cx="12" cy="7" r="2.5" fill="#9cead8" />
                </svg>
              </div>
              <span className="ns-landing-brand-name light">NirmalSagar</span>
            </div>
            <p className="ns-landing-footer-tagline">AI-powered underwater marine debris detection and analysis.</p>
          </div>

          <div className="ns-landing-footer-right">
            <p className="ns-landing-copyright">© NirmalSagar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
