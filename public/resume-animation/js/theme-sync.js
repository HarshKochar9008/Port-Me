window.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'themeChange') {
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

  if (event.data && event.data.type === 'setBackground') {
    document.body.style.backgroundColor = event.data.color;
    document.querySelector('.d-86-section-home').style.backgroundColor = event.data.color;
  }
});


function isInIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

if (isInIframe()) {
  window.parent.postMessage({ type: 'requestTheme' }, '*');
  window.parent.postMessage({ type: 'requestBackground' }, '*');
} 