document.addEventListener("DOMContentLoaded", (event) => {
  // Wait a small moment to ensure GSAP is loaded and DOM is fully ready
  setTimeout(initGsapAnimations, 100);
});

function initGsapAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn("GSAP or ScrollTrigger not loaded");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Task 2: Smooth Scroll-Triggered Section Entrances
  // Target all .section elements
  const sections = document.querySelectorAll('.section');
  sections.forEach((section) => {
    // Only target reveal-up elements that are NOT timeline-items (handled separately)
    const elementsToReveal = section.querySelectorAll('.reveal-up:not(.timeline-item)');
    
    if (elementsToReveal.length > 0) {
      // Create a stagger animation for elements inside the section when it enters viewport
      gsap.fromTo(elementsToReveal, 
        { 
          y: 30, 
          autoAlpha: 0 
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%", // Trigger when top of section hits 80% of viewport height
            toggleActions: "play none none none" // Only play once
          }
        }
      );
    }
  });

  // Hero section animations immediately (since it's at the top)
  const heroElements = document.querySelectorAll('#hero .reveal-up');
  if (heroElements.length > 0) {
    gsap.fromTo(heroElements,
      { y: 30, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 0.2 }
    );
  }

  // Task 3: 3D Tilt Effect on Skill & Project Cards
  const tiltCards = document.querySelectorAll('.skill-card, .project-card');
  tiltCards.forEach(card => {
    // Add CSS perspective to parent or card directly for 3D effect
    card.parentElement.style.perspective = "1000px";
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top;  // y position within the element
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
      const rotateY = ((x - centerX) / centerX) * 10;
      
      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        ease: "power2.out",
        duration: 0.4
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        ease: "power3.out",
        duration: 0.6
      });
    });
  });

  // Task 5: GSAP Timeline-Based animation for the Experience / Education Sections
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item) => {
    const dot = item.querySelector('.timeline-dot');
    const line = item.querySelector('.timeline-line');
    const content = item.querySelector('.timeline-content');
    
    if (!dot || !content) return;

    // Create a mini timeline for each item
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });

    // Reset initial states
    gsap.set(dot, { scale: 0, autoAlpha: 0 });
    if (line) gsap.set(line, { scaleY: 0, transformOrigin: "top center" });
    gsap.set(content, { x: 30, autoAlpha: 0 });

    tl.to(dot, { scale: 1, autoAlpha: 1, duration: 0.4, ease: "back.out(2)" });
    
    if (line) {
      tl.to(line, { scaleY: 1, duration: 0.4, ease: "power1.inOut" }, "-=0.1");
    }
    
    tl.to(content, { x: 0, autoAlpha: 1, duration: 0.5, ease: "power2.out" }, "-=0.3");
  });
}
