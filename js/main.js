// ===== Mobile Navigation Toggle =====
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // ===== Homepage Hero Slideshow (images + text + arrows) =====
  const slides = document.querySelectorAll('.hero-slide');
  const textSlides = document.querySelectorAll('.hero-text');
  const arrowLeft = document.querySelector('.hero-arrow--left');
  const arrowRight = document.querySelector('.hero-arrow--right');

  if (slides.length > 1) {
    let current = 0;
    let autoPlay;

    function goToSlide(index, direction) {
      const dir = direction || 'right';
      const prev = current;
      current = (index + slides.length) % slides.length;

      // Set direction classes on outgoing
      slides[prev].classList.add(dir === 'right' ? 'exit-left' : 'exit-right');
      slides[prev].classList.remove('active');

      // Set direction classes on incoming
      slides[current].classList.add(dir === 'right' ? 'enter-right' : 'enter-left');
      // Force reflow
      slides[current].offsetWidth;
      slides[current].classList.add('active');
      slides[current].classList.remove('enter-right', 'enter-left');

      if (textSlides.length > 0) {
        textSlides[prev].classList.add(dir === 'right' ? 'exit-left' : 'exit-right');
        textSlides[prev].classList.remove('active');

        textSlides[current].classList.add(dir === 'right' ? 'enter-right' : 'enter-left');
        textSlides[current].offsetWidth;
        textSlides[current].classList.add('active');
        textSlides[current].classList.remove('enter-right', 'enter-left');
      }

      // Clean up exit classes after transition
      setTimeout(() => {
        slides[prev].classList.remove('exit-left', 'exit-right');
        if (textSlides.length > 0) textSlides[prev].classList.remove('exit-left', 'exit-right');
      }, 1000);
    }

    function startAutoPlay() {
      autoPlay = setInterval(() => goToSlide(current + 1, 'right'), 6000);
    }

    function resetAutoPlay() {
      clearInterval(autoPlay);
      startAutoPlay();
    }

    if (arrowRight) {
      arrowRight.addEventListener('click', () => { goToSlide(current + 1, 'right'); resetAutoPlay(); });
    }
    if (arrowLeft) {
      arrowLeft.addEventListener('click', () => { goToSlide(current - 1, 'left'); resetAutoPlay(); });
    }

    startAutoPlay();
  }

  // ===== Active Nav Link =====
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ===== FAQ Accordion =====
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // Close all other items
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ===== Contact Form Validation + Formspree Submit =====
  const form = document.getElementById('contact-form');
  const formSuccess = document.querySelector('.form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Clear previous errors
      form.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('has-error');
      });

      // Validate name
      const name = form.querySelector('#name');
      if (!name.value.trim()) {
        showError(name, 'Please enter your name.');
        isValid = false;
      }

      // Validate email
      const email = form.querySelector('#email');
      if (!email.value.trim()) {
        showError(email, 'Please enter your email.');
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        showError(email, 'Please enter a valid email address.');
        isValid = false;
      }

      // Validate message
      const message = form.querySelector('#message');
      if (!message.value.trim()) {
        showError(message, 'Please enter a message.');
        isValid = false;
      }

      if (isValid) {
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        }).then(response => {
          if (response.ok) {
            form.style.display = 'none';
            formSuccess.style.display = 'block';
          } else {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
            alert('Something went wrong. Please try again.');
          }
        }).catch(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
          alert('Something went wrong. Please try again.');
        });
      }
    });
  }

  function showError(input, message) {
    const group = input.closest('.form-group');
    group.classList.add('has-error');
    const errorMsg = group.querySelector('.error-msg');
    if (errorMsg) errorMsg.textContent = message;
  }
});
