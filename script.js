// Carousel functionality variables
let slideIndex = 1;
let touchStartX = 0;
let touchEndX = 0;

// Next/previous controls for carousel - defined in global scope
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls for carousel - defined in global scope
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let slides = document.getElementsByClassName("carousel-slide");
    if (!slides.length) return; // Exit if no slides exist
    
    let dots = document.getElementsByClassName("dot");
    
    // Loop back to first slide if at the end
    if (n > slides.length) {slideIndex = 1}
    
    // Go to last slide if at the beginning
    if (n < 1) {slideIndex = slides.length}
    
    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    // Remove active class from all dots
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    // Show the current slide and mark its dot as active
    if (window.innerWidth <= 768) {
        slides[slideIndex-1].style.display = "block";
        dots[slideIndex-1].className += " active";
    } else {
        // Show all slides on larger screens
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "block";
        }
    }
}

// Handle responsive display of carousel
function handleCarouselDisplay() {
    let slides = document.getElementsByClassName("carousel-slide");
    if (!slides.length) return; // Exit if no slides exist
    
    let navigation = document.querySelector('.carousel-navigation');
    if (!navigation) return; // Exit if navigation doesn't exist
    
    if (window.innerWidth <= 768) {
        // On mobile, show only the active slide
        showSlides(slideIndex);
        
        // Show navigation dots
        navigation.style.display = 'flex';
    } else {
        // On desktop, show all slides side by side
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "block";
        }
        
        // Hide navigation dots
        navigation.style.display = 'none';
    }
}

// Setup touch event listeners for swipe functionality
function setupSwipeListeners() {
    const carousel = document.querySelector('.carousel-track');
    if (!carousel) return; // Exit if carousel doesn't exist
    
    // Touch events for mobile
    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    // Mouse events for desktop (for testing)
    carousel.addEventListener('mousedown', function(e) {
        touchStartX = e.screenX;
    });
    
    carousel.addEventListener('mouseup', function(e) {
        touchEndX = e.screenX;
        handleSwipe();
    });
}

// Handle the swipe gesture
function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance required for a swipe
    
    if (touchEndX === 0) return; // Exit if no touch end recorded
    
    if (window.innerWidth <= 768) { // Only enable swipe on mobile
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - show next slide
            plusSlides(1);
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - show previous slide
            plusSlides(-1);
        }
    }
    
    // Reset values
    touchStartX = 0;
    touchEndX = 0;
}

document.addEventListener('DOMContentLoaded', function() {
    // Header scroll transformation
    const header = document.querySelector('header');
    const scrollThreshold = 50; // Pixels to scroll before transforming header
    
    // Function to check scroll position and update header
    function checkScrollPosition() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Initial check on page load
    checkScrollPosition();
    
    // Check on scroll
    window.addEventListener('scroll', checkScrollPosition);
    
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
