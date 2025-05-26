// Challenge dates (in Pacific Time)
const CHALLENGE_START_DATE = new Date('2025-05-30T08:00:00-07:00');
const CHALLENGE_END_DATE = new Date('2025-06-01T00:00:00-07:00');

// Check challenge status
function getChallengeStatus() {
    const now = new Date();
    if (now < CHALLENGE_START_DATE) {
        return 'not_started';
    } else if (now >= CHALLENGE_START_DATE && now < CHALLENGE_END_DATE) {
        return 'in_progress';
    } else {
        return 'ended';
    }
}

// Format time remaining
function formatTimeRemaining(endDate) {
    const now = new Date();
    const diff = endDate - now;
    
    if (diff <= 0) {
        return '00:00:00';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Update UI based on challenge status
function updateChallengeStatus() {
    console.log('updateChallengeStatus called');
    const status = getChallengeStatus();
    const joinButtons = document.querySelectorAll('.team-option a');
    const leaderboard = document.getElementById('leaderboard');
    const teamSelection = document.getElementById('team-selection');
    
    console.log('Challenge status:', status);
    console.log('joinButtons found:', joinButtons.length);
    console.log('leaderboard found:', !!leaderboard);
    console.log('teamSelection found:', !!teamSelection);
    
    // Update join buttons
    joinButtons.forEach(button => {
        if (status === 'not_started') {
            button.style.opacity = '0.6';
            button.style.pointerEvents = 'none';
            button.setAttribute('title', 'Challenge starts May 30, 2025');
        } else if (status === 'in_progress') {
            button.style.opacity = '1';
            button.style.pointerEvents = 'auto';
            button.removeAttribute('title');
        } else {
            // Challenge ended
            button.style.opacity = '0.6';
            button.style.pointerEvents = 'none';
            button.setAttribute('title', 'Challenge has ended');
        }
    });
    
    // Update leaderboard visibility
    if (leaderboard) {
        leaderboard.style.display = status !== 'not_started' ? 'block' : 'none';
    }
    
    // Handle countdown display
    if (teamSelection) {
        let countdown = teamSelection.querySelector('.countdown');
        
        // Create countdown element if it doesn't exist
        if (!countdown && status !== 'ended') {
            countdown = document.createElement('div');
            countdown.className = 'countdown';
            countdown.style.textAlign = 'center';
            countdown.style.margin = '20px 0';
            countdown.style.fontWeight = 'bold';
            countdown.style.fontSize = '1.2em';
            
            // Insert at the top of the team selection section
            const firstChild = teamSelection.firstElementChild;
            if (firstChild) {
                teamSelection.insertBefore(countdown, firstChild);
            } else {
                teamSelection.appendChild(countdown);
            }
        }
        
        // Update countdown based on status
        if (status === 'not_started') {
            // Countdown to challenge start
            const updateCountdown = () => {
                const now = new Date();
                const diff = CHALLENGE_START_DATE - now;
                
                if (diff <= 0) {
                    countdown.textContent = 'Challenge has started!';
                    setTimeout(() => {
                        updateChallengeStatus(); // Refresh the page state
                    }, 3000);
                    return;
                }
                
                countdown.textContent = `Challenge starts in: ${formatTimeRemaining(CHALLENGE_START_DATE)}`;
                
                if (now < CHALLENGE_START_DATE) {
                    requestAnimationFrame(updateCountdown);
                }
            };
            updateCountdown();
            
        } else if (status === 'in_progress') {
            // Countdown to challenge end
            const updateCountdown = () => {
                const now = new Date();
                const diff = CHALLENGE_END_DATE - now;
                
                if (diff <= 0) {
                    countdown.textContent = 'Challenge has ended!';
                    setTimeout(() => {
                        updateChallengeStatus(); // Refresh the page state
                    }, 3000);
                    return;
                }
                
                countdown.textContent = `Time remaining: ${formatTimeRemaining(CHALLENGE_END_DATE)}`;
                
                if (now < CHALLENGE_END_DATE) {
                    requestAnimationFrame(updateCountdown);
                }
            };
            updateCountdown();
            
        } else {
            // Challenge ended - remove countdown if it exists
            if (countdown) {
                countdown.remove();
            }
        }
    }
}

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
        carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
    }
}

// Set up carousel
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

// Initialize carousel
function initCarousel() {
    // Initialize all slides with display: none except the first
    slides.forEach((slide, index) => {
        slide.style.display = index === 0 ? 'block' : 'none';
        slide.setAttribute('data-index', index + 1);
    });
}

// Show specific slide
function showSlides(n) {
    if (!slides.length || isTransitioning) return;
    plusSlides(n - slideIndex);
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

// Initialize example posts grid navigation
function initExamplePostsNavigation() {
  const grid = document.querySelector('.example-posts-grid');
  const prevButton = document.querySelector('.example-posts-nav.prev');
  const nextButton = document.querySelector('.example-posts-nav.next');
  
  if (!grid) return;
  
  // Variables for touch handling
  let touchStartX = 0;
  let touchEndX = 0;
  const threshold = 50; // Minimum distance to detect swipe
  
  // Touch event listeners for mobile
  grid.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  grid.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  // Mouse event listeners for desktop
  let isMouseDown = false;
  let mouseStartX = 0;
  
  grid.addEventListener('mousedown', function(e) {
    isMouseDown = true;
    mouseStartX = e.clientX;
  });
  
  document.addEventListener('mousemove', function(e) {
    if (isMouseDown) {
      touchEndX = e.clientX;
    }
  });
  
  document.addEventListener('mouseup', function(e) {
    if (isMouseDown) {
      isMouseDown = false;
      handleSwipe();
    }
  });
  
  // Click event listeners for navigation buttons
  if (prevButton) {
    prevButton.addEventListener('click', function() {
      scrollToPost('prev');
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', function() {
      scrollToPost('next');
    });
  }
  
  // Update navigation buttons on scroll
  grid.addEventListener('scroll', updateNavigationButtons);
  
  // Initial update of navigation buttons
  updateNavigationButtons();
  
  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) >= threshold) {
      if (swipeDistance > 0) {
        // Swiped right - go to previous post
        scrollToPost('prev');
      } else {
        // Swiped left - go to next post
        scrollToPost('next');
      }
    }
  }
  
  function scrollToPost(direction) {
    const posts = Array.from(grid.querySelectorAll('.example-post'));
    if (posts.length === 0) return;
    
    const containerWidth = grid.offsetWidth;
    const scrollPosition = grid.scrollLeft;
    let targetScroll = 0;
    
    if (direction === 'next') {
      // Find the first post that's not fully in view
      let found = false;
      posts.forEach(post => {
        const postRect = post.getBoundingClientRect();
        const gridRect = grid.getBoundingClientRect();
        
        if (!found && (postRect.right > gridRect.right + 5)) { // 5px threshold
          targetScroll = post.offsetLeft - 20; // 20px padding
          found = true;
        }
      });
      
      // If all posts are visible or we're at the end, scroll to the first post
      if (!found) {
        targetScroll = 0;
      }
    } else {
      // Find the last post that's not fully in view on the left
      let found = false;
      const reversedPosts = [...posts].reverse();
      
      reversedPosts.forEach(post => {
        const postRect = post.getBoundingClientRect();
        const gridRect = grid.getBoundingClientRect();
        
        if (!found && (postRect.left < gridRect.left - 5)) { // 5px threshold
          targetScroll = post.offsetLeft - 20; // 20px padding
          found = true;
        }
      });
      
      // If all posts are visible or we're at the start, scroll to the last post
      if (!found) {
        targetScroll = posts[posts.length - 1].offsetLeft - 20;
      }
    }
    
    // Smooth scroll to the target position
    grid.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
    
    // Update navigation buttons after a short delay
    setTimeout(updateNavigationButtons, 100);
  }
  
  function updateNavigationButtons() {
    if (!prevButton || !nextButton) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = grid;
    const isAtStart = scrollLeft < 10;
    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;
    
    // Toggle button visibility based on scroll position
    prevButton.style.display = isAtStart ? 'none' : 'flex';
    nextButton.style.display = isAtEnd ? 'none' : 'flex';
  }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded');
  
  try {
    // Initialize example posts navigation
    if (typeof initExamplePostsNavigation === 'function') {
      initExamplePostsNavigation();
    } else {
      console.warn('initExamplePostsNavigation function not found');
    }
    
    // Initialize challenge status
    if (typeof updateChallengeStatus === 'function') {
      updateChallengeStatus();
    } else {
      console.error('updateChallengeStatus function not found');
    }
    
    // Check challenge status every minute
    setInterval(function() {
      if (typeof updateChallengeStatus === 'function') {
        updateChallengeStatus();
      }
    }, 60000);
    
  } catch (error) {
    console.error('Error during initialization:', error);
  }
});

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

