// Function to listen for messages from parent window
window.addEventListener('message', function(event) {
  // Check if the message is a theme change event
  if (event.data && event.data.type === 'themeChange') {
    // Apply the theme to the resume animation
    if (event.data.theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
      document.body.style.backgroundColor = 'var(--dark-bg-color)';
      document.querySelector('.d-86-button-text').style.color = 'var(--dark-text-color)';
    } else {
      document.documentElement.classList.remove('dark-theme');
      document.body.style.backgroundColor = 'var(--bg-color)';
      document.querySelector('.d-86-button-text').style.color = 'var(--text-color)';
    }
  }

  // If we receive background color from parent
  if (event.data && event.data.type === 'setBackground') {
    document.body.style.backgroundColor = event.data.color;
    document.querySelector('.d-86-section-home').style.backgroundColor = event.data.color;
  }
});

// Check if we're in an iframe
function isInIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

// Initialize theme based on parent if in iframe
if (isInIframe()) {
  // Send message to parent requesting current theme
  window.parent.postMessage({ type: 'requestTheme' }, '*');
  // Send message to parent requesting background color
  window.parent.postMessage({ type: 'requestBackground' }, '*');
} 