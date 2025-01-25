<template>
  <div class="installment-plan-view">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-container">
        <!-- Title and Actions -->
        <div class="title-bar">
          <div class="title-wrapper">
            <i class="fas fa-file-invoice-dollar title-icon"></i>
            <h2 class="section-title">Installment Plans</h2>
          </div>
          <div class="header-actions">
            <router-link to="/dashboard/add-installment-plan" class="action-button add">
              <i class="fas fa-plus"></i>
              <span>Add New</span>
              <div class="button-glow"></div>
            </router-link>
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
                placeholder="Search by plan name, city, product name, or model..."
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

    <!-- Installment Plan List -->
    <div v-if="!loading && !error" class="installment-plan-list">
      <div class="installment-plan-table">
        <!-- Table Header -->
        <div class="table-header">
          <div class="header-cell">Plan Details</div>
          <div class="header-cell">Product Info</div>
          <div class="header-cell">Financials</div>
          <div class="header-cell">Actions</div>
        </div>

        <!-- Table Body -->
        <div class="table-body">
          <div
            v-for="plan in paginatedPlans"
            :key="plan.id"
            class="table-row"
          >
            <!-- Plan Details -->
            <div class="plan-cell">
              <div class="plan-info">
                <h4 class="plan-name">{{ plan.plan_name }}</h4>
                <span class="plan-city">{{ plan.city }}</span>
              </div>
            </div>

            <!-- Product Info -->
            <div class="product-cell">
              <div class="product-info">
                <h4 class="product-name">{{ plan.Product_name }}</h4>
                <span class="product-model">{{ plan.Product_model }}</span>
              </div>
            </div>

            <!-- Financials -->
            <div class="financials-cell">
              <div class="financial-item">
                <span class="financial-label">Price:</span>
                <span class="financial-value">Rs. {{ plan.product_price }}</span>
              </div>
              <div class="financial-item">
                <span class="financial-label">Advance:</span>
                <span class="financial-value">Rs. {{ plan.advance }}</span>
              </div>
              <div class="financial-item">
                <span class="financial-label">Remaining:</span>
                <span class="financial-value">Rs. {{ plan.remaining_amount }}</span>
              </div>
              <div class="financial-item">
                <span class="financial-label">Installment:</span>
                <span class="financial-value">Rs. {{ plan.installment_price }} for {{ plan.installment_duration }} months</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="actions-cell">
              <button
                class="action-btn edit"
                @click.prevent="openEditModal(plan)"
                type="button"
                title="Edit"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                class="action-btn delete"
                @click.prevent="handleDelete(plan)"
                type="button"
                title="Delete"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !error && filteredPlans.length === 0" class="text-center py-5">
      <i class="fas fa-file-invoice-dollar fa-3x text-muted mb-3"></i>
      <h4 class="text-muted">No installment plans found</h4>
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

    <!-- Add a "no results" message -->
    <div v-if="filteredPlans.length === 0" class="no-results mt-4 text-center">
      <i class="fas fa-search fa-2x text-muted mb-2"></i>
      <p class="text-muted">No plans found matching your search criteria</p>
    </div>
  </div>

  <!-- Add modal component -->
  <EditInstallmentPlanModal
    :plan="selectedPlan"
    @updated="handlePlanUpdated"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
// import EditInstallmentPlanModal from './EditInstallmentPlanModal.vue'
// import { Modal } from 'bootstrap'

const store = useStore()
const plans = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 12

// Fetch all data
const fetchAllData = async () => {
  const response = await store.dispatch('installmentPlanStore/getAllInstallmentPlans')
  if (response.success) {
    plans.value = response.plans
  } else {
    error.value = response.message
  }
}

// Enhanced filtered plans with proper type handling
const filteredPlans = computed(() => {
  let filtered = plans.value

  // Multi-field search with null checks and type conversion
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter((plan) => {
      // Convert all values to strings and handle null values
      const planName = (plan.plan_name || '').toLowerCase()
      const city = (plan.city || '').toLowerCase()
      const productName = (plan.Product_name || '').toLowerCase()
      const productModel = (plan.Product_model || '').toLowerCase()

      // Check each field
      return (
        planName.includes(query) ||
        city.includes(query) ||
        productName.includes(query) ||
        productModel.includes(query)
      )
    })
  }

  return filtered
})

