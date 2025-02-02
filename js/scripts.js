setInterval(() => {
    if (currentIndex < images.length - 1) {
        currentIndex++;
    } else {
        currentIndex = 0; // Loop back to the first image
    }
    updateGalleryPosition();
}, 0);  // Move images every 1 second
// Handle login form submission
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting the traditional way

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check if username and password match your conditions (basic validation)
    if (username && password) {
        // Redirect to dashboard or another page
        window.location.href = 'dashboard.html';
    } else {
        alert('Please fill in both fields.');
    }
});