// Carousel functionality variables
let slideIndex = 1;
let touchStartX = 0;
let touchEndX = 0;
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;

// Get DOM elements
const carouselTrack = document.querySelector('.carousel-track');
const slides = document.getElementsByClassName('carousel-slide');
const dots = document.getElementsByClassName('dot');

// Next/previous controls for carousel
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls for carousel
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    if (!slides.length) return; // Exit if no slides exist
    
    // Update slide index
    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }
    
    // Update active dot
    Array.from(dots).forEach((dot, index) => {
        dot.classList.toggle('active', index === slideIndex - 1);
    });
    
    // Scroll the active slide into view with smooth behavior
    const activeSlide = slides[slideIndex - 1];
    if (activeSlide && carouselTrack) {
        // Calculate scroll position
        const container = carouselTrack.parentElement;
        const containerRect = container.getBoundingClientRect();
        const slideRect = activeSlide.getBoundingClientRect();
        const scrollLeft = carouselTrack.scrollLeft;
        const targetScroll = scrollLeft + (slideRect.left - containerRect.left) - ((containerRect.width - slideRect.width) / 2);
        
        // Smooth scroll to the target position
        carouselTrack.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });
    }
}

// Touch event handlers
function handleTouchStart(e) {
    if (window.innerWidth > 768) return; // Only handle touch on mobile
    
    touchStartX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    startPos = touchStartX;
    isDragging = true;
    
    // Stop any animations
    cancelAnimationFrame(animationID);
    carouselTrack.style.transition = 'none';
}

function handleTouchMove(e) {
    if (!isDragging) return;
    
    const currentPosition = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    const diff = currentPosition - startPos;
    
    // Prevent page scroll when swiping
    if (Math.abs(diff) > 10) {
        e.preventDefault();
    }
    
    // Update position
    currentTranslate = prevTranslate + diff;
    carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
}

function handleTouchEnd() {
    if (!isDragging) return;
    
    isDragging = false;
    const movedBy = currentTranslate - prevTranslate;
    
    // Determine if we should change slides based on movement
    if (Math.abs(movedBy) > 50) {
        if (movedBy > 0 && slideIndex > 1) {
            // Swiped right
            slideIndex--;
        } else if (movedBy < 0 && slideIndex < slides.length) {
            // Swiped left
            slideIndex++;
        }
    }
    
    // Animate to the new position
    carouselTrack.style.transition = 'transform 0.3s ease-out';
    showSlides(slideIndex);
    
    // Reset values
    prevTranslate = currentTranslate;
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

// Initialize carousel event listeners
function setupCarousel() {
    if (!carouselTrack) return; // Exit if carousel doesn't exist
    
    // Ensure carousel track is horizontally scrollable
    carouselTrack.style.overflowX = 'auto';
    carouselTrack.style.display = 'flex';
    carouselTrack.style.flexDirection = 'row';
    carouselTrack.style.flexWrap = 'nowrap';
    
    // Touch events
    carouselTrack.addEventListener('touchstart', handleTouchStart, { passive: true });
    carouselTrack.addEventListener('touchmove', handleTouchMove, { passive: false });
    carouselTrack.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Mouse events for desktop testing
    carouselTrack.addEventListener('mousedown', handleTouchStart);
    document.addEventListener('mousemove', handleTouchMove);
    document.addEventListener('mouseup', handleTouchEnd);
    document.addEventListener('mouseleave', handleTouchEnd);
    
    // Click events for dots
    Array.from(dots).forEach((dot, index) => {
        dot.addEventListener('click', () => currentSlide(index + 1));
    });
    
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
    // Initialize carousel
    setupCarousel();
    showSlides(slideIndex);
    
    // Header scroll transformation
    const header = document.querySelector('header');
    const scrollThreshold = 50; // Pixels to scroll before transforming header
    
    // Function to check scroll position and update header (with better mobile handling)
    let isScrolling = false;
    function checkScrollPosition() {
        if (!isScrolling) {
            isScrolling = true;
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY || window.pageYOffset; // Cross-browser compatibility
                
                try {
                    if (scrollY > scrollThreshold) {
                        if (!header.classList.contains('scrolled')) {
                            header.classList.add('scrolled');
                            // Make sure logo container and elements are visible
                            const logoContainer = document.querySelector('.logo-container');
                            const logo = document.querySelector('.logo');
                            const title = header.querySelector('h1');
                            
                            if (logoContainer) logoContainer.style.display = 'flex';
                            if (logo) logo.style.display = 'block';
                            if (title) title.style.display = 'block';
                        }
                    } else {
                        if (header.classList.contains('scrolled')) {
                            header.classList.remove('scrolled');
                        }
                    }
                } catch (e) {
                    console.error('Error updating header:', e);
                }
                
                isScrolling = false;
            });
        }
    }
    
    // Initial check on page load
    checkScrollPosition();
    
    // Check on scroll with passive event for better performance
    window.addEventListener('scroll', checkScrollPosition, { passive: true });
    
    // Add animation to team buttons
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
