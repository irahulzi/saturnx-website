// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  // Create mobile menu elements if they don't exist
  const nav = document.querySelector('.nav');
  
  // Check if mobile menu toggle already exists
  if (!document.querySelector('.mobile-menu-toggle')) {
    // Create hamburger button
    const menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.setAttribute('aria-label', 'Toggle mobile menu');
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    // Insert the button after the nav
    nav.parentNode.insertBefore(menuToggle, nav.nextSibling);
  }
  
  // Check if mobile menu overlay already exists
  if (!document.querySelector('.mobile-menu-overlay')) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);
  }
  
  // Get elements
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navSections = document.querySelector('.nav-sections');
  const overlay = document.querySelector('.mobile-menu-overlay');
  const menuLinks = document.querySelectorAll('.nav-pill');
  
  // Toggle menu function
  function toggleMenu() {
    navSections.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Update icon
    const icon = menuToggle.querySelector('i');
    if (navSections.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
      menuToggle.setAttribute('aria-label', 'Close mobile menu');
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
      menuToggle.setAttribute('aria-label', 'Toggle mobile menu');
      // Restore body scroll
      document.body.style.overflow = '';
    }
  }
  
  // Close menu function
  function closeMenu() {
    navSections.classList.remove('active');
    overlay.classList.remove('active');
    const icon = menuToggle.querySelector('i');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
    menuToggle.setAttribute('aria-label', 'Toggle mobile menu');
    document.body.style.overflow = '';
  }
  
  // Event listeners
  menuToggle.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);
  
  // Close menu when clicking on a link
  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  // Close menu on ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navSections.classList.contains('active')) {
      closeMenu();
    }
  });
  
  // Close menu when resizing to desktop view
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (window.innerWidth > 900 && navSections.classList.contains('active')) {
        closeMenu();
      }
    }, 250);
  });
});
