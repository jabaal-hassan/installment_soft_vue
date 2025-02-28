<template>
  <div class="customer-view">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-container">
        <!-- Title and Actions -->
        <div class="title-bar">
          <div class="title-wrapper">
            <i class="fas fa-users title-icon"></i>
            <h2 class="section-title">Customers Without Guarantors</h2>
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
                @input="handleSearch"
                :value="searchQuery"
                class="search-input"
                placeholder="Search by name, CNIC, phone number..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>
    <!-- Success Message -->
    <div v-if="showSuccess" class="alert alert-success">
      {{ successMessage }}
    </div>

    <!-- Error Message -->
    <div v-if="showError" class="alert alert-danger">
      {{ errorMessage }}
    </div>

    <!-- Customer List -->
    <div v-if="!loading && !error" class="customer-list">
      <div class="customer-table">
        <!-- Table Header -->
        <div class="table-header">
          <div class="header-cell">Customer Details</div>
          <div class="header-cell">Contact Info</div>
          <div class="header-cell">Customer image</div>
          <div class="header-cell">Status & Actions</div>
        </div>

        <!-- Table Body -->
        <div class="table-body">
          <div v-for="customer in paginatedCustomers" :key="customer.id" class="table-row">
            <!-- Customer Details -->
            <div class="customer-cell">
              <div class="customer-info">
                <h4 class="customer-name">{{ customer.name }}</h4>
                <span class="customer-father-name">{{ customer.father_name }}</span>
              </div>
            </div>

            <!-- Contact Info -->
            <div class="contact-cell">
              <div class="contact-info">
                <div class="contact-item">
                  <span class="contact-label">Phone:</span>
                  <span class="contact-value">{{ customer.phone_number }}</span>
                </div>
                <div class="contact-item">
                  <span class="contact-label">CNIC:</span>
                  <span class="contact-value">{{ customer.cnic }}</span>
                </div>
                <div class="contact-item">
                  <span class="contact-label">Address:</span>
                  <span class="contact-value">{{ customer.address }}</span>
                </div>
              </div>
            </div>

            <!-- Customer Image -->
            <div class="image-cell">
              <img :src="customer.customer_image" alt="Customer Image" class="customer-image" />
            </div>

            <!-- Status & Actions -->
            <div class="status-actions-cell">
              <span class="status-badge" :class="customer.status">{{ customer.status }}</span>
              <div class="action-buttons">
                <button
                  class="action-button confirm"
                  @click="handleConfirm(customer)"
                  :disabled="customer.status === 'confirmed'"
                >
                  <i class="fas fa-check"></i>
                  <span>Confirm</span>
                </button>
                <button
                  class="action-button reject"
                  @click="handleReject(customer)"
                  :disabled="customer.status === 'rejected'"
                >
                  <i class="fas fa-times"></i>
                  <span>Reject</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !error && filteredCustomers.length === 0" class="text-center py-5">
      <i class="fas fa-users fa-3x text-muted mb-3"></i>
      <h4 class="text-muted">No customers found</h4>
    </div>

    <!-- Pagination -->
    <div class="d-flex justify-content-between align-items-center mt-4">
      <div class="showing-entries">
        Showing <span class="fw-bold">{{ pageRange.start }}-{{ pageRange.end }}</span> of
        <span class="fw-bold">{{ pageRange.total }}</span> entries
      </div>
      <nav aria-label="Page navigation" v-if="totalPages > 1">
        <ul class="pagination mb-0">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
              <i class="fas fa-chevron-left"></i>
            </a>
          </li>
          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: page === currentPage }"
          >
            <a class="page-link" href="#" @click.prevent="changePage(page)">
              {{ page }}
            </a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
              <i class="fas fa-chevron-right"></i>
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <!-- No Results Message -->
    <div v-if="filteredCustomers.length === 0" class="no-results mt-4 text-center">
      <i class="fas fa-search fa-2x text-muted mb-2"></i>
      <p class="text-muted">No customers found matching your search criteria</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const customers = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 12

// Success and error message states
const successMessage = ref('')
const errorMessage = ref('')
const showSuccess = ref(false)
const showError = ref(false)

/************************************ fetch all data ************************************/

const fetchAllData = async () => {
  const response = await store.dispatch('customerStore/fetchInquiryCustomers')
  if (response.success) {
    customers.value = response.customers
  } else {
    error.value = response.message
  }
}

/************************************ Handle Confirm Action ************************************/

const handleConfirm = async (customer) => {
  const result = await store.dispatch('customerStore/updateCustomerStatus', {
    id: customer.id,
    status: 'confirmed',
  })

  if (result.success) {
    successMessage.value = 'Customer confirmed successfully'
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
    fetchAllData()
  } else {
    errorMessage.value = result.message || 'Failed to confirm customer'
    showError.value = true
    setTimeout(() => {
      showError.value = false
    }, 3000)
    fetchAllData()
  }
}

/************************************ Handle Reject Action ************************************/

const handleReject = async (customer) => {
  const result = await store.dispatch('customerStore/updateCustomerStatus', {
    id: customer.id,
    status: 'rejected',
  })

  if (result.success) {
    successMessage.value = 'Customer rejected successfully'
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
    fetchAllData()
  } else {
    errorMessage.value = result.message || 'Failed to reject customer'
    showError.value = true
    setTimeout(() => {
      showError.value = false
    }, 3000)
    fetchAllData()
  }
}

