// Carousel functionality variables
let slideIndex = 1;
let touchStartX = 0;
let touchEndX = 0;
let isDragging = false;
let currentTranslate = 0;
let animationID;
const SWIPE_THRESHOLD = 50; // Minimum distance for a swipe to trigger slide change
let isTransitioning = false;
let autoAdvanceInterval = null; // Variable to store the auto-advance interval

// DOM element variables, to be assigned in DOMContentLoaded
let carouselTrack = null;
let slides = []; // Using querySelectorAll later, so initialize as array
let dots = [];   // Using querySelectorAll later, so initialize as array

// Next/previous controls for carousel
function plusSlides(n, isSwipe = false) {
    if (isTransitioning && !isSwipe) return;
    
    const slides = document.querySelectorAll('.carousel-slide');
    if (!slides.length) return;
    
    const newIndex = slideIndex + n;
    
    // Check if we're at the beginning or end
    if (newIndex > slides.length) {
        slideIndex = 1;
    } else if (newIndex < 1) {
        slideIndex = slides.length;
    } else {
        slideIndex = newIndex;
    }
    
    // Scroll to the active slide
    scrollToActiveSlide();
    
    // Update dots
    updateActiveDot();
    
    // Reset auto-advance timer
    resetAutoAdvance();
}

// Scroll to the active slide
function scrollToActiveSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length === 0 || slideIndex < 1 || slideIndex > slides.length) return;
    
    const activeSlide = slides[slideIndex - 1];
    if (activeSlide) {
        activeSlide.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }
}

// Update active dot
function updateActiveDot() {
    const dots = document.querySelectorAll('.dot');
    if (!dots.length) return;
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === slideIndex - 1);
    });
}

// Reset auto-advance timer
function resetAutoAdvance() {
    if (autoAdvanceInterval) {
        clearInterval(autoAdvanceInterval);
    }
    startAutoAdvance();
}

// Thumbnail image controls for carousel
function currentSlide(n) {
    if (n > 0 && n <= slides.length) {
        slideIndex = n;
        updateActiveSlide();
    }
}

function updateActiveSlide() {
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === slideIndex - 1);
    });
    
    // Scroll to active slide
    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }
}

// Initialize carousel slides
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const track = document.querySelector('.carousel-track');
    console.log('Carousel track element:', track);
    
    if (!slides.length || !track) return;
    
    // Set initial slide index
    slideIndex = 1;
    
    // Ensure all slides are visible and properly sized
    slides.forEach((slide, index) => {
        slide.style.display = 'inline-block';
        slide.style.width = '90vw';
        slide.style.maxWidth = '500px';
        slide.style.minWidth = '300px';
        slide.style.margin = '0 10px';
        slide.style.verticalAlign = 'top';
        slide.style.scrollSnapAlign = 'center';
        slide.style.scrollSnapStop = 'always';
    });
    
    // Initialize dots
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === 0);
            dot.addEventListener('click', () => currentSlide(index + 1));
        });
    }
    
    // Center first slide
    setTimeout(() => {
        if (slides[0]) {
            slides[0].scrollIntoView({
                behavior: 'auto',
                block: 'nearest',
                inline: 'center'
            });
        }
    }, 100); // End of setTimeout for scrollIntoView
    
    // Initialize header morphing
    initHeaderMorphing();
    
    // Set up auto-advance
    startAutoAdvance();
    
    // Set up keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') plusSlides(-1);
        if (e.key === 'ArrowRight') plusSlides(1);
    });
// Removed the stray }, 50); from here

}

// Initialize header morphing
function initHeaderMorphing() {
    console.log('initHeaderMorphing called');
    const header = document.querySelector('header');
    const logoContainer = document.querySelector('.logo-container');
    const logo = document.querySelector('.logo-container img.logo');
    const headerTitle = document.querySelector('.logo-container h1');
    const mainNav = document.querySelector('.main-nav');
    
    function updateHeader() {
        // console.log('updateHeader called, window.scrollY:', window.scrollY);
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            console.log('Header class scrolled ADDED');
        } else {
            header.classList.remove('scrolled');
            console.log('Header class scrolled REMOVED');
        }
    }
    
    // Initial check in case page loads with scroll
    updateHeader();
    
    // Listen for scroll events with debounce
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateHeader();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// Show specific slide
function showSlides(n) {
    if (!slides.length || isTransitioning) return;
    plusSlides(n - slideIndex);
}

