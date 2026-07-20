/* ==========================================================================
   MASS ENERGY - Interactive JavaScript Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCalculator();
  initCounterAnimation();
  initFAQAccordion();
  initModal();
  initLiveTicker();
});

/* --------------------------------------------------------------------------
   1. Navbar Scroll & Mobile Menu Toggle
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close mobile menu on clicking any link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }
}

function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

/* --------------------------------------------------------------------------
   2. Interactive ROI & Savings Calculator
   -------------------------------------------------------------------------- */
let currentPropMultiplier = 0.75; // Residential default multiplier

function setPropType(element) {
  document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');
  currentPropMultiplier = parseFloat(element.dataset.rate) || 0.75;
  updateCalculator();
}

function initCalculator() {
  const billSlider = document.getElementById('billSlider');
  const spaceSlider = document.getElementById('spaceSlider');

  if (billSlider && spaceSlider) {
    billSlider.addEventListener('input', updateCalculator);
    spaceSlider.addEventListener('input', updateCalculator);
    updateCalculator();
  }
}

function updateCalculator() {
  const billVal = parseInt(document.getElementById('billSlider').value);
  const spaceVal = parseInt(document.getElementById('spaceSlider').value);

  // Update UI Labels
  document.getElementById('billVal').textContent = `$${billVal.toLocaleString()}/mo`;
  document.getElementById('spaceVal').textContent = `${spaceVal.toLocaleString()} sq ft`;

  // Calculation Logic
  // Annual bill = billVal * 12
  // Bill savings rate ~ 80% to 90% depending on prop multiplier
  const annualBill = billVal * 12;
  const annualSave = Math.round(annualBill * currentPropMultiplier);
  const net25YearSavings = Math.round(annualSave * 25 * 0.85);

  // Recommended kW capacity based on bill
  const recKW = (billVal / 40).toFixed(1);

  // Payback period
  const payback = (7.5 / currentPropMultiplier).toFixed(1);

  // CO2 equivalent trees
  const trees = Math.round(annualSave * 0.45);

  // Federal / Local tax incentive (~30%)
  const taxCredit = Math.round(billVal * 10);

  // Update DOM with formatted values
  document.getElementById('annualSavings').textContent = `$${net25YearSavings.toLocaleString()}`;
  document.getElementById('recCapacity').textContent = `${recKW} kW`;
  document.getElementById('paybackTime').textContent = `${payback} Yrs`;
  document.getElementById('treeEquivalent').textContent = `${trees.toLocaleString()} Trees`;
  document.getElementById('taxCredit').textContent = `$${taxCredit.toLocaleString()}`;
}

/* --------------------------------------------------------------------------
   3. Animated Counters on Scroll
   -------------------------------------------------------------------------- */
function initCounterAnimation() {
  const statNums = document.querySelectorAll('.stat-num');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNums.forEach(num => {
          const target = parseInt(num.getAttribute('data-target'));
          const duration = 2000;
          const step = Math.ceil(target / (duration / 16));
          let current = 0;

          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              num.textContent = target.toLocaleString() + (target === 99 ? '%' : '+');
              clearInterval(timer);
            } else {
              num.textContent = current.toLocaleString();
            }
          }, 16);
        });
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    observer.observe(heroStats);
  }
}

/* --------------------------------------------------------------------------
   4. Technology Tab Switching
   -------------------------------------------------------------------------- */
function switchTab(tabId, btnElement) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  btnElement.classList.add('active');
  const targetContent = document.getElementById(tabId);
  if (targetContent) {
    targetContent.classList.add('active');
  }
}

/* --------------------------------------------------------------------------
   5. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all active items
      faqItems.forEach(i => i.classList.remove('active'));

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. Consultation Modal & Form Handling
   -------------------------------------------------------------------------- */
function initModal() {
  const modal = document.getElementById('consultModal');
  const openBtn = document.getElementById('openModalBtn');

  if (openBtn) {
    openBtn.addEventListener('click', openConsultationModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeConsultationModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeConsultationModal();
      }
    });
  }
}

function openConsultationModal() {
  const modal = document.getElementById('consultModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeConsultationModal() {
  const modal = document.getElementById('consultModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function handleFormSubmit(e) {
  e.preventDefault();
  closeConsultationModal();
  showToast('🎉 Consultation request received! Our energy engineer will contact you shortly.');
  e.target.reset();
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }
}

/* --------------------------------------------------------------------------
   7. Live Ticker Real-Time Simulation
   -------------------------------------------------------------------------- */
function initLiveTicker() {
  const solarOutputEl = document.getElementById('solarOutput');
  const co2CounterEl = document.getElementById('co2Counter');

  let currentMWh = 48.2;
  let currentCO2 = 142590;

  setInterval(() => {
    currentMWh += 0.05;
    currentCO2 += 1;

    if (solarOutputEl) {
      solarOutputEl.textContent = `${currentMWh.toFixed(2)} MWh`;
    }

    if (co2CounterEl) {
      co2CounterEl.textContent = `${currentCO2.toLocaleString()} Tons CO₂ Saved`;
    }
  }, 3000);
}
