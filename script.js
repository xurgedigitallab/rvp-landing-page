// Carousel functionality variables
let slideIndex = 1;
let autoAdvanceInterval = null; // Variable to store the auto-advance interval

// Very simplified carousel implementation
// Move to next/previous slide
function plusSlides(n) {
    // Get current index first, then update
    const currentIndex = slideIndex;
    const slides = document.querySelectorAll('.carousel-slide');
    
    console.log('Current slide:', currentIndex, 'Direction:', n);
    
    // Calculate new index with looping
    let newIndex = currentIndex + n;
    
    // Handle boundary conditions
    if (newIndex > slides.length) {
        newIndex = 1; // Loop to first slide
    } else if (newIndex < 1) {
        newIndex = slides.length; // Loop to last slide
    }
    
    console.log('Moving to slide:', newIndex, 'of', slides.length);
    
    // Update global index and show slide
    slideIndex = newIndex;
    displayCurrentSlide();
}

// Show a specific slide by its index
function currentSlide(n) {
    slideIndex = n;
    displayCurrentSlide();
}

// Display the current slide using display:block/none approach
function displayCurrentSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    if (!slides.length) return;
    
    console.log('Showing slide', slideIndex, 'of', slides.length);
    
    // First hide all slides
    slides.forEach(slide => {
        slide.style.display = 'none';
    });
    
    // Then show only the active slide
    slides[slideIndex-1].style.display = 'block';
    
    // Update dots if they exist
    if (dots.length) {
        dots.forEach((dot, index) => {
            if (index === slideIndex - 1) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Reset auto-advance timer
    resetAutoAdvance();
}

// Thumbnail image controls for carousel
function currentSlide(n) {
    showSlides(n);
}

// Initialize carousel slides with simple display/hide approach
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevButton = document.querySelector('.carousel-arrow.prev');
    const nextButton = document.querySelector('.carousel-arrow.next');
    
    if (!slides.length) {
        console.error('No carousel slides found');
        return;
    }
    
    console.log('Initializing carousel with', slides.length, 'slides');
    
    // Set initial slide index
    slideIndex = 1;
    
    // Initialize all slides with display: none except the first
    slides.forEach((slide, index) => {
        slide.style.display = index === 0 ? 'block' : 'none';
        slide.setAttribute('data-index', index + 1);
    });
    
    // Add navigation button event listeners
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            console.log('Previous button clicked');
            plusSlides(-1);
        });
    } else {
        console.error('Previous button not found');
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            console.log('Next button clicked');
            plusSlides(1);
        });
    } else {
        console.error('Next button not found');
    }
    
    // Mobile specific: Handle touch events
    setupSimpleSwipeListeners();
    
    // Initialize dots
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === 0);
            dot.addEventListener('click', () => currentSlide(index + 1));
        });
    }
    
    // Get track reference
    const track = document.querySelector('.carousel-track');
    if (track) {
        // Set up scroll event listener for infinite loop detection
        track.addEventListener('scroll', handleInfiniteLoop);
    }
    
    // Center first slide within the track only (not page scrolling)
    setTimeout(() => {
        // Get updated track reference to ensure it exists
        const trackElement = document.querySelector('.carousel-track');
        if (slides[0] && trackElement) {
            // Calculate position to center first slide
            const slideWidth = slides[0].offsetWidth;
            const trackWidth = trackElement.offsetWidth;
            const scrollPosition = slides[0].offsetLeft - (trackWidth - slideWidth) / 2;
            
            // Only scroll the track, not the page
            trackElement.scrollLeft = scrollPosition;
        }
    }, 100); // End of setTimeout
    
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

