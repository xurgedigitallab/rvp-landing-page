// Simple and direct team selection functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log('Team selection script loaded and running!');

  // More robust cookie function with no dependencies
  function setTeamCookie(teamName, showAlert = true) {
    try {
      // Set a very explicit expiration date
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1); // 1 year expiration
      
      // Set cookie with multiple methods for maximum compatibility
      const cookieString = `selectedTeam=${teamName}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
      document.cookie = cookieString;
      
      // Double-check if cookie was set
      setTimeout(() => {
        if (document.cookie.indexOf(`selectedTeam=${teamName}`) === -1) {
          console.error('Failed to set team cookie using primary method, trying backup...');
          // Try alternative approach
          localStorage.setItem('selectedTeam', teamName);
        }
      }, 100);
      
      console.log(`Cookie set for team: ${teamName}, showAlert: ${showAlert}`);
    } catch (e) {
      console.error('Error setting cookie:', e);
      // Fallback to localStorage
      localStorage.setItem('selectedTeam', teamName);
    }
  }

  // More robust get cookie function with localStorage fallback
  function getTeamCookie() {
    // Try to get from cookies first
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith('selectedTeam=')) {
        const value = cookie.substring('selectedTeam='.length);
        console.log('Found team cookie with value:', value);
        return value;
      }
    }
    
    // If not found in cookies, try localStorage
    try {
      const localValue = localStorage.getItem('selectedTeam');
      if (localValue) {
        console.log('Found team selection in localStorage:', localValue);
        // Also set it as a cookie for next time, but don't show the alert
        setTeamCookie(localValue, false);
        return localValue;
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
    }
    
    console.log('No team selection found in cookies or localStorage');
    return null;
  }

  // Find the team buttons
  const redButton = document.querySelector('.red-button');
  const blueButton = document.querySelector('.blue-button');

  if (!redButton || !blueButton) {
    console.error('Team buttons not found - cannot apply team selection logic');
    return;
  }

  console.log('Team buttons found:', redButton, blueButton);

  // Store original URLs
  const redTeamUrl = redButton.getAttribute('href');
  const blueTeamUrl = blueButton.getAttribute('href');

  // Force proper CSS by adding inline styles
  document.head.insertAdjacentHTML('beforeend', `
    <style>
      .team-buttons a.disabled {
        opacity: 0.5 !important;
        cursor: not-allowed !important;
        pointer-events: none !important;
        position: relative !important;
      }
      
      /* Remove the ::after pseudo-element that was adding checkmarks */
      /* We'll use our JavaScript markers instead */
      
      .team-buttons a.selected {
        transform: scale(1.05) !important;
        box-shadow: 0 0 15px rgba(255, 255, 255, 0.7) !important;
        position: relative !important;
      }
    </style>
  `);

  // Check for existing team selection
  const selectedTeam = getTeamCookie();
  console.log('Current team selection from cookie:', selectedTeam);

  if (selectedTeam === 'red') {
    console.log('Applying RED team selection...');
    
    // Change button text to show current team
    redButton.innerText = 'Vegas Red Team';
    
    // Add selected class to red button and disabled class to blue
    redButton.classList.add('selected');
    blueButton.classList.add('disabled');
    
    // Set opacity and other styles directly
    blueButton.style.opacity = '0.5';
    blueButton.style.cursor = 'not-allowed';
    blueButton.style.pointerEvents = 'none';
    
    // Remove the target attribute and change href
    blueButton.removeAttribute('target');
    blueButton.href = 'javascript:void(0);';
    
    // Add click handler for disabled button
    blueButton.onclick = function(e) {
      e.preventDefault();
      alert('You have already joined the Red Team!');
      return false;
    };
  } 
  else if (selectedTeam === 'blue') {
    console.log('Applying BLUE team selection...');
    
    // Change button text to show current team
    blueButton.innerText = 'Vegas Blue Team';
    
    // Add selected class to blue button and disabled class to red
    blueButton.classList.add('selected');
    redButton.classList.add('disabled');
    
    // Set opacity and other styles directly
    redButton.style.opacity = '0.5';
    redButton.style.cursor = 'not-allowed';
    redButton.style.pointerEvents = 'none';
    
    // Remove the target attribute and change href
    redButton.removeAttribute('target');
    redButton.href = 'javascript:void(0);';
    
    // Add click handler for disabled button
    redButton.onclick = function(e) { 
      e.preventDefault(); 
      alert('You have already joined the Blue Team!');
      return false;
    };
  } 
  else {
    // No team selected yet - add click handlers
    console.log('No team selected - adding click handlers');
    
    redButton.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Red team clicked');
      
      // Show confirmation dialog
      const confirmJoin = confirm("Are you sure you want to join the Red Team? Once you join, you won't be able to join the Blue Team.");
      
      if (confirmJoin) {
        // Set cookie to remember selection
        setTeamCookie('red', false); // Don't show alert from cookie function
        
        // Open the team link in a new tab
        window.open(redTeamUrl, '_blank');
        
        // Change button text to indicate current team
        redButton.innerText = 'Vegas Red Team';
        
        // Force page reload after a brief delay to apply the styles
        setTimeout(function() {
          window.location.reload();
        }, 300);
      }
      
      return false;
    });
    
    blueButton.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Blue team clicked');
      
      // Show confirmation dialog
      const confirmJoin = confirm("Are you sure you want to join the Blue Team? Once you join, you won't be able to join the Red Team.");
      
      if (confirmJoin) {
        // Set cookie to remember selection
        setTeamCookie('blue', false); // Don't show alert from cookie function
        
        // Open the team link in a new tab
        window.open(blueTeamUrl, '_blank');
        
        // Change button text to indicate current team
        blueButton.innerText = 'Vegas Blue Team';
        
        // Force page reload after a brief delay to apply the styles
        setTimeout(function() {
          window.location.reload();
        }, 300);
      }
      
      return false;
    });
  }
  
  // Team selection state is handled by the main logic above
  console.log('Team selection initialized:', { selectedTeam });
});