// Stop auto-advancing the carousel
function stopAutoAdvance() {
    if (autoAdvanceInterval) {
        clearInterval(autoAdvanceInterval);
        autoAdvanceInterval = null;
    }
}

// Touch event handlers
function handleTouchStart(e) {
    if (e.type === 'touchstart') {
        touchStartX = e.touches[0].clientX;
    } else {
        touchStartX = e.clientX;
        e.preventDefault();
    }
    startPos = touchStartX;
    isDragging = true;
    carouselTrack.style.cursor = 'grabbing';
    carouselTrack.style.transition = 'none';
}

function handleTouchMove(e) {
    if (!isDragging || isTransitioning) return;
    
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
        carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
    }
}

function handleTouchEnd() {
    if (!isDragging || isTransitioning) return;
    
    isDragging = false;
    carouselTrack.style.cursor = 'grab';
    carouselTrack.style.transition = 'transform 0.3s ease-out';
    
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
        carouselTrack.style.transform = 'translateX(0)';
    }
    
    // Reset transform after animation completes
    setTimeout(() => {
        carouselTrack.style.transition = '';
        carouselTrack.style.transform = '';
        prevTranslate = 0;
    }, 300);
}

// Leaderboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize the leaderboard if we're on the right page
    if (document.getElementById('leaderboard')) {
        initLeaderboard();
    }
});

// Initialize leaderboard
function initLeaderboard() {
    // Only initialize if leaderboard element exists
    if (document.getElementById('leaderboard')) {
        updateLeaderboard();
        // Update leaderboard every 30 seconds
        setInterval(updateLeaderboard, 30000);
    }
}

