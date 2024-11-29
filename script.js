document.addEventListener('DOMContentLoaded', function() {
    const showLoginBtn = document.getElementById('showLoginBtn');
    const loginForm = document.getElementById('loginForm');
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    const successOkBtn = document.getElementById('successOkBtn');

    showLoginBtn.addEventListener('click', function() {
        loginModal.show();
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const loginAs = document.getElementById('loginAs').value;
        const loginId = document.getElementById('loginId').value;
        const password = document.getElementById('password').value;

        if (validateForm(loginAs, loginId, password)) {
            if ((loginAs === 'admin' && loginId === 'admin' && password === 'admin321') ||
                (loginAs === 'employee' && loginId === 'emp001' && password === 'emp@123')) {
                // Store login information in local storage
                localStorage.setItem('loginAs', loginAs);
                localStorage.setItem('loginId', loginId);

                // Hide login modal and show success modal
                loginModal.hide();
                successModal.show();
            } else {
                alert('Invalid credentials. Please try again.');
            }
        }
    });

    successOkBtn.addEventListener('click', function() {
        successModal.hide();
        const loginAs = localStorage.getItem('loginAs');
        if (loginAs === 'admin') {
            window.location.href = 'admin.html';
        } else if (loginAs === 'employee') {
            window.location.href = 'employee.html';
        }
    });

    function validateForm(loginAs, loginId, password) {
        if (loginAs === '') {
            alert('Please select a role');
            return false;
        }

        if (loginId.trim() === '') {
            alert('Please enter a login ID');
            return false;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return false;
        }

        return true;
    }
});