// Touch event handlers
function handleTouchStart(e) {
    if (isTransitioning) return;
    stopAutoAdvance();
    
    touchStartX = e.touches ? e.touches[0].clientX : e.clientX;
    touchEndX = touchStartX;
    isDragging = true;
    
    // Cancel any ongoing animations
    cancelAnimationFrame(animationID);
    
    // Store initial position
    const currentSlide = slides[slideIndex - 1];
    if (currentSlide) {
        currentSlide.style.transition = 'none';
        currentTranslate = 0;
    }
    
    // Prevent text selection during drag
    e.preventDefault();
    e.stopPropagation();
}

function handleTouchMove(e) {
    if (!isDragging || isTransitioning) return;
    
    touchEndX = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = touchEndX - touchStartX;
    
    // Prevent scrolling the page while swiping
    if (Math.abs(diff) > 10) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    const currentSlide = slides[slideIndex - 1];
    if (!currentSlide) return;
    
    // Apply resistance to make it harder to drag
    const resistance = 0.5;
    let dragDistance = diff * resistance;
    
    // Add more resistance at the boundaries
    if ((slideIndex === 1 && dragDistance > 0) || 
        (slideIndex === slides.length && dragDistance < 0)) {
        dragDistance *= 0.3; // More resistance at boundaries
    }
    
    currentSlide.style.transform = `translateX(${dragDistance}px)`;
}

function handleTouchEnd() {
    if (!isDragging || isTransitioning) {
        resetTouchState();
        return;
    }
    
    const diff = touchEndX - touchStartX;
    const currentSlide = slides[slideIndex - 1];
    
    if (!currentSlide) {
        resetTouchState();
        return;
    }
    
    // Smoothly return to position if not enough swipe
    if (Math.abs(diff) <= SWIPE_THRESHOLD) {
        currentSlide.style.transition = 'transform 0.3s ease-out';
        currentSlide.style.transform = 'translateX(0)';
        
        // Remove transition after animation completes
        setTimeout(() => {
            if (currentSlide) {
                currentSlide.style.transition = '';
            }
            resetTouchState();
        }, 300);
        return;
    }
    
    // Determine direction and change slide
    if (diff > 0) {
        // Swipe right - previous slide
        plusSlides(-1, true);
    } else {
        // Swipe left - next slide
        plusSlides(1, true);
    }
    
    resetTouchState();
}

function resetTouchState() {
    isDragging = false;
    touchStartX = 0;
    touchEndX = 0;
    
    // Resume auto-advance after a delay
    setTimeout(startAutoAdvance, 3000);
}

// Handle responsive display of carousel
function handleCarouselDisplay() {
    if (!slides.length) return; // Exit if no slides exist
    
    // Always show navigation dots for better usability
    const navigation = document.querySelector('.carousel-navigation');
    if (navigation) {
        navigation.style.display = 'flex';
    }
    
    // Update slides display
    showSlides(slideIndex);
}

// Auto-advance interval (in milliseconds)
const AUTO_ADVANCE_INTERVAL = 5000;

// Debounce helper function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle responsive behavior
function handleResize() {
    const slides = document.querySelectorAll('.carousel-slide');
    if (!slides.length) return;
    
    // Adjust slide width based on viewport
    const viewportWidth = window.innerWidth;
    const slideWidth = Math.min(500, viewportWidth * 0.9);
    
    slides.forEach(slide => {
        slide.style.width = `${slideWidth}px`;
        slide.style.minWidth = `${slideWidth}px`;
    });
    
    // Restart auto-advance on desktop
    if (viewportWidth > 768) {
        startAutoAdvance();
    } else {
        stopAutoAdvance();
    }
}

// Start auto-advancing the carousel
function startAutoAdvance() {
    // Don't start auto-advance on mobile devices
    if (window.innerWidth <= 768) return;
    
    // Clear any existing interval
    if (autoAdvanceInterval) {
        clearInterval(autoAdvanceInterval);
    }
    
    // Set up new interval
    autoAdvanceInterval = setInterval(() => {
        plusSlides(1);
    }, AUTO_ADVANCE_INTERVAL);
}

// Initialize responsive behavior
window.addEventListener('resize', debounce(handleResize, 250));

// Initial setup
handleResize();

// Stop auto-advancing the carousel
function stopAutoAdvance() {
    if (autoAdvanceInterval) {
        clearInterval(autoAdvanceInterval);
        autoAdvanceInterval = null;
    }
}

