document.addEventListener('DOMContentLoaded', function() {
    const addStocksLink = document.getElementById('addStocksLink');
    const seeAllProductsLink = document.getElementById('seeAllProductsLink');
    const generateBillLink = document.getElementById('generateBillLink');
    const generateGSTBillLink = document.getElementById('generateGSTBillLink');
    const myBillsLink = document.getElementById('myBillsLink');
    const mainContent = document.getElementById('mainContent');
    const addStocksForm = document.getElementById('addStocksForm');
    const allProductsTable = document.getElementById('allProductsTable');
    const generateBillSection = document.getElementById('generateBillSection');
    const generateGSTBillSection = document.getElementById('generateGSTBillSection');
    const myBillsSection = document.getElementById('myBillsSection');
    const stockForm = document.getElementById('stockForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const productTableBody = document.getElementById('productTableBody');
    const sidebar = document.getElementById('sidebar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const productSearch = document.getElementById('productSearch');
    const editProductForm = document.getElementById('editProductForm');
    const saveEditButton = document.getElementById('saveEditButton');
    const billSearch = document.getElementById('billSearch');

    // Check if user is logged in as admin
    // const loginAs = localStorage.getItem('username');
    // const loginId = localStorage.getItem('password');

    //  if (username === 'admin' && password === 'admin123') {
    //      window.location.href = 'index.html';
    //  }

    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        window.location.href = 'index.html';
    });

    addStocksLink.addEventListener('click', function(e) {
        e.preventDefault();
        showSection(addStocksForm);
    });

    seeAllProductsLink.addEventListener('click', function(e) {
        e.preventDefault();
        showSection(allProductsTable);
        displayAllProducts();
    });

    generateBillLink.addEventListener('click', function(e) {
        e.preventDefault();
        showSection(generateBillSection);
    });

    generateGSTBillLink.addEventListener('click', function(e) {
        e.preventDefault();
        showSection(generateGSTBillSection);
    });

    myBillsLink.addEventListener('click', function(e) {
        e.preventDefault();
        showSection(myBillsSection);
        displayMyBills();
    });

    function showSection(section) {
        mainContent.classList.add('d-none');
        addStocksForm.classList.add('d-none');
        allProductsTable.classList.add('d-none');
        generateBillSection.classList.add('d-none');
        generateGSTBillSection.classList.add('d-none');
        myBillsSection.classList.add('d-none');
        calculatorSection.classList.add('d-none');
        section.classList.remove('d-none');
        closeSidebarOnMobile();
    }

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

    // Regular Bill functionality
    let billItems = [];
    let invoiceId = parseInt(localStorage.getItem('lastInvoiceId') || '0');

    const addItemBtn = document.getElementById('add-item-btn');
    const calculateTotalBtn = document.getElementById('calculate-total-btn');
    const generateInvoiceBtn = document.getElementById('generate-invoice-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');

    addItemBtn.addEventListener('click', addItem);
    calculateTotalBtn.addEventListener('click', calculateTotal);
    generateInvoiceBtn.addEventListener('click', generateInvoice);
    clearAllBtn.addEventListener('click', clearAll);

    function addItem() {
        const itemName = document.getElementById('item-name').value;
        const itemPrice = parseFloat(document.getElementById('item-price').value);
        const itemQuantity = parseInt(document.getElementById('item-quantity').value);

        if (itemName && !isNaN(itemPrice) && !isNaN(itemQuantity)) {
            billItems.push({ name: itemName, price: itemPrice, quantity: itemQuantity });
            updateItemList();
            clearInputFields();
        } else {
            alert('Please enter valid item details.');
        }
    }

    function updateItemList() {
        const itemList = document.getElementById('item-list');
        itemList.innerHTML = '';
        billItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                ${item.name} - Price: ₹${item.price.toFixed(2)} - Quantity: ${item.quantity}
                <button class="btn btn-danger btn-sm remove-item" data-index="${index}">Remove</button>
            `;
            itemList.appendChild(li);
        });

        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                removeItem(parseInt(this.getAttribute('data-index')));
            });
        });
    }

    function clearInputFields() {
        document.getElementById('item-name').value = '';
        document.getElementById('item-price').value = '';
        document.getElementById('item-quantity').value = '';
    }

    function removeItem(index) {
        billItems.splice(index, 1);
        updateItemList();
    }

    function calculateTotal() {
        const total = billItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        document.getElementById('total-price').textContent = `Total: ₹${total.toFixed(2)}`;
        return total;
    }

    function generateInvoice() {
        const total = calculateTotal();
        const date = new Date().toISOString().split('T')[0];
        invoiceId++;
        const invoice = {
            id: invoiceId.toString().padStart(4, '0'),
            date: date,
            items: billItems,
            total: total,
            type: 'regular'
        };

        // Save to My Bills
        const myBills = JSON.parse(localStorage.getItem('myBills')) || [];
        myBills.push(invoice);
        localStorage.setItem('myBills', JSON.stringify(myBills));
        localStorage.setItem('lastInvoiceId', invoiceId.toString());

        // Generate printable invoice
        const printInvoice = document.getElementById('printInvoice');
        printInvoice.innerHTML = `
            <div style="border: 4px solid #000; padding: 20px;">
                <div class="d-flex align-items-center mb-4">
                    <img src="Cybromatech-logo1.jpg?height=50&width=50" alt="Company Logo" class="me-3">
                    <h2 class="m-0">Cybromatech Technology PVT. LTD.</h2>
                </div>
                <p><b>Add:-</b> Marisoft Tower, Pune 411014 <br><b>Phone:-</b> +91 1234567890</p>
            </div>
            <div style="border: 2px solid #000; padding: 20px;">
                <div class="row mb-3">
                    <div class="col-6">
                        <strong>Invoice ID:</strong> ${invoice.id}
                    </div>
                    <div class="col-6 text-end">
                        <strong>Date:</strong> ${invoice.date}
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoice.items.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>₹${item.price.toFixed(2)}</td>
                                    <td>${item.quantity}</td>
                                    <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colspan="3" class="text-end">Total:</th>
                                <th>₹${invoice.total.toFixed(2)}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        `;

        // Show print modal
        const printInvoiceModal = new bootstrap.Modal(document.getElementById('printInvoiceModal'));
        printInvoiceModal.show();

        // Clear current bill
        clearAll();

        // Refresh My Bills section if it's currently visible
        if (!myBillsSection.classList.contains('d-none')) {
            displayMyBills();
        }

        alert("Invoice generated and saved to My Bills!");
    }

    function clearAll() {
        billItems = [];
        updateItemList();
        document.getElementById('total-price').textContent = '';
        document.getElementById('invoice-list').innerHTML = '';
    }

    // GST Bill functionality
    let gstBillItems = [];

    const addGSTItemBtn = document.getElementById('add-gst-item-btn');
    const calculateGSTTotalBtn = document.getElementById('calculate-gst-total-btn');
    const generateGSTInvoiceBtn = document.getElementById('generate-gst-invoice-btn');
    const clearGSTAllBtn = document.getElementById('clear-gst-all-btn');

    addGSTItemBtn.addEventListener('click', addGSTItem);
    calculateGSTTotalBtn.addEventListener('click', calculateGSTTotal);
    generateGSTInvoiceBtn.addEventListener('click', generateGSTInvoice);
    clearGSTAllBtn.addEventListener('click', clearGSTAll);

    function addGSTItem() {
        const itemName = document.getElementById('gst-item-name').value;
        const itemPrice = parseFloat(document.getElementById('gst-item-price').value);
        const itemQuantity = parseInt(document.getElementById('gst-item-quantity').value);

        if (itemName && !isNaN(itemPrice) && !isNaN(itemQuantity)) {
            gstBillItems.push({ name: itemName, price: itemPrice, quantity: itemQuantity });
            updateGSTItemList();
            clearGSTInputFields();
        } else {
            alert('Please enter valid item details.');
        }
    }

    function updateGSTItemList() {
        const itemList = document.getElementById('gst-item-list');
        itemList.innerHTML = '';
        gstBillItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                ${item.name} - Price: ₹${item.price.toFixed(2)} - Quantity: ${item.quantity}
                <button class="btn btn-danger btn-sm remove-gst-item" data-index="${index}">Remove</button>
            `;
            itemList.appendChild(li);
        });

        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-gst-item').forEach(btn => {
            btn.addEventListener('click', function() {
                removeGSTItem(parseInt(this.getAttribute('data-index')));
            });
        });
    }

    function clearGSTInputFields() {
        document.getElementById('gst-item-name').value = '';
        document.getElementById('gst-item-price').value = '';
        document.getElementById('gst-item-quantity').value = '';
    }

    function removeGSTItem(index) {
        gstBillItems.splice(index, 1);
        updateGSTItemList();
    }

    function calculateGSTTotal() {
        const subtotal = gstBillItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const gst = subtotal * 0.18; // 18% GST
        const total = subtotal + gst;
        document.getElementById('gst-total-price').textContent = `Subtotal: ₹${subtotal.toFixed(2)}, GST (18%): ₹${gst.toFixed(2)}, Total: ₹${total.toFixed(2)}`;
        return { subtotal, gst, total };
    }

    function generateGSTInvoice() {
        const { subtotal, gst, total } = calculateGSTTotal();
        const date = new Date().toISOString().split('T')[0];
        invoiceId++;
        const invoice = {
            id: invoiceId.toString().padStart(4, '0'),
            date: date,
            items: gstBillItems,
            subtotal: subtotal,
            gst: gst,
            total: total,
            type: 'gst'
        };

        // Save to My Bills
        const myBills = JSON.parse(localStorage.getItem('myBills')) || [];
        myBills.push(invoice);
        localStorage.setItem('myBills', JSON.stringify(myBills));
        localStorage.setItem('lastInvoiceId', invoiceId.toString());

        // Generate printable invoice
        const printInvoice = document.getElementById('printInvoice');
        printInvoice.innerHTML = `
            <div style="border: 4px solid #000; padding: 20px;">
                <div class="d-flex align-items-center mb-4">
                    <img src="Cybromatech-logo1.jpg?height=50&width=50" alt="Company Logo" class="me-3">
                    <h2 class="m-0">Cybromatech Technology PVT. LTD.</h2>
                </div>
                <p><b>Add:-</b> Marisoft Tower, Pune 411014 <br><b>Phone:-</b> +91 1234567890</p>
            </div>
            <div style="border: 2px solid #000; padding: 20px;">
                <div class="row mb-3">
                    <div class="col-6">
                        <strong>GST Invoice ID:</strong> ${invoice.id}
                    </div>
                    <div class="col-6 text-end">
                        <strong>Date:</strong> ${invoice.date}
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoice.items.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>₹${item.price.toFixed(2)}</td>
                                    <td>${item.quantity}</td>
                                    <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colspan="3" class="text-end">Subtotal:</th>
                                <th>₹${invoice.subtotal.toFixed(2)}</th>
                            </tr>
                            <tr>
                                <th colspan="3" class="text-end">GST (18%):</th>
                                <th>₹${invoice.gst.toFixed(2)}</th>
                            </tr>
                            <tr>
                                <th colspan="3" class="text-end">Total:</th>
                                <th>₹${invoice.total.toFixed(2)}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        `;

        // Show print modal
        const printInvoiceModal = new bootstrap.Modal(document.getElementById('printInvoiceModal'));
        printInvoiceModal.show();

        // Clear current bill
        clearGSTAll();

        // Refresh My Bills section if it's currently visible
        if (!myBillsSection.classList.contains('d-none')) {
            displayMyBills();
        }

        alert("GST Invoice generated and saved to My Bills!");
    }

    function clearGSTAll() {
        gstBillItems = [];
        updateGSTItemList();
        document.getElementById('gst-total-price').textContent = '';
        document.getElementById('gst-invoice-list').innerHTML = '';
    }

    function displayMyBills(searchTerm = '') {
        const billsList = document.getElementById('billsList');
        billsList.innerHTML = '';
        const myBills = JSON.parse(localStorage.getItem('myBills')) || [];

        myBills.forEach((bill, index) => {
            if (searchTerm && !bill.id.toString().includes(searchTerm) && !bill.date.includes(searchTerm)) {
                return;
            }

            const billItem = document.createElement('div');
            billItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            billItem.innerHTML = `
                <div>
                    <h5 class="mb-1">${bill.type === 'gst' ? 'GST Invoice' : 'Invoice'} #${bill.id}</h5>
                    <p class="mb-1">Date: ${bill.date}</p>
                    <small>Total: ₹${bill.total.toFixed(2)}</small>
                </div>
                <div>
                    <button class="btn btn-sm btn-primary view-bill-btn" data-index="${index}">View</button>
                    <button class="btn btn-sm btn-secondary print-bill-btn" data-index="${index}">Print</button>
                    <button class="btn btn-sm btn-warning edit-bill-btn" data-index="${index}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-bill-btn" data-index="${index}">Delete</button>
                </div>
            `;
            billsList.appendChild(billItem);
        });

        // Add event listeners for view, print, edit, and delete buttons
        document.querySelectorAll('.view-bill-btn, .print-bill-btn, .edit-bill-btn, .delete-bill-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const action = this.classList.contains('view-bill-btn') ? viewBill :
                               this.classList.contains('print-bill-btn') ? printBill :
                               this.classList.contains('edit-bill-btn') ? editBill :
                               deleteBill;
                action(index);
            });
        });
    }

    function viewBill(index) {
        const bills = JSON.parse(localStorage.getItem('myBills')) || [];
        const bill = bills[index];

        const printInvoice = document.getElementById('printInvoice');
        printInvoice.innerHTML = `
            <div style="border: 4px solid #000; padding: 20px;">
                <div class="d-flex align-items-center mb-4">
                    <img src="Cybromatech-logo1.jpg?height=50&width=50" alt="Company Logo" class="me-3">
                    <h2 class="m-0">Cybromatech Technology PVT. LTD.</h2>
                </div>
                <p><b>Add:-</b> Marisoft Tower, Pune 411014 <br><b>Phone:-</b> +91 1234567890</p>
            </div>
            <div style="border: 2px solid #000; padding: 20px;">
                <div class="row mb-3">
                    <div class="col-6">
                        <strong>${bill.type === 'gst' ? 'GST Invoice' : 'Invoice'} ID:</strong> ${bill.id}
                    </div>
                    <div class="col-6 text-end">
                        <strong>Date:</strong> ${bill.date}
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${bill.items.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>₹${item.price.toFixed(2)}</td>
                                    <td>${item.quantity}</td>
                                    <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            ${bill.type === 'gst' ? `
                                <tr>
                                    <th colspan="3" class="text-end">Subtotal:</th>
                                    <th>₹${bill.subtotal.toFixed(2)}</th>
                                </tr>
                                <tr>
                                    <th colspan="3" class="text-end">GST (18%):</th>
                                    <th>₹${bill.gst.toFixed(2)}</th>
                                </tr>
                            ` : ''}
                            <tr>
                                <th colspan="3" class="text-end">Total:</th>
                                <th>₹${bill.total.toFixed(2)}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        `;

        const printInvoiceModal = new bootstrap.Modal(document.getElementById('printInvoiceModal'));
        printInvoiceModal.show();
    }

    function printBill(index) {
        viewBill(index);
        setTimeout(() => {
            window.print();
        }, 500);
    }

    function editBill(index) {
        const bills = JSON.parse(localStorage.getItem('myBills')) || [];
        const bill = bills[index];

        if (bill.type === 'gst') {
            gstBillItems = bill.items;
            updateGSTItemList();
            calculateGSTTotal();
            showSection(generateGSTBillSection);
        } else {
            billItems = bill.items;
            updateItemList();
            calculateTotal();
            showSection(generateBillSection);
        }
    }

    function deleteBill(index) {
        if (confirm('Are you sure you want to delete this bill?')) {
            let bills = JSON.parse(localStorage.getItem('myBills')) || [];
            bills.splice(index, 1);
            localStorage.setItem('myBills', JSON.stringify(bills));
            displayMyBills();
        }
    }

    billSearch.addEventListener('input', function() {
        displayMyBills(this.value);
    });

    // Calculator functionality
    const calculatorLink = document.getElementById('calculatorLink');
    const calculatorSection = document.getElementById('calculatorSection');

    calculatorLink.addEventListener('click', function(e) {
        e.preventDefault();
        showSection(calculatorSection);
    });

    function calculate() {
        const display = document.getElementById('calc-display');
        const buttons = document.querySelectorAll('#calculator button');

        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const value = this.textContent;
                handleCalculatorInput(value);
            });
        });

        // Add keyboard support
        document.addEventListener('keydown', function(event) {
            const key = event.key;
            if (calculatorSection.classList.contains('d-none')) return;
            
            if (/[0-9+\-*/.=]|Backspace|Enter/.test(key)) {
                event.preventDefault();
                handleCalculatorInput(key);
            }
        });
    }

    function handleCalculatorInput(value) {
        const display = document.getElementById('calc-display');
        
        if (value === 'C' || value === 'Backspace') {
            display.value = display.value.slice(0, -1);
        } else if (value === '=' || value === 'Enter') {
            try {
                display.value = eval(display.value);
            } catch (error) {
                display.value = 'Error';
            }
        } else {
            display.value += value;
        }
    }

    calculate();

    // Initial setup
    showSection(mainContent);
});

