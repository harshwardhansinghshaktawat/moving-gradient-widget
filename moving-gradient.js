class MovingGradient extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isAnimating = false;
  }

  static get observedAttributes() {
    return [
      'text', 'heading-tag', 'font-family', 'font-size', 
      'text-alignment', 'background-color', 'gradient-preset', 
      'gradient-type', 'animation-duration'
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
    this.handleResize = () => this.render();
    window.addEventListener('resize', this.handleResize);
    this.setupIntersectionObserver();
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.handleResize);
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.isAnimating) {
          this.isAnimating = true;
          this.startAnimation();
          observer.unobserve(this);
        }
      });
    }, { threshold: 0.1 });
    this.observer.observe(this);
  }

  startAnimation() {
    const heading = this.shadowRoot.querySelector('.gradient');
    heading.style.animationPlayState = 'running';
  }

  getGradientColors(preset) {
    const presets = {
      'Teal Sunrise': ['#2A9D8F', '#E9C46A', '#F4A261'],
      'Berry Bliss': ['#9B1D64', '#D84797', '#F8A1D1'],
      'Citrus Burst': ['#F4A261', '#E76F51', '#FFD166'],
      'Forest Glow': ['#2A6041', '#5E8B7E', '#A3BBAD'],
      'Ocean Depth': ['#264653', '#2A9D8F', '#83C5BE'],
      'Sunset Flare': ['#E63946', '#F1A9A0', '#FEC89A'],
      'Purple Dawn': ['#7209B7', '#B5179E', '#F72585'],
      'Golden Dusk': ['#FFD60A', '#FFC107', '#FF9505'],
      'Emerald Tide': ['#006D77', '#83C5BE', '#EDF6F9'],
      'Coral Reef': ['#FF6B6B', '#FF9999', '#FFDAB9'],
      'Midnight Blue': ['#03045E', '#023E8A', '#0077B6'],
      'Pink Horizon': ['#FF70A6', '#FF9770', '#FFD670'],
      'Lime Twist': ['#99D98C', '#76C893', '#52B69A'],
      'Violet Haze': ['#7209B7', '#9B5DE5', '#F15BB5'],
      'Amber Glow': ['#8B5A2B', '#CD853F', '#F4A460'],
      'Sapphire Sky': ['#000080', '#4169E1', '#87CEFA'],
      'Blush Bloom': ['#FF9999', '#FFCC99', '#FFFF99'],
      'Electric Pulse': ['#483D8B', '#6A5ACD', '#9370DB'],
      'Fire Spark': ['#D00000', '#FF4500', '#FF8C00'],
      'Icy Wave': ['#4682B4', '#87CEEB', '#ADD8E6'],
      'Mystic Shade': ['#2F004F', '#4B0082', '#9400D3'],
      'Autumn Leaf': ['#8B4513', '#D2691E', '#F4A460'],
      'Velvet Night': ['#4A2C5A', '#6B3E7A', '#9B59B6'],
      'Tropical Sun': ['#00CED1', '#20B2AA', '#48D1CC'],
      'Candy Pop': ['#FF70A6', '#FF9770', '#FFD670'],
      'Lunar Dust': ['#2F2F2F', '#696969', '#A9A9A9'],
      'Pink Whisper': ['#FF69B4', '#FFB6C1', '#FFD1DC'],
      'Teal Mist': ['#008080', '#20B2AA', '#48D1CC'],
      'Golden Wave': ['#FFD700', '#FFA500', '#FF4500'],
      'Emerald Shine': ['#004B23', '#006400', '#008000'],
      'Purple Mist': ['#4B0082', '#800080', '#DA70D6'],
      'Coral Dawn': ['#FF4040', '#FF7F50', '#FFDAB9'],
      'Sapphire Glow': ['#000080', '#4169E1', '#87CEFA'],
      'Blush Fade': ['#FF9999', '#FFCC99', '#FFFF99'],
      'Neon Flash': ['#FF00FF', '#00FFFF', '#FFFF00'],
      'Ocean Breeze': ['#1A759F', '#34A0A4', '#76C893', '#B7E4C7'],
      'Sunset Glow': ['#FF6B6B', '#FF9F1C', '#FFD60A', '#FFEE88'],
      'Neon Pulse': ['#FF00FF', '#00FFFF', '#FF00FF', '#00FFFF'],
      'Forest Mist': ['#2D6A4F', '#40916C', '#74C69D', '#B7E4C7'],
      'Cosmic Dust': ['#3D405B', '#5A5F7D', '#81A4CD', '#C2E7FF'],
      'Lava Flow': ['#D00000', '#FF4500', '#FF8C00', '#FFC107'],
      'Twilight Haze': ['#7209B7', '#9B5DE5', '#F15BB5', '#FEE440'],
      'Aurora Veil': ['#006D77', '#83C5BE', '#EDF6F9', '#FFDDD2'],
      'Candy Rush': ['#FF70A6', '#FF9770', '#FFD670', '#E9FF70'],
      'Midnight Sky': ['#03045E', '#023E8A', '#0077B6', '#90E0EF'],
      'Golden Hour': ['#FFD700', '#FFA500', '#FF4500', '#8B0000'],
      'Emerald Dream': ['#004B23', '#006400', '#008000', '#90EE90'],
      'Purple Reign': ['#4B0082', '#800080', '#DA70D6', '#FFB6C1'],
      'Tropical Wave': ['#00CED1', '#20B2AA', '#48D1CC', '#AFEEEE'],
      'Blush Bloom': ['#FF9999', '#FFCC99', '#FFFF99', '#CCFF99'],
      'Electric Storm': ['#483D8B', '#6A5ACD', '#9370DB', '#E6E6FA'],
      'Fire Opal': ['#E25822', '#F28C38', '#FBBF24', '#FFF8DC'],
      'Icy Peak': ['#4682B4', '#87CEEB', '#ADD8E6', '#F0F8FF'],
      'Berry Blast': ['#800000', '#C71585', '#FF1493', '#FFB6C1'],
      'Citrus Twist': ['#FFA07A', '#FFD700', '#ADFF2F', '#7FFF00'],
      'Mystic Tide': ['#2F004F', '#4B0082', '#9400D3', '#E0B0FF'],
      'Autumn Blaze': ['#8B4513', '#D2691E', '#F4A460', '#FFDAB9'],
      'Velvet Dawn': ['#4A2C5A', '#6B3E7A', '#9B59B6', '#D7BDE2'],
      'Sapphire Shine': ['#000080', '#4169E1', '#87CEFA', '#E0FFFF'],
      'Coral Reef': ['#FF4040', '#FF7F50', '#FFDAB9', '#FFE4E1'],
      'Lunar Glow': ['#2F2F2F', '#696969', '#A9A9A9', '#F5F5F5'],
      'Pink Sunset': ['#FF69B4', '#FFB6C1', '#FFD1DC', '#FFF0F5'],
      'Teal Horizon': ['#008080', '#20B2AA', '#48D1CC', '#B0E0E6'],
      'Amber Waves': ['#8B5A2B', '#CD853F', '#F4A460', '#FFE4B5'],
      'Violet Mist': ['#6A0DAD', '#9932CC', '#BA55D3', '#E6E6FA'],
      'Rainbow Burst': ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'],
      'Pastel Dream': ['#F4C2C2', '#FFD1DC', '#E2E2DF', '#D4A5A5'],
      'Earthy Tone': ['#8D5524', '#C68E17', '#D9A566', '#E8C7A1'],
      'Cool Breeze': ['#00A8CC', '#48C4D9', '#7ED4E6', '#B3E5FC'],
      'Warm Ember': ['#B22222', '#FF4500', '#FFA07A', '#FFDAB9']
    };
    return presets[preset] || presets['Teal Sunrise'];
  }

  render() {
    const text = this.getAttribute('text') || 'Greetings Unleashed';
    const headingTag = this.getAttribute('heading-tag') || 'h1';
    const fontFamily = this.getAttribute('font-family') || 'Lobster';
    const fontSize = parseFloat(this.getAttribute('font-size')) || 10; // In vw
    const textAlignment = this.getAttribute('text-alignment') || 'center';
    const backgroundColor = this.getAttribute('background-color') || '#1B263B';
    const gradientPreset = this.getAttribute('gradient-preset') || 'Teal Sunrise';
    const gradientType = this.getAttribute('gradient-type') || 'linear-gradient';
    const animationDuration = parseFloat(this.getAttribute('animation-duration')) || 1; // In seconds
    const gradientColors = this.getGradientColors(gradientPreset);

    this.isAnimating = false;

    // Configure gradient based on type
    let initialGradient, midGradient;
    switch (gradientType) {
      case 'linear-gradient':
        initialGradient = `linear-gradient(90deg, ${gradientColors.join(', ')})`;
        midGradient = `linear-gradient(262deg, ${gradientColors.join(', ')})`;
        break;
      case 'radial-gradient':
        initialGradient = `radial-gradient(circle, ${gradientColors.join(', ')})`;
        midGradient = `radial-gradient(circle at 70% 30%, ${gradientColors.join(', ')})`;
        break;
      case 'conic-gradient':
        initialGradient = `conic-gradient(from 0deg, ${gradientColors.join(', ')})`;
        midGradient = `conic-gradient(from 180deg, ${gradientColors.join(', ')})`;
        break;
      case 'repeating-linear-gradient':
        initialGradient = `repeating-linear-gradient(90deg, ${gradientColors.join(', ')} 0% 25%)`;
        midGradient = `repeating-linear-gradient(262deg, ${gradientColors.join(', ')} 0% 25%)`;
        break;
      case 'repeating-radial-gradient':
        initialGradient = `repeating-radial-gradient(circle, ${gradientColors.join(', ')} 0% 20%)`;
        midGradient = `repeating-radial-gradient(circle at 70% 30%, ${gradientColors.join(', ')} 0% 20%)`;
        break;
      case 'repeating-conic-gradient':
        initialGradient = `repeating-conic-gradient(from 0deg, ${gradientColors.join(', ')} 0deg 90deg)`;
        midGradient = `repeating-conic-gradient(from 180deg, ${gradientColors.join(', ')} 0deg 90deg)`;
        break;
      default:
        initialGradient = `linear-gradient(90deg, ${gradientColors.join(', ')})`;
        midGradient = `linear-gradient(262deg, ${gradientColors.join(', ')})`;
    }

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Lobster&display=swap');

        :host {
          height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: ${fontFamily}, cursive;
          background: ${backgroundColor};
        }

        .gradient {
          background-image: ${initialGradient};
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          font-size: ${fontSize}vw;
          text-align: ${textAlignment};
          animation: move ${animationDuration}s infinite;
          animation-play-state: paused;
          margin: 0;
        }

        @keyframes move {
          50% {
            background-image: ${midGradient};
          }
        }
      </style>
      <${headingTag} class="gradient">${text}</${headingTag}>
    `;
  }
}

customElements.define('moving-gradient', MovingGradient);