// Initialize carousel event listeners
function setupCarousel(passedTrack, passedSlides) {
    console.log('setupCarousel called');
    console.log('passedTrack inside setupCarousel (before check):', passedTrack);
    console.log('passedSlides.length inside setupCarousel (before check):', passedSlides ? passedSlides.length : 'passedSlides is undefined/null');
    // Use passedTrack and passedSlides arguments
    if (!passedTrack || !passedSlides || passedSlides.length === 0) {
        console.error('Aborting setupCarousel: track or slides still missing.');
        return; 
    }
    
    // Initialize carousel first
    initCarousel();
    
    // Show the first slide
    if (passedSlides.length > 0) {
        showSlides(slideIndex);
    }
    
    // Set up event listeners
    const prevButton = document.querySelector('.carousel-arrow.prev');
    const nextButton = document.querySelector('.carousel-arrow.next');
    
    if (prevButton) {
        prevButton.addEventListener('click', () => plusSlides(-1));
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => plusSlides(1));
    }
    
    // Touch events
    if (passedTrack) {
        passedTrack.addEventListener('touchstart', handleTouchStart, { passive: true });
        passedTrack.addEventListener('touchmove', handleTouchMove, { passive: false });
        passedTrack.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    
    // Touch event listeners are attached to passedTrack above.

    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
            
            function handleTouchStart(e) {
                if (e.type === 'touchstart') {
                    touchStartX = e.touches[0].clientX;
                } else {
                    touchStartX = e.clientX;
                    e.preventDefault();
                }
                startPos = touchStartX;
                isDragging = true;
                passedTrack.style.cursor = 'grabbing';
                passedTrack.style.transition = 'none';
            }
            
            function handleTouchMove(e) {
                if (!isDragging) return;
                
                if (e.type === 'touchmove') {
                    touchEndX = e.touches[0].clientX;
                } else {
                    if (!e.buttons) {
                        handleTouchEnd();
                        return;
                    }
                    touchEndX = e.clientX;
                }
                
                const diff = touchEndX - touchStartX;
                touchStartX = touchEndX;
                
                // Prevent page scrolling when dragging
                if (Math.abs(diff) > 5) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Move the carousel
                    currentTranslate = prevTranslate + diff;
                    passedTrack.style.transform = `translateX(${currentTranslate}px)`;
                }
            }
            
            function handleTouchEnd() {
                if (!isDragging) return;
                
                isDragging = false;
                passedTrack.style.cursor = 'grab';
                passedTrack.style.transition = 'transform 0.3s ease-out';
                
                const swipeThreshold = 50; // Minimum distance to trigger slide change
                const diff = touchEndX - startPos;
                
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        // Swipe right - go to previous slide
                        plusSlides(-1);
                    } else {
                        // Swipe left - go to next slide
                        plusSlides(1);
                    }
                } else {
                    // Return to original position
                    passedTrack.style.transform = 'translateX(0)';
                }
                
                // Reset transform after animation completes
                setTimeout(() => {
                    passedTrack.style.transition = '';
                    passedTrack.style.transform = '';
                    prevTranslate = 0;
                }, 300);
            }
    // All touch handlers are now defined within setupCarousel and use passedTrack.
    // The following logic for auto-advance, resize, and initial display is also part of setupCarousel.
    
    // Pause auto-advance on hover
    const carousel = document.querySelector('.carousel-container');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoAdvance);
        carousel.addEventListener('mouseleave', startAutoAdvance);
    }
    
    // Start auto-advancing
    startAutoAdvance();
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            handleCarouselDisplay();
            showSlides(slideIndex);
        }, 250);
    });
    
    // Initialize display
    handleCarouselDisplay();
    showSlides(slideIndex);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousel elements
    carouselTrack = document.querySelector('.carousel-track');
    slides = document.querySelectorAll('.carousel-slide');
    dots = document.querySelectorAll('.dot');
    console.log('Carousel track (DOMContentLoaded):', carouselTrack);
    console.log('Carousel slides (DOMContentLoaded):', slides.length > 0 ? slides : 'No slides found');
    console.log('Carousel dots (DOMContentLoaded):', dots.length > 0 ? dots : 'No dots found');

    // Initialize carousel functionality if elements exist
    if (carouselTrack && slides.length > 0) {
        setupCarousel(carouselTrack, slides);
    } else {
        console.error('Carousel track or slides not found. Carousel setup aborted.');
    }
    // showSlides(slideIndex); // This might be redundant if initCarousel or setupCarousel handles initial display
    
    // Initialize header morphing
    initHeaderMorphing();
    
    // Pulse effect for buttons
    const buttons = document.querySelectorAll('.red-button, .blue-button, .mint-button');
    const redButton = document.querySelector('.red-button');
    const blueButton = document.querySelector('.blue-button');
    
    if (redButton && blueButton) {
        // Add pulse effect to buttons
        function pulseButtons() {
            setTimeout(() => {
                redButton.classList.add('pulse');
                setTimeout(() => {
                    redButton.classList.remove('pulse');
                    blueButton.classList.add('pulse');
                    setTimeout(() => {
                        blueButton.classList.remove('pulse');
                        pulseButtons();
                    }, 2000);
                }, 2000);
            }, 1000);
        }
        
        // Start the pulse animation
        pulseButtons();
    }
    
    // Smooth scrolling for navigation tabs
    document.querySelectorAll('.nav-tab').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const headerHeight = document.querySelector('header').offsetHeight;
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - headerHeight + 2,
                    behavior: 'smooth'
                });
                
                // Update active tab
                document.querySelectorAll('.nav-tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // Update active tab on scroll
    window.addEventListener('scroll', function() {
        let currentSection = '';
        const sections = document.querySelectorAll('section[id]');
        const headerHeight = document.querySelector('header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentSection = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('href') === `#${currentSection}`) {
                tab.classList.add('active');
            }
        });
    });
    
    // Tracking clicks (could be expanded for analytics)
    document.querySelectorAll('.team-buttons a').forEach(button => {
        button.addEventListener('click', function(e) {
            const team = this.classList.contains('red-button') ? 'Red Team' : 'Blue Team';
            console.log(`User clicked to join ${team}`);
            // Here you could add analytics tracking code
        });
    });
    
    // Initialize the carousel
    showSlides(slideIndex);
    
    // Check screen size on load and resize
    handleCarouselDisplay();
    window.addEventListener('resize', handleCarouselDisplay);
    
    // Add touch event listeners for swipe functionality
    setupSwipeListeners();
});