// Handle infinite loop scrolling behavior
function handleInfiniteLoop() {
    const track = document.querySelector('.carousel-track');
    if (!track) return;
    
    const slides = document.querySelectorAll('.carousel-slide:not(.cloned)');
    if (slides.length === 0) return;
    
    // Get the slide width including margin
    const slideWidth = slides[0].offsetWidth;
    const margin = parseInt(window.getComputedStyle(slides[0]).marginRight, 10) || 0;
    const slideFullWidth = slideWidth + margin;
    
    // Get the current scroll position
    const scrollPos = track.scrollLeft;
    
    // Calculate total width
    const totalWidth = track.scrollWidth;
    const viewportWidth = track.offsetWidth;
    
    console.log(`Scroll position: ${scrollPos}, Total width: ${totalWidth}, Viewport: ${viewportWidth}`);
    
    // Check if we're at the beginning or end
    // When at the beginning (showing clone of last slide)
    if (scrollPos < slideFullWidth / 2) {
        console.log('At beginning, jump to end');
        // Jump to the real slides at the end
        track.style.scrollBehavior = 'auto';
        // Calculate position to show the last real slide
        const lastSlideIndex = slides.length - 1;
        const jumpToPos = lastSlideIndex * slideFullWidth;
        track.scrollLeft = jumpToPos;
        
        // Reset to smooth scrolling after the jump
        setTimeout(() => {
            track.style.scrollBehavior = 'smooth';
        }, 10);
    }
    // When at the end (showing clone of first slide)
    else if (scrollPos + viewportWidth >= totalWidth - slideFullWidth / 2) {
        console.log('At end, jump to beginning');
        // Jump to the real slides at the beginning
        track.style.scrollBehavior = 'auto';
        // Jump to first real slide
        track.scrollLeft = slideFullWidth; // The first slot has the cloned last slide
        
        // Reset to smooth scrolling after the jump
        setTimeout(() => {
            track.style.scrollBehavior = 'smooth';
        }, 10);
    }
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
        prevButton.addEventListener('click', function() {
            plusSlides(-1); // Previous slide
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            plusSlides(1);  // Next slide
        });
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
    
    // Direct attachment of event listeners
    const prevButton = document.querySelector('.carousel-arrow.prev');
    const nextButton = document.querySelector('.carousel-arrow.next');
    
    if (prevButton) {
        console.log('Found prev button, attaching listener');
        // Remove any existing listeners
        prevButton.replaceWith(prevButton.cloneNode(true));
        // Get the fresh element
        const freshPrevButton = document.querySelector('.carousel-arrow.prev');
        // Add the listener
        freshPrevButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Prev button clicked');
            plusSlides(-1);
        });
    }
    
    if (nextButton) {
        console.log('Found next button, attaching listener');
        // Remove any existing listeners
        nextButton.replaceWith(nextButton.cloneNode(true));
        // Get the fresh element
        const freshNextButton = document.querySelector('.carousel-arrow.next');
        // Add the listener
        freshNextButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Next button clicked');
            plusSlides(1);
        });
    }

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
    
    // Cookie utility functions - defined outside the DOMContentLoaded event
    function setCookie(name, value, days) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/';
    }
    
    function getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    // Initialize the carousel
    showSlides(slideIndex);
    
    // Check screen size on load and resize
    handleCarouselDisplay();
    window.addEventListener('resize', handleCarouselDisplay);
    
    // Add touch event listeners for swipe functionality
    setupSimpleSwipeListeners();
});

// Leaderboard functionality
document.addEventListener('DOMContentLoaded', function() {
  // Only initialize the leaderboard if we're on the right page
  if (document.getElementById('leaderboard')) {
    initLeaderboard();
  }
  
  // Team selection functionality
  function checkTeamSelection() {
    const selectedTeam = getCookie('selectedTeam');
    if (selectedTeam) {
      console.log(`User previously joined ${selectedTeam}`);
      
      // Disable the other team button
      const redButton = document.querySelector('.red-button');
      const blueButton = document.querySelector('.blue-button');
      
      if (!redButton || !blueButton) {
        console.error('Team buttons not found');
        return;
      }
      
      if (selectedTeam === 'red') {
        // User selected red team, disable blue button
        blueButton.classList.add('disabled');
        blueButton.setAttribute('aria-disabled', 'true');
        blueButton.addEventListener('click', function(e) {
          e.preventDefault();
          alert('You have already joined the Red Team!');
          return false;
        });
        
        // Add visual indicator to show active team
        redButton.classList.add('selected');
      } else if (selectedTeam === 'blue') {
        // User selected blue team, disable red button
        redButton.classList.add('disabled');
        redButton.setAttribute('aria-disabled', 'true');
        redButton.addEventListener('click', function(e) {
          e.preventDefault();
          alert('You have already joined the Blue Team!');
          return false;
        });
        
        // Add visual indicator to show active team
        blueButton.classList.add('selected');
      }
    }
  }
  
  // Add click tracking and cookie setting to team buttons
  const teamButtons = document.querySelectorAll('.team-buttons a');
  if (teamButtons.length > 0) {
    teamButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        // Don't set cookie if the button is disabled
        if (this.classList.contains('disabled')) {
          e.preventDefault();
          return false;
        }
        
        const isRedTeam = this.classList.contains('red-button');
        const team = isRedTeam ? 'Red Team' : 'Blue Team';
        const teamValue = isRedTeam ? 'red' : 'blue';
        
        // Set cookie for 1 year (365 days)
        setCookie('selectedTeam', teamValue, 365);
        console.log(`User clicked to join ${team}`);
      });
    });
    
    // Check for existing team selection when page loads
    checkTeamSelection();
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

// Simple swipe listeners for the transform-based carousel
function setupSimpleSwipeListeners() {
  const carousel = document.querySelector('.carousel-wrapper');
  if (!carousel) {
    console.error('Carousel wrapper not found');
    return;
  }
  
  let touchStartX = 0;
  let touchEndX = 0;
  const threshold = 50; // Minimum distance to detect swipe
  
  carousel.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  carousel.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    // Calculate swipe distance
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) >= threshold) {
      if (swipeDistance > 0) {
        // Swiped right - go to previous slide
        plusSlides(-1);
      } else {
        // Swiped left - go to next slide
        plusSlides(1);
      }
    }
  }
  
  console.log('Transform carousel swipe listeners initialized');
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