const paginatedPlans = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredPlans.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredPlans.value.length / itemsPerPage))

const pageRange = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage + 1
  const end = Math.min(start + itemsPerPage - 1, filteredPlans.value.length)
  return { start, end, total: filteredPlans.value.length }
})

// Methods
const changePage = (page) => {
  currentPage.value = page
}

const fetchPlans = async () => {
  try {
    loading.value = true
    error.value = null
    await fetchAllData()
  } catch (err) {
    error.value = 'Failed to load plans'
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

// Add refs
const selectedPlan = ref(null)
let editModal = null

// // Initialize modal
// onMounted(() => {
//   editModal = new Modal(document.getElementById('editInstallmentPlanModal'))
// })

// Methods
const openEditModal = async (plan) => {
  selectedPlan.value = { ...plan }
  if (editModal) {
    editModal.show()
  } else {
    console.error('Edit modal not initialized')
  }
}

const handlePlanUpdated = async () => {
  await fetchPlans() // Refresh the list
}

// Enhanced delete function with debugging
const handleDelete = async (plan) => {
  try {
    const willDelete = confirm('Are you sure you want to delete this plan?')
    if (willDelete) {
      const response = await store.dispatch('installmentPlanStore/deleteInstallmentPlan', plan.id)
      if (response.success) {
        await fetchPlans()
      } else {
        alert(response.message || 'Failed to delete plan')
      }
    }
  } catch (error) {
    console.error('Delete error:', error)
    alert('Failed to delete plan')
  }
}

onMounted(() => {
  fetchPlans()
})
</script>

<style scoped>
.installment-plan-view {
  padding: 20px;
}

.section-title {
  color: #2c3e50;
  font-weight: 600;
}

.search-box {
  position: relative;
  max-width: 500px; /* Increased width for longer placeholder */
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

.installment-plan-list {
  padding: 20px;
}

.installment-plan-table {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 2fr 2fr 1fr;
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
  grid-template-columns: 2fr 2fr 2fr 1fr;
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

/* Plan Cell */
.plan-cell {
  display: flex;
  align-items: center;
  gap: 16px;
}

.plan-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.plan-name {
  font-size: 1rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.plan-city {
  font-size: 0.85rem;
  color: #6c757d;
}

/* Product Cell */
.product-cell {
  display: flex;
  align-items: center;
  gap: 16px;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-name {
  font-size: 1rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.product-model {
  font-size: 0.85rem;
  color: #6c757d;
}

/* Financials Cell */
.financials-cell {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.financial-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.financial-label {
  color: #6c757d;
  font-size: 0.85rem;
  min-width: 60px;
}

.financial-value {
  color: #212529;
  font-size: 0.9rem;
}

/* Actions Cell */
.actions-cell {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
}

.action-btn.edit {
  background: #4158d0;
  cursor: pointer;
  z-index: 10;
}

.action-btn.edit:active {
  transform: scale(0.95);
}

.action-btn.delete {
  background: #ff4d4d;
  cursor: pointer;
  z-index: 10; /* Ensure button is clickable */
}

.action-btn.delete:active {
  transform: scale(0.95); /* Visual feedback */
}

.action-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
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

.header-actions {
  display: flex;
  gap: 12px;
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

.add {
  background: linear-gradient(135deg, #4158d0, #c850c0);
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

.search-filter-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center align items */
  gap: 24px; /* Increased gap */
  margin-top: 20px;
}

.search-wrapper {
  width: 90%; /* Increased width */
  max-width: 506px; /* Maximum width */
  margin: 0 auto; /* Center the search box */
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
@media (max-width: 1200px) {
  .table-header,
  .table-row {
    grid-template-columns: 1.5fr 1.5fr 1.5fr 1fr;
  }
}

@media (max-width: 992px) {
  .table-header,
  .table-row {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .installment-plan-view {
    padding: 10px;
  }

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

  .plan-cell,
  .product-cell,
  .financials-cell,
  .actions-cell {
    padding: 8px;
    border-bottom: 1px solid #eee;
  }

  .plan-cell {
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
  .action-btn {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }

  .plan-name,
  .product-name {
    font-size: 0.9rem;
  }

  .plan-city,
  .product-model,
  .financial-label,
  .financial-value {
    font-size: 0.8rem;
  }
}

@media (max-width: 500px) {
  .title-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
    margin-top: 10px;
  }
}
</style>