// Leaderboard functionality
document.addEventListener('DOMContentLoaded', function() {
  // Only initialize the leaderboard if we're on the right page
  if (document.getElementById('leaderboard')) {
    initLeaderboard();
  }
});

// Initialize leaderboard
function initLeaderboard() {
  // Initial load
  updateLeaderboard();
  
  // Update every 5 minutes
  setInterval(updateLeaderboard, 300000);
}

// Fetch leaderboard data from Airtable
async function updateLeaderboard() {
  try {
    // Use the deployed Netlify function URL
    const apiUrl = 'https://textrp-leaderboard-api.netlify.app/.netlify/functions/leaderboard';
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors'
    });
    
    // If API endpoint isn't set up, use mock data for preview
    if (!response.ok) {
      console.warn('Leaderboard API not available, using mock data');
      updateLeaderboardUI({
        redTeamCount: Math.floor(Math.random() * 50) + 10,
        blueTeamCount: Math.floor(Math.random() * 50) + 10,
        lastUpdated: new Date().toLocaleString()
      });
      return;
    }
    
    const data = await response.json();
    console.log('API Response:', data); // Log the response for debugging
    
    // Map the API response to the expected format
    const formattedData = {
      redTeamCount: data.redTeamCount || data.red_team_count || 0,
      blueTeamCount: data.blueTeamCount || data.blue_team_count || 0,
      lastUpdated: data.lastUpdated || new Date().toLocaleString()
    };
    
    updateLeaderboardUI(formattedData);
    
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    // Use mock data as fallback
    updateLeaderboardUI({
      redTeamCount: Math.floor(Math.random() * 50) + 10,
      blueTeamCount: Math.floor(Math.random() * 50) + 10,
      lastUpdated: new Date().toLocaleString()
    });
  }
}

// Update the UI with leaderboard data
function updateLeaderboardUI(data) {
  // Update team counts
  document.getElementById('red-team-count').textContent = data.redTeamCount || 0;
  document.getElementById('blue-team-count').textContent = data.blueTeamCount || 0;
  
  // Update last updated time
  document.getElementById('last-updated').textContent = data.lastUpdated || new Date().toLocaleString();
  
  // Determine winner
  const redCount = data.redTeamCount || 0;
  const blueCount = data.blueTeamCount || 0;
  const winningTeam = document.getElementById('winning-team');
  
  if (redCount > blueCount) {
    winningTeam.textContent = 'RED TEAM LEADS!';
    winningTeam.className = 'winning-team red-leader';
  } else if (blueCount > redCount) {
    winningTeam.textContent = 'BLUE TEAM LEADS!';
    winningTeam.className = 'winning-team blue-leader';
  } else if (redCount === 0 && blueCount === 0) {
    winningTeam.textContent = 'CHALLENGE STARTS MAY 18';
    winningTeam.className = 'winning-team';
  } else {
    winningTeam.textContent = 'TEAMS ARE TIED!';
    winningTeam.className = 'winning-team tie';
  }
}
