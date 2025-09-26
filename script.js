document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const tabItems = document.querySelectorAll('.tab-item');
    const totalIncomeElement = document.getElementById('total-income');
    const totalExpenseElement = document.getElementById('total-expense');
    const balanceElement = document.getElementById('balance');
    const latestTransactionsList = document.getElementById('latest-transactions-list');
    const historyList = document.getElementById('history-list');
    const slipModal = new bootstrap.Modal(document.getElementById('slipModal'));
    const modalSlipImage = document.getElementById('modalSlipImage');

    const yearDropdownHeader = document.querySelector('.year-dropdown .year-header');
    const yearDropdownList = document.querySelector('.year-dropdown .year-list');
    const selectedYearText = document.getElementById('selected-year-text');

    // All transaction data
    let allPayments = [
        // เพิ่มสถานะ 'pending' สำหรับรายการที่ยังไม่เข้า/ออก
        { id: 19, date: '26/09/2568', amount: 40000, description: 'ยืมเงินอ้อน', type: 'expense', status: 'pending', year: 2568, slip: 'https://s.imgz.io/2025/09/26/image0745d3ad3d6373d2.png' },
        // รายการที่คุณต้องการให้แสดงยอดแต่ไม่นับรวม
        { id: 18, date: '19/09/2568', amount: 40000, description: 'คืนเงิน', type: 'income', year: 2568, slip: 'https://s.imgz.io/2025/09/19/imageff13c086e37918c1.png' },
        { id: 17, date: '24/08/2568', amount: 40000, description: 'ยืมเงินอ้อน', type: 'expense', year: 2568, slip: 'https://s.imgz.io/2025/09/10/S__1393463066cfcb1061b2e7a8.jpg' },        
        { id: 16, date: '15/08/2568', amount: 49000, description: 'คืนเงิน+ค่าดอก', type: 'income', year: 2568, slip: 'https://s.imgz.io/2025/09/10/S__13942786d943a0a4018c5ab6.jpg' },
        { id: 15, date: '08/08/2568', amount: 8000, description: 'ยืมเงินอ้อน', type: 'expense', year: 2568, slip: 'https://s.imgz.io/2025/09/10/S__1393462805db8619166aa00c.jpg' },
        { id: 14, date: '30/07/2568', amount: 40000, description: 'ยืมเงินอ้อน', type: 'expense', year: 2568, slip: 'https://s.imgz.io/2025/09/10/S__13934626184626bad6ada563.jpg' },
        { id: 13, date: '18/07/2568', amount: 400, description: 'ค่าดอก', type: 'income', year: 2568, slip: 'https://s.imgz.io/2025/09/10/S__13934617b79f78cd98161e32.jpg' },
        { id: 12, date: '18/07/2568', amount: 40500, description: 'คืนเงิน', type: 'income', year: 2568, slip: 'https://s.imgz.io/2025/09/10/S__1393461653a4c5a2ef3212a3.jpg' },
        { id: 11, date: '14/07/2568', amount: 15000, description: 'ยืมเงินอ้อน', type: 'expense', year: 2568, slip: 'https://s.imgz.io/2025/09/10/S__139346154531d6ce8ba9f5b4.jpg' },
        { id: 10, date: '09/07/2568', amount: 5500, description: 'ยืมเงินอ้อน', type: 'expense', year: 2568, slip: 'https://s.imgz.io/2025/09/10/S__139346143fb2d26f5b7519c0.jpg' },
        { id: 9, date: '01/07/2568', amount: 20000, description: 'ยืมเงินอ้อน', type: 'expense', year: 2568, slip: 'https://s.imgz.io/2025/09/10/S__13934612990c11b9cce8ac03.jpg' },
        { id: 8, date: '20/06/2568', amount: 20000, description: 'คืนเงิน', type: 'income', year: 2568, slip: 'https://s.imgz.io/2025/09/10/S__13934611bd949182f356b365.jpg' },
        { id: 7, date: '05/06/2568', amount: 5000, description: 'ยืมเงินอ้อน', type: 'expense', year: 2568, slip: 'https://s.imgz.io/2025/09/10/S__139346107ba6f0c91c56a115.jpg' },
        { id: 6, date: '02/06/2568', amount: 15000, description: 'ยืมเงินอ้อน', type: 'expense', year: 2568, slip: 'https://s.imgz.io/2025/09/10/S__13934608bfa1722310841d22.jpg' },
        { id: 5, date: '16/05/2568', amount: 20000, description: 'คืนเงิน', type: 'income', year: 2568, slip: 'https://s.imgz.io/2025/09/10/S__13934598baef9f4fc398b370.jpg' },
        { id: 4, date: '10/05/2568', amount: 5000, description: 'ยืมเงินอ้อน', type: 'expense', year: 2568, slip: 'https://s.imgz.io/2025/09/10/S__13934600b69ea7bac0ca6ee0.jpg' },
        { id: 3, date: '06/05/2568', amount: 15000, description: 'ยืมเงินอ้อน', type: 'expense', year: 2568, slip: 'https://s.imgz.io/2025/09/10/S__139346013a111418e6d0fe1a.jpg' },
        { id: 2, date: '18/04/2568', amount: 15000, description: 'คืนเงิน', type: 'income', year: 2568, slip: 'https://s.imgz.io/2025/09/10/S__1393459452f8963013255985.jpg' },
        { id: 1, date: '06/04/2568', amount: 15000, description: 'ยืมเงินอ้อน', type: 'expense', year: 2568, slip: 'https://s.imgz.io/2025/09/10/S__139345963eb5262066d4fc6a.jpg' },
    ];

    // Functions to render data
    const renderSummary = () => {
        // Exclude pending items from calculations
        const totalIncome = allPayments
            .filter(t => t.type === 'income' && t.status !== 'pending')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const totalExpense = allPayments
            .filter(t => t.type === 'expense' && t.status !== 'pending')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const balance = totalIncome - totalExpense;

        totalIncomeElement.textContent = `${totalIncome.toLocaleString()} บาท`;
        totalExpenseElement.textContent = `${totalExpense.toLocaleString()} บาท`;
        
        balanceElement.textContent = `${balance.toLocaleString()} บาท`;
        
        const balanceCard = document.querySelector('.balance-card');
        balanceCard.classList.remove('positive-balance', 'negative-balance');
        if (balance >= 0) {
            balanceCard.classList.add('positive-balance');
        } else {
            balanceCard.classList.add('negative-balance');
        }

        // Render latest transactions (up to 5 items) including pending
        latestTransactionsList.innerHTML = '';
        const latestItems = allPayments.slice().sort((a, b) => {
            const dateA = convertToAD(a.date);
            const dateB = convertToAD(b.date);
            return dateB - dateA;
        }).slice(0, 5);
        if (latestItems.length > 0) {
            latestItems.forEach(t => renderTransactionItem(t, latestTransactionsList));
        } else {
            latestTransactionsList.innerHTML = '<li class="list-group-item text-center text-muted">ไม่พบรายการล่าสุด</li>';
        }
    };

    // Helper function to convert Thai date format (DD/MM/YYYY) to a Date object
    const convertToAD = (dateString) => {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year - 543, month - 1, day);
    };

    // Renders history for a selected year
    const renderHistoryForYear = (year) => {
        historyList.innerHTML = '';
        selectedYearText.textContent = `ปี ${year}`;

        // Filter transactions for the selected year
        const transactionsForYear = allPayments.filter(t => t.year === year);
        
        if (transactionsForYear.length === 0) {
            historyList.innerHTML = '<p class="text-center text-muted mt-3">ไม่พบรายการในปีนี้</p>';
            return;
        }

        // Group transactions by month and sort months from newest to oldest
        const transactionsByMonth = transactionsForYear.slice().sort((a, b) => {
            const dateA = convertToAD(a.date);
            const dateB = convertToAD(b.date);
            return dateB - dateA;
        }).reduce((accMonth, t) => {
            const date = convertToAD(t.date);
            const month = date.toLocaleString('th-TH', { month: 'long' });
            const monthKey = `${t.year}-${month}`;
            if (!accMonth[monthKey]) {
                accMonth[monthKey] = [];
            }
            accMonth[monthKey].push(t);
            return accMonth;
        }, {});

        for (const monthKey in transactionsByMonth) {
            const monthGroup = document.createElement('div');
            monthGroup.className = 'month-group';
            monthGroup.innerHTML = `
                <div class="month-header fw-bold mb-2">
                    เดือน ${transactionsByMonth[monthKey][0].date ? convertToAD(transactionsByMonth[monthKey][0].date).toLocaleString('th-TH', { month: 'long' }) : ''}
                </div>
                <ul class="list-group list-group-flush mb-4"></ul>
            `;
            const monthListElement = monthGroup.querySelector('.list-group');
            // Sort transactions within each month from newest to oldest
            transactionsByMonth[monthKey].sort((a, b) => {
                const dateA = convertToAD(a.date);
                const dateB = convertToAD(b.date);
                return dateB - dateA;
            }).forEach(t => renderTransactionItem(t, monthListElement));
            historyList.appendChild(monthGroup);
        }
    };
    
    // Populates the year dropdown
    const populateYearDropdown = () => {
        const uniqueYears = [...new Set(allPayments.map(t => t.year))].sort((a, b) => b - a);
        yearDropdownList.innerHTML = '';
        uniqueYears.forEach(year => {
            const option = document.createElement('div');
            option.className = 'year-option rounded p-3';
            option.textContent = `ปี ${year}`;
            option.setAttribute('data-year', year);
            yearDropdownList.appendChild(option);
        });

        // Add click listener to each year option
        yearDropdownList.addEventListener('click', (e) => {
            const yearOption = e.target.closest('.year-option');
            if (yearOption) {
                const year = parseInt(yearOption.getAttribute('data-year'));
                renderHistoryForYear(year);
                yearDropdownList.classList.add('d-none');
                yearDropdownHeader.querySelector('.toggle-icon').classList.remove('fa-chevron-up');
                yearDropdownHeader.querySelector('.toggle-icon').classList.add('fa-chevron-down');
            }
        });
    };

    const renderTransactionItem = (transaction, parentElement) => {
        const li = document.createElement('li');
        let itemClass = transaction.type === 'income' ? 'income-item' : 'expense-item';
        let amountText = `${parseFloat(transaction.amount).toLocaleString()} บาท`;
        let sign = transaction.type === 'income' ? '+' : '-';

        // Check for pending status
        if (transaction.status === 'pending') {
            itemClass = 'pending-item';
            li.className = `list-group-item d-flex justify-content-between align-items-center ${itemClass}`;
            li.innerHTML = `
                <div>
                    <small class="text-muted">วันที่ ${transaction.date}</small>
                    <span class="d-block fw-bold">${transaction.description}</span>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span class="fw-bold">${sign} ${amountText} (Pending)</span>
                    ${transaction.slip ? `<button class="btn btn-sm view-slip-btn" data-slip-url="${transaction.slip}"><i class="fas fa-image"></i></button>` : ''}
                </div>
            `;
        } else {
            li.className = `list-group-item d-flex justify-content-between align-items-center ${itemClass}`;
            li.innerHTML = `
                <div>
                    <small class="text-muted">วันที่ ${transaction.date}</small>
                    <span class="d-block fw-bold">${transaction.description}</span>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span class="fw-bold">${sign} ${amountText}</span>
                    ${transaction.slip ? `<button class="btn btn-sm view-slip-btn" data-slip-url="${transaction.slip}"><i class="fas fa-image"></i></button>` : ''}
                </div>
            `;
        }

        parentElement.appendChild(li);
    };

    // Event listeners for tab switching
    tabItems.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = e.currentTarget.dataset.tab;

            tabItems.forEach(item => item.classList.remove('active'));
            e.currentTarget.classList.add('active');

            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            document.getElementById(targetTab).classList.add('active');

            if (targetTab === 'summary-tab') {
                renderSummary();
            } else if (targetTab === 'history-tab') {
                populateYearDropdown();
                selectedYearText.textContent = 'เลือกปี'; // Reset text when switching to history tab
                historyList.innerHTML = '<p class="text-center text-muted mt-3">กรุณาเลือกปีที่ต้องการดูรายการ</p>';
            }
        });
    });

    // Event listener for year dropdown header
    yearDropdownHeader.addEventListener('click', () => {
        yearDropdownList.classList.toggle('d-none');
        yearDropdownHeader.querySelector('.toggle-icon').classList.toggle('fa-chevron-up');
        yearDropdownHeader.querySelector('.toggle-icon').classList.toggle('fa-chevron-down');
    });

    // View slip modal
    document.addEventListener('click', (e) => {
        const viewSlipBtn = e.target.closest('.view-slip-btn');
        if (viewSlipBtn) {
            const slipUrl = viewSlipBtn.getAttribute('data-slip-url');
            if (slipUrl) {
                modalSlipImage.src = slipUrl;
                slipModal.show();
            }
        }
    });

    // Initial render
    renderSummary();
    populateYearDropdown();
});