const filteredCustomers = computed(() => {
  let filtered = customers.value

  // Multi-field search with null checks and type conversion
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter((customer) => {
      // Convert all values to strings and handle null values
      const name = (customer.name || '').toLowerCase()
      const cnic = (customer.cnic || '').toLowerCase()
      const phoneNumber = (customer.phone_number || '').toLowerCase()
      const address = (customer.address || '').toLowerCase()

      // Check each field
      return (
        name.includes(query) ||
        cnic.includes(query) ||
        phoneNumber.includes(query) ||
        address.includes(query)
      )
    })
  }

  return filtered
})

const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredCustomers.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredCustomers.value.length / itemsPerPage))

const pageRange = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage + 1
  const end = Math.min(start + itemsPerPage - 1, filteredCustomers.value.length)
  return { start, end, total: filteredCustomers.value.length }
})

// Methods
const changePage = (page) => {
  currentPage.value = page
}

const fetchCustomers = async () => {
  try {
    loading.value = true
    error.value = null
    await fetchAllData()
  } catch (err) {
    error.value = 'Failed to load customers'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

// Reset page when searching
const handleSearch = (event) => {
  searchQuery.value = event.target.value
  currentPage.value = 1
}

onMounted(() => {
  fetchCustomers()
  fetchAllData()
})
</script>

<style scoped>
.customer-view {
  padding: 20px;
}

.section-title {
  color: #2c3e50;
  font-weight: 600;
}

.search-box {
  position: relative;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-input {
  padding-left: 35px;
  padding-right: 15px;
  border-radius: 20px;
  border: 1px solid #ced4da;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #8710d8;
  box-shadow: 0 0 0 0.2rem rgba(135, 16, 216, 0.25);
}

.customer-list {
  padding: 20px;
}

.customer-table {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr;
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.header-cell {
  color: #495057;
  font-weight: 600;
  font-size: 0.9rem;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr;
  padding: 20px;
  align-items: center;
  border-bottom: 1px solid #e9ecef;
  transition: all 0.2s ease;
  position: relative;
  margin-bottom: 15px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.table-row:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}
/* Default rainbow border for all items */
.table-row::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  padding: 2px;
  background: linear-gradient(45deg, #4158d0, #c850c0, #ffcc70, #4158d0);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  background-size: 300% 300%;
  animation: borderAnimation 4s ease infinite;
}

.table-row:hover::before {
  animation: borderAnimation 2s ease infinite;
}

@keyframes borderAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.customer-cell,
.contact-cell,
.image-cell,
.actions-cell {
  display: flex;
  align-items: center;
  gap: 16px;
}

.customer-info,
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.customer-name,
.contact-item {
  font-size: 1rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.customer-father-name,
.contact-label {
  font-size: 0.85rem;
  color: #6c757d;
}

.customer-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e9ecef;
}

.actions-cell {
  display: flex;
  justify-content: flex-end;
}

.showing-entries {
  color: #6c757d;
}

.no-results {
  padding: 40px;
  background: #f8f9fa;
  border-radius: 8px;
}

.no-results i {
  color: #dee2e6;
}

/* Header Section */
.header-section {
  background: linear-gradient(135deg, #1a1c2d, #2c2f44);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 30px;
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

.section-title {
  color: white;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.search-filter-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-top: 20px;
}

.search-wrapper {
  width: 90%;
  max-width: 506px;
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

/* Responsive Styles */
@media (max-width: 768px) {
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 15px;
  }

  .header-cell {
    display: none;
  }

  .table-row {
    background: white;
    border-radius: 12px;
    margin-bottom: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .customer-cell,
  .contact-cell,
  .image-cell,
  .actions-cell {
    padding: 8px;
    border-bottom: 1px solid #eee;
  }

  .customer-cell {
    border-bottom: none;
  }

  .actions-cell {
    justify-content: flex-start;
    border-bottom: none;
  }

  .showing-entries {
    text-align: center;
    margin-bottom: 15px;
  }

  .pagination {
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .customer-name,
  .contact-item {
    font-size: 0.9rem;
  }

  .customer-father-name,
  .contact-label {
    font-size: 0.8rem;
  }

  .customer-image {
    width: 60px;
    height: 60px;
  }

  .action-button.confirm {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
  .action-button.rejected {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}

.status-actions-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.processing {
  background: #ffcc00;
  color: #000;
}

.status-badge.confirmed {
  background: #00cc66;
  color: #fff;
}

.status-badge.rejected {
  background: #ff4d4d;
  color: #fff;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 50;
}

.action-button.confirm {
  background: #00cc66;
  color: white;
}

.action-button.confirm:disabled {
  background: #b3e6cc;
  cursor: not-allowed;
}

.action-button.reject {
  background: #ff4d4d;
  color: white;
}

.action-button.reject:disabled {
  background: #ffb3b3;
  cursor: not-allowed;
}

.action-button:hover:not(:disabled) {
  transform: translateY(-2px);
  filter: brightness(1.1);
}
</style>