// Fetch leaderboard data from Airtable
async function updateLeaderboard() {
    try {
        const response = await fetch('https://textrp-leaderboard-api.netlify.app/.netlify/functions/leaderboard');
        
        if (!response.ok) {
            throw new Error('Failed to fetch leaderboard data');
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        // Map the API response to the expected format
        const formattedData = {
            redTeamCount: data.redTeamCount || data.red_team_count || 0,
            blueTeamCount: data.blueTeamCount || data.blue_team_count || 0,
            lastUpdated: data.lastUpdated || new Date().toLocaleString(),
            lastThreePosts: data.lastThreePosts || []
        };
        
        updateLeaderboardUI(formattedData);
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        // Use mock data as fallback
        updateLeaderboardUI({
            redTeamCount: Math.floor(Math.random() * 50) + 10,
            blueTeamCount: Math.floor(Math.random() * 50) + 10,
            lastUpdated: new Date().toLocaleString(),
            lastThreePosts: []
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
  
  // Update recent posts if available
  updateRecentPosts(data.lastThreePosts || []);
}

// Update the recent posts grid
function updateRecentPosts(posts) {
  const postsGrid = document.getElementById('recent-posts-grid');
  const prevButton = document.querySelector('.recent-posts-nav.prev');
  const nextButton = document.querySelector('.recent-posts-nav.next');
  
  if (!postsGrid) return;
  
  // Clear existing posts
  postsGrid.innerHTML = '';
  
  if (!posts || posts.length === 0) {
    postsGrid.innerHTML = '<p class="no-posts">No recent posts yet. Be the first to post with #RedTeam or #BlueTeam!</p>';
    return;
  }
  
  // Filter out empty posts and limit to 3
  const validPosts = posts.filter(post => post && post.trim() !== '').slice(0, 3);
  
  if (validPosts.length === 0) {
    postsGrid.innerHTML = '<p class="no-posts">No recent posts yet. Be the first to post with #RedTeam or #BlueTeam!</p>';
    return;
  }
  
  // Add Twitter widget script if not already loaded
  if (!window.twttr) {
    const twitterScript = document.createElement('script');
    twitterScript.id = 'twitter-wjs';
    twitterScript.src = 'https://platform.twitter.com/widgets.js';
    twitterScript.async = true;
    twitterScript.charset = 'utf-8';
    
    // When the script loads, render the tweets
    twitterScript.onload = function() {
      renderTweets(validPosts);
    };
    
    document.body.appendChild(twitterScript);
  } else {
    // If Twitter is already loaded, render the tweets
    renderTweets(validPosts);
  }
  
  function renderTweets(tweets) {
    // Clear the grid first
    postsGrid.innerHTML = '';
    
    // Add posts to the grid
    tweets.forEach((tweetHtml, index) => {
      const postElement = document.createElement('div');
      postElement.className = 'recent-post';
      postElement.setAttribute('data-index', index);
      postElement.innerHTML = tweetHtml;
      postsGrid.appendChild(postElement);
    });
    
    // Initialize Twitter widgets
    if (window.twttr && window.twttr.widgets) {
      // First, remove any existing Twitter script elements that might conflict
      const twitterScripts = document.querySelectorAll('script[src*="platform.twitter.com/widgets"]');
      twitterScripts.forEach((script, index) => {
        if (index > 0) { // Keep the first one
          script.remove();
        }
      });
      
      // Then load the widgets
      try {
        window.twttr.widgets.load();
      } catch (e) {
        console.error('Error loading Twitter widgets:', e);
      }
      
      // Try again after a short delay as a fallback
      setTimeout(() => {
        if (window.twttr && window.twttr.widgets) {
          try {
            window.twttr.widgets.load();
          } catch (e) {
            console.error('Error in delayed Twitter widgets load:', e);
          }
        }
      }, 1000);
    }
    
    // Initialize swiping functionality
    initSwipeNavigation();
    
    // Update navigation buttons state
    updateNavigationButtons();
  }
  
  function initSwipeNavigation() {
    let touchStartX = 0;
    let touchEndX = 0;
    const threshold = 50; // Minimum distance to detect swipe
    
    // Touch event listeners for mobile
    postsGrid.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    postsGrid.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    // Mouse event listeners for desktop
    let isMouseDown = false;
    let mouseStartX = 0;
    
    postsGrid.addEventListener('mousedown', function(e) {
      isMouseDown = true;
      mouseStartX = e.clientX;
    });
    
    document.addEventListener('mousemove', function(e) {
      if (isMouseDown) {
        touchEndX = e.clientX;
      }
    });
    
    document.addEventListener('mouseup', function(e) {
      if (isMouseDown) {
        isMouseDown = false;
        handleSwipe();
      }
    });
    
    // Click event listeners for navigation buttons
    if (prevButton) {
      prevButton.addEventListener('click', function() {
        scrollToPost('prev');
      });
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', function() {
        scrollToPost('next');
      });
    }
    
    function handleSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      
      if (Math.abs(swipeDistance) >= threshold) {
        if (swipeDistance > 0) {
          // Swiped right - go to previous post
          scrollToPost('prev');
        } else {
          // Swiped left - go to next post
          scrollToPost('next');
        }
      }
    }
  }
  
  function scrollToPost(direction) {
    const posts = Array.from(postsGrid.querySelectorAll('.recent-post'));
    if (posts.length === 0) return;
    
    const containerWidth = postsGrid.offsetWidth;
    const scrollPosition = postsGrid.scrollLeft;
    let targetScroll = 0;
    
    if (direction === 'next') {
      // Find the first post that's not fully in view
      let found = false;
      posts.forEach(post => {
        const postRect = post.getBoundingClientRect();
        const gridRect = postsGrid.getBoundingClientRect();
        
        if (!found && (postRect.right > gridRect.right + 5)) { // 5px threshold
          targetScroll = post.offsetLeft - 20; // 20px padding
          found = true;
        }
      });
      
      // If all posts are visible or we're at the end, scroll to the first post
      if (!found) {
        targetScroll = 0;
      }
    } else {
      // Find the last post that's not fully in view on the left
      let found = false;
      const reversedPosts = [...posts].reverse();
      
      reversedPosts.forEach(post => {
        const postRect = post.getBoundingClientRect();
        const gridRect = postsGrid.getBoundingClientRect();
        
        if (!found && (postRect.left < gridRect.left - 5)) { // 5px threshold
          targetScroll = post.offsetLeft - 20; // 20px padding
          found = true;
        }
      });
      
      // If all posts are visible or we're at the start, scroll to the last post
      if (!found) {
        targetScroll = posts[posts.length - 1].offsetLeft - 20;
      }
    }
    
    // Smooth scroll to the target position
    postsGrid.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
    
    // Update navigation buttons after a short delay
    setTimeout(updateNavigationButtons, 100);
  }
  
  function updateNavigationButtons() {
    if (!prevButton || !nextButton) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = postsGrid;
    const isAtStart = scrollLeft < 10;
    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;
    
    // Toggle button visibility based on scroll position
    prevButton.style.display = isAtStart ? 'none' : 'flex';
    nextButton.style.display = isAtEnd ? 'none' : 'flex';
  }
  
  // Update navigation buttons on scroll
  postsGrid.addEventListener('scroll', updateNavigationButtons);
}
