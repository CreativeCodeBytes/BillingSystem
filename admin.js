document.addEventListener('DOMContentLoaded', function() {
    const addStocksLink = document.getElementById('addStocksLink');
    const seeAllProductsLink = document.getElementById('seeAllProductsLink');
    const mainContent = document.getElementById('mainContent');
    const addStocksForm = document.getElementById('addStocksForm');
    const allProductsTable = document.getElementById('allProductsTable');
    const stockForm = document.getElementById('stockForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const productTableBody = document.getElementById('productTableBody');
    const sidebar = document.getElementById('sidebar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const productSearch = document.getElementById('productSearch');
    const editProductForm = document.getElementById('editProductForm');
    const saveEditButton = document.getElementById('saveEditButton');

    // Check if user is logged in as admin
    const loginAs = localStorage.getItem('loginAs');
    const loginId = localStorage.getItem('loginId');

    if (loginAs !== 'admin' || loginId !== 'admin') {
        window.location.href = 'login.html';
    }

    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('loginAs');
        localStorage.removeItem('loginId');
        window.location.href = 'login.html#login';
    });

    addStocksLink.addEventListener('click', function(e) {
        e.preventDefault();
        mainContent.classList.add('d-none');
        allProductsTable.classList.add('d-none');
        addStocksForm.classList.remove('d-none');
        closeSidebarOnMobile();
    });

    seeAllProductsLink.addEventListener('click', function(e) {
        e.preventDefault();
        mainContent.classList.add('d-none');
        addStocksForm.classList.add('d-none');
        allProductsTable.classList.remove('d-none');
        displayAllProducts();
        closeSidebarOnMobile();
    });

    stockForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const productName = document.getElementById('productName').value;
        const productId = document.getElementById('productId').value;
        const productPrice = document.getElementById('productPrice').value;
        const quantity = document.getElementById('quantity').value;

        if (isProductIdExists(productId)) {
            alert('Error: Product ID already exists. Please use a unique Product ID.');
        } else {
            saveProduct({ productName, productId, productPrice, quantity });
            stockForm.reset();
            alert('Stock added successfully!');
        }
    });

    function isProductIdExists(productId) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        return products.some(product => product.productId === productId);
    }

    function saveProduct(product) {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));
    }

    function displayAllProducts(searchTerm = '') {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        productTableBody.innerHTML = '';

        products.forEach((product, index) => {
            if (searchTerm && !product.productName.toLowerCase().includes(searchTerm.toLowerCase())) {
                return;
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.productName}</td>
                <td>${product.productId}</td>
                <td>${product.productPrice}</td>
                <td>${product.quantity}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-btn" data-index="${index}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">Delete</button>
                </td>
            `;
            productTableBody.appendChild(row);
        });

        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', editProduct);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteProduct);
        });
    }

    function editProduct(e) {
        const index = e.target.getAttribute('data-index');
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products[index];

        document.getElementById('editProductId').value = index;
        document.getElementById('editProductName').value = product.productName;
        document.getElementById('editProductPrice').value = product.productPrice;
        document.getElementById('editProductQuantity').value = product.quantity;

        const editProductModal = new bootstrap.Modal(document.getElementById('editProductModal'));
        editProductModal.show();
    }

    function deleteProduct(e) {
        if (confirm('Are you sure you want to delete this product?')) {
            const index = e.target.getAttribute('data-index');
            let products = JSON.parse(localStorage.getItem('products')) || [];
            products.splice(index, 1);
            localStorage.setItem('products', JSON.stringify(products));
            displayAllProducts();
        }
    }

    saveEditButton.addEventListener('click', function() {
        const index = document.getElementById('editProductId').value;
        const productName = document.getElementById('editProductName').value;
        const productPrice = document.getElementById('editProductPrice').value;
        const quantity = document.getElementById('editProductQuantity').value;

        let products = JSON.parse(localStorage.getItem('products')) || [];
        products[index] = { ...products[index], productName, productPrice, quantity };
        localStorage.setItem('products', JSON.stringify(products));

        const editProductModal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
        editProductModal.hide();

        displayAllProducts();
    });

    productSearch.addEventListener('input', function() {
        displayAllProducts(this.value);
    });

    // Handle sidebar toggle on mobile
    navbarToggler.addEventListener('click', function() {
        sidebar.classList.toggle('show');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnToggler = navbarToggler.contains(event.target);

        if (!isClickInsideSidebar && !isClickOnToggler && window.innerWidth < 768) {
            sidebar.classList.remove('show');
        }
    });

    // Close sidebar on mobile after clicking a link
    function closeSidebarOnMobile() {
        if (window.innerWidth < 768) {
            sidebar.classList.remove('show');
        }
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            sidebar.classList.remove('show');
        }
    });
});

