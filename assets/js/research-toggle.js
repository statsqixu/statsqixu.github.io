console.log('Research toggle script loaded');

function activateToggle() {
  console.log('Script running...');
  
  var yearBtn = document.getElementById('toggle-year');
  var topicBtn = document.getElementById('toggle-topic');
  var yearView = document.getElementById('year-view');
  var topicView = document.getElementById('topic-view');
  
  console.log('Elements:', {
    yearBtn: yearBtn,
    topicBtn: topicBtn,
    yearView: yearView,
    topicView: topicView
  });
  
  if (!yearBtn || !topicBtn || !yearView || !topicView) {
    console.log('Some elements not found - retrying in 500ms');
    setTimeout(activateToggle, 500);
    return;
  }

  console.log('All elements found, setting up event listeners');

  yearBtn.addEventListener('click', function() {
    console.log('Year button clicked');
    yearView.classList.add('active');
    topicView.classList.remove('active');
    yearBtn.classList.add('active');
    topicBtn.classList.remove('active');
  });
  
  topicBtn.addEventListener('click', function() {
    console.log('Topic button clicked');
    topicView.classList.add('active');
    yearView.classList.remove('active');  
    topicBtn.classList.add('active');
    yearBtn.classList.remove('active');
  });
  
  // Set default view
  yearView.classList.add('active');
  topicView.classList.remove('active');
  yearBtn.classList.add('active');
  topicBtn.classList.remove('active');
  
  console.log('Setup complete');
}

// Multiple ways to ensure the script runs
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', activateToggle);
} else {
  activateToggle();
}

window.addEventListener('load', activateToggle);
setTimeout(activateToggle, 100);
