<template>
  
<!-- Header Section -->
    <div class="header-section">
      <div class="header-container">
        <!-- Title and Actions -->
        <div class="title-bar">
          <div class="title-wrapper">
            <i class="fas fa-file-invoice-dollar title-icon"></i>
            <h2 class="section-title">Installment Table</h2>
          </div>
          <div class="header-actions">
            <button class="action-button print" @click="printCustomerDetails">
              <i class="fas fa-print"></i>
              <span>Print Details</span>
              <div class="button-glow"></div>
            </button>
          </div>
        </div>

        <!-- Search and Filters -->
        <div class="search-filter-container">
          <!-- Search Box -->
          <div class="search-wrapper">
            <div class="search-box">
              <i class="fas fa-search search-icon"></i>
              <input
                type="text"
                v-model="searchQuery"
                class="search-input"
                :placeholder="searchPlaceholder"
              />
            </div>
          </div>

          <!-- Filter Controls -->
          <div class="filter-controls">
            <select v-model="statusFilter" class="filter-select">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
            <button @click="resetFilters" class="reset-button">Reset</button>
          </div>
        </div>
      </div>
    </div>







  <div class="main-container">
    <!-- Stats Overview -->
    <div class="stats-grid">
      <div class="stats-card">
        <h3 class="stats-title">Total Due Amount</h3>
        <p class="stats-value stats-value-blue">Rs. {{ calculateTotalDue() }}</p>
      </div>
      <div class="stats-card">
        <h3 class="stats-title">Total Installments</h3>
        <p class="stats-value stats-value-green">{{ filteredInstallments.length }}</p>
      </div>
      <div class="stats-card">
        <h3 class="stats-title">Overdue Installments</h3>
        <p class="stats-value stats-value-red">{{ countOverdueInstallments() }}</p>
      </div>
    </div>

    <!-- Previous Month's Installments -->
    <div class="table-container">
      <div class="section-header">
        <div class="section-title-wrapper">
          <i class="fas fa-history section-icon"></i>
          <h2 class="section-heading">Previous Month's Installments</h2>
        </div>
        <div class="section-divider"></div>
      </div>
      <div class="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Product</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="installment in previousMonthInstallments" :key="installment.id">
              <td>
                <div class="customer-info">
                  <div class="customer-avatar">
                    {{ getInitials(installment.customer.name) }}
                  </div>
                  <div class="customer-details">
                    <span class="customer-name">{{ installment.customer.name }}</span>
                    <span class="customer-id">ID: {{ installment.customer.id }}</span>
                  </div>
                </div>
              </td>
              <td>{{ installment.product_name }}</td>
              <td>
                <div class="date-info">
                  <span class="due-date">{{ formatDate(installment.installment_date) }}</span>
                  <span :class="{'days-overdue': isOverdue(installment)}">
                    {{ getDaysUntilDue(installment) }}
                  </span>
                </div>
              </td>
              <td>Rs. {{ formatPrice(installment.installment_price) }}</td>
              <td>
                <span
                  class="status-badge"
                  :class="isOverdue(installment) ? 'overdue' : 'pending'"
                >
                  {{ isOverdue(installment) ? 'Overdue' : 'Pending' }}
                </span>
              </td>
              <td>
                <button @click="viewDetails(installment)" class="action-btn view-btn">
                  View
                </button>
                <button
                    v-if="installment.status === 'pending'"
                    class="action-btn pay-btn"
                    @click="handlePayment(installment)"
                  >
                    Pay Now
                  </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Current Month's Installments -->
    <div class="table-container">
      <div class="section-header">
        <div class="section-title-wrapper">
          <i class="fas fa-calendar-alt section-icon"></i>
          <h2 class="section-heading">Current Month's Installments</h2>
        </div>
        <div class="section-divider"></div>
      </div>
      <div class="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Product</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="installment in currentMonthInstallments" :key="installment.id">
              <td>
                <div class="customer-info">
                  <div class="customer-avatar">
                    {{ getInitials(installment.customer.name) }}
                  </div>
                  <div class="customer-details">
                    <span class="customer-name">{{ installment.customer.name }}</span>
                    <span class="customer-id">ID: {{ installment.customer.id }}</span>
                  </div>
                </div>
              </td>
              <td>{{ installment.product_name }}</td>
              <td>
                <div class="date-info">
                  <span class="due-date">{{ formatDate(installment.installment_date) }}</span>
                  <span :class="{'days-overdue': isOverdue(installment)}">
                    {{ getDaysUntilDue(installment) }}
                  </span>
                </div>
              </td>
              <td>Rs. {{ formatPrice(installment.installment_price) }}</td>
              <td>
                <span
                  class="status-badge"
                  :class="isOverdue(installment) ? 'overdue' : 'pending'"
                >
                  {{ isOverdue(installment) ? 'Overdue' : 'Pending' }}
                </span>
              </td>
              <td>
                <button @click="viewDetails(installment)" class="action-btn view-btn">
                  View
                </button>
                <button @click="markPaid(installment.id)" class="action-btn mark-paid-btn">
                  Pay Now
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="selectedInstallment" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full modal-backdrop">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white modal-content">
        <div class="flex justify-between items-center pb-3">
          <h3 class="text-xl font-semibold">Installment Details</h3>
          <button
            @click="selectedInstallment = null"
            class="text-gray-400 hover:text-gray-500 focus:outline-none close-button"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="mt-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="font-semibold">Customer Information</h4>
              <p>Name: {{ selectedInstallment.customer.name }}</p>
              <p>Father's Name: {{ selectedInstallment.customer.father_name }}</p>
              <p>CNIC: {{ selectedInstallment.customer.cnic }}</p>
              <p>Phone: {{ selectedInstallment.customer.phone_number }}</p>
              <p>Address: {{ selectedInstallment.customer.address }}</p>
            </div>
            <div>
              <h4 class="font-semibold">Installment Information</h4>
              <p>Product: {{ selectedInstallment.product_name }}</p>
              <p>Amount: Rs. {{ formatPrice(selectedInstallment.installment_price) }}</p>
              <p>Due Date: {{ formatDate(selectedInstallment.installment_date) }}</p>
              <p>Status: {{ isOverdue(selectedInstallment) ? 'Overdue' : 'Pending' }}</p>
              <p>Created: {{ formatDateTime(selectedInstallment.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const installments = computed(() => store.getters['customerStore/installments'] || [])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const statusFilter = ref('all')
const selectedInstallment = ref(null)
const today = new Date()
const currentMonth = today.getMonth()
const currentYear = today.getFullYear()

const searchPlaceholder = 'Search by name, ID or installment number...'

const fetchInstallments = async () => {
  loading.value = true
  error.value = null
  // Correct action name: use 'customerStore/fetchPendingInstallments' (lowercase 'c')
  const response = await store.dispatch('customerStore/fetchPendingInstallments')
  if (!response?.success) {
    error.value = response?.message || 'Failed to fetch installments'
  }
  loading.value = false
}

const filteredInstallments = computed(() => {
  let result = [...installments.value]
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (item) =>
        (item.customer?.name || '').toLowerCase().includes(query) ||
        (item.customer?.id || '').toString().includes(query) ||
        (item.id || '').toString().includes(query)
    )
  }
  if (statusFilter.value === 'overdue') {
    result = result.filter((item) => isOverdue(item))
  } else if (statusFilter.value === 'pending') {
    result = result.filter((item) => !isOverdue(item) && item.status === 'pending')
  }
  return result
})

const currentMonthInstallments = computed(() =>
  filteredInstallments.value.filter(item => {
    const dueDate = new Date(item.installment_date)
    return dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear
  })
)

const previousMonthInstallments = computed(() =>
  filteredInstallments.value.filter(item => {
    const dueDate = new Date(item.installment_date)
    let prevMonth = currentMonth - 1
    let prevYear = currentYear
    if (prevMonth < 0) {
      prevMonth = 11
      prevYear--
    }
    return dueDate.getMonth() === prevMonth && dueDate.getFullYear() === prevYear
  })
)

function calculateTotalDue() {
  return filteredInstallments.value
    .reduce((total, item) => total + parseFloat(item.installment_price || 0), 0)
    .toFixed(2)
}

function countOverdueInstallments() {
  return filteredInstallments.value.filter((item) => isOverdue(item)).length
}

function isOverdue(installment) {
  const dueDate = new Date(installment.installment_date)
  return dueDate < today && installment.status === 'pending'
}

function formatPrice(price) {
  return parseFloat(price)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

function formatDateTime(dateTimeString) {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(dateTimeString).toLocaleDateString(undefined, options)
}

function getDaysUntilDue(installment) {
  const dueDate = new Date(installment.installment_date)
  const diffTime = dueDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays < 0) {
    return `${Math.abs(diffDays)} days overdue`
  } else if (diffDays === 0) {
    return 'Due today'
  } else {
    return `Due in ${diffDays} days`
  }
}

function getInitials(name) {
  return (name || '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function resetFilters() {
  searchQuery.value = ''
  statusFilter.value = 'all'
}

function viewDetails(installment) {
  selectedInstallment.value = installment
}

/************************************ handle Payment ************************************/

const handlePayment = async (installment) => {
  try {
    const result = await store.dispatch('customerStore/updateInstallmentStatus', installment.id)
    if (result.success) {
      // Show success message
      successMessage.value = 'Payment received successfully'
      showSuccess.value = true
      setTimeout(() => {
        showSuccess.value = false
      }, 3000)
    } else {
      // Show error message
      errorMessage.value = result.message
      showError.value = true
      setTimeout(() => {
        showError.value = false
      }, 3000)
    }
  } catch (error) {
    console.error('Error processing payment:', error)
    errorMessage.value = 'Failed to process payment'
    showError.value = true
    setTimeout(() => {
      showError.value = false
    }, 3000)
  }
}

onMounted(() => {
  fetchInstallments()
})
</script>

<style>
/* Header Section */
.header-section {
  background: linear-gradient(135deg, #1a1c2d, #2c2f44);
  border-radius: 20px;
  padding: 24px;
  margin: 24px 32px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.header-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-icon {
  font-size: 24px;
  color: #4158d0;
  background: rgba(65, 88, 208, 0.1);
  padding: 12px;
  border-radius: 12px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  text-decoration: none;
}

.print {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.button-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.action-button:hover .button-glow {
  opacity: 1;
  transform: scale(1.2);
}

.section-title {
  color: white;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.search-filter-container {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
}

.search-wrapper {
  width: 70%;
  max-width: 800px;
  margin: 0 auto;
}



.search-box {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 44px;
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 18px;
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 44px;
  padding: 0 16px 0 48px; 
  background: transparent;
  border: none;
  color: white;
  font-size: 1rem;
  outline: none;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
 
}

.search-input:focus {
  box-shadow: 0 0 0 2px rgba(65, 88, 208, 0.3);
}

.filter-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 14px;
  backdrop-filter: blur(4px);
}

.filter-select option {
  background: #2A2F4E;
  color: white;
}

.reset-button {
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.reset-button:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Base Layout */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

/* Table Styles */
table {
  width: 100%;
  border-collapse: collapse;
}

th {
  color: #6B7280;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 16px;
  background: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
}

td {
  padding: 16px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #E5E7EB;
}

/* Status Badge */
.status-badge {
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.status-badge.overdue {
  background-color: #FEE2E2;
  color: #DC2626;
}

.status-badge.pending {
  background-color: #FEF3C7;
  color: #D97706;
}

/* Action Buttons */
.action-btn {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn {
  color: #2563EB;
  border-color: #BFDBFE;
  background: #EFF6FF;
  margin-right: 8px;
}

.view-btn:hover {
  background: #DBEAFE;
}

.mark-paid-btn {
  color: #059669;
  border-color: #A7F3D0;
  background: #ECFDF5;
}

.mark-paid-btn:hover {
  background: #D1FAE5;
}

/* Customer Info */
.customer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.customer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  background: #E5E7EB;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #4B5563;
}

.customer-details {
  display: flex;
  flex-direction: column;
}

.customer-name {
  font-weight: 500;
  color: #111827;
}

.customer-id {
  font-size: 12px;
  color: #6B7280;
}

/* Date Display */
.date-info {
  display: flex;
  flex-direction: column;
}

.due-date {
  font-weight: 500;
  color: #111827;
}

.days-overdue {
  font-size: 12px;
  color: #DC2626;
}

/* Main Container */
.main-container {
  padding: 24px 32px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.stats-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stats-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.stats-value {
  font-size: 24px;
  font-weight: 700;
}

.stats-value-blue { color: #2563EB; }
.stats-value-green { color: #059669; }
.stats-value-red { color: #DC2626; }

/* Filter Section */
.filter-container {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.search-wrapper {
  width: 70%;
  max-width: 800px;
  margin: 0 auto;
}

.search-box {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
}

.search-input {
  width: 100%;
  padding: 14px 14px 14px 48px;
  background: transparent;
  border: none;
  color: white;
  font-size: 0.95rem;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(65, 88, 208, 0.3);
}

.filter-controls {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 10px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.filter-select option {
  background: #1a1c2d;
  color: white;
}

.reset-button {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 80px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 800px;
  margin: 0 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.close-button {
  padding: 8px;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.close-button:hover {
  background-color: #F3F4F6;
}

/* Section Headers */
.section-header {
  padding: 24px;
  text-align: center;
  position: relative;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.section-icon {
  font-size: 24px;
  color: #4158d0;
  background: rgba(65, 88, 208, 0.1);
  padding: 12px;
  border-radius: 50%;
}

.section-heading {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.section-divider {
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #4158d0, transparent);
  margin: 0 auto;
}

/* Update table container margin for better spacing */
.table-container {
  margin: 32px auto;
  transition: all 0.3s ease;
}

.table-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .search-filter-container {
    flex-direction: column;
  }
   .action-button {
    padding: 8px 16px;
    font-size: 0.8rem;
  }
  .search-wrapper {
    width: 100%;
    max-width: none;
  }
  
  .filter-controls {
    width: 100%;
    justify-content: space-between;
  }
}

/* Keep existing styles */
</style>
