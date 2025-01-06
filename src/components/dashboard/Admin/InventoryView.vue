<template>
  <div class="inventory-view">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-container">
        <!-- Title and Actions -->
        <div class="title-bar">
          <div class="title-wrapper">
            <i class="fas fa-cube title-icon"></i>
            <h2 class="section-title">{{ selectedCategoryName }} Inventory</h2>
          </div>
          <div class="header-actions">
            <button class="action-button print" @click="printInventory">
              <i class="fas fa-print"></i>
              <span>Print</span>
              <div class="button-glow"></div>
            </button>
            <router-link to="/dashboard/add-inventory" class="action-button add">
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
                placeholder="Search by name, category, brand, model, or serial number..."
              />
            </div>
          </div>

          <!-- Category Filter -->
          <div class="category-wrapper">
            <div class="category-buttons">
              <button
                class="category-btn"
                :class="{ active: selectedCategory === 'all' }"
                @click="handleCategoryChange('all')"
              >
                <i class="fas fa-border-all"></i>
                <span>All Items</span>
              </button>
              <button
                v-for="category in displayCategories"
                :key="category.id"
                class="category-btn"
                :class="{ active: selectedCategory === category.id.toString() }"
                @click="handleCategoryChange(category.id.toString())"
              >
                <i class="fas fa-tag"></i>
                <span>{{ category.name }}</span>
              </button>
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

    <!-- Inventory List -->
    <div v-if="!loading && !error" class="inventory-list">
      <div class="inventory-table">
        <!-- Table Header -->
        <div class="table-header">
          <div class="header-cell">Product Details</div>
          <div class="header-cell">Location</div>
          <div class="header-cell">Specifications</div>
          <div class="header-cell">Stock Info</div>
          <div class="header-cell">Actions</div>
        </div>

        <!-- Table Body -->
        <div class="table-body">
          <div
            v-for="item in paginatedInventory"
            :key="item.id"
            class="table-row"
            :data-category="getCategoryName(item.category_id).toLowerCase()"
          >
            <!-- Product Details -->
            <div class="product-cell">
              <div class="product-icon">
                <i class="fas fa-box-open"></i>
              </div>
              <div class="product-info">
                <h4 class="product-name">{{ item.item_name }}</h4>
                <span class="product-category">{{ getCategoryName(item.category_id) }}</span>
              </div>
            </div>

            <!-- Location Info -->
            <div class="location-cell">
              <div class="location-tag">
                <i class="fas fa-map-marker-alt"></i>
                {{ getBranchName(item.branch_id) }}
              </div>
            </div>

            <!-- Specifications -->
            <div class="specs-cell">
              <div class="spec-item">
                <span class="spec-label">Brand:</span>
                <span class="spec-value">{{ getBrandName(item.brand_id) }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Model:</span>
                <span class="spec-value">{{ item.model }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Serial:</span>
                <span class="spec-value mono">{{ item.serial_number }}</span>
              </div>
            </div>

            <!-- Stock Info -->
            <div class="stock-cell">
              <div class="price-tag">
                <i class="fas fa-tag"></i>
                Rs. {{ item.price }}
              </div>
              <div class="stock-badge" :class="getQuantityClass(item.quantity)">
                <i class="fas fa-cubes"></i>
                {{ item.quantity }} units
              </div>
            </div>

            <!-- Actions -->
            <div class="actions-cell">
              <button
                class="action-btn edit"
                @click.prevent="openEditModal(item)"
                type="button"
                title="Edit"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                class="action-btn view"
                @click.prevent="openQRModal(item)"
                type="button"
                title="QR Code"
              >
                <i class="fas fa-qrcode"></i>
              </button>
              <button
                class="action-btn delete"
                @click.prevent="handleDelete(item)"
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
    <div v-if="!loading && !error && filteredInventory.length === 0" class="text-center py-5">
      <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
      <h4 class="text-muted">No inventory items found</h4>
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
    <div v-if="filteredInventory.length === 0" class="no-results mt-4 text-center">
      <i class="fas fa-search fa-2x text-muted mb-2"></i>
      <p class="text-muted">No items found matching your search criteria</p>
    </div>
  </div>

  <!-- Add modal component -->
  <EditInventoryModal
    :item="selectedItem"
    :categories="categories"
    :brands="brands"
    :branches="branches"
    @updated="handleItemUpdated"
  />

  <!-- Add QR Modal -->
  <ViewQRModal :item="selectedItem" :categories="categories" :brands="brands" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import EditInventoryModal from './EditInventoryModal.vue'
import { Modal } from 'bootstrap'
import ViewQRModal from './ViewQRModal.vue'

const store = useStore()
const inventory = ref([])
const categories = ref([])
const brands = ref([])
const branches = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)
const selectedCategory = ref('all')
const itemsPerPage = 12

// Specific categories to show
const displayCategories = computed(() => {
  const specificCategories = [
    'phone',
    'led',
    'refrigerator',
    'air condition',
    'washing machine',
    'others',
  ]
  return categories.value.filter((cat) => specificCategories.includes(cat.name.toLowerCase()))
})

// Fetch all data
const fetchAllData = async () => {
  const [categoriesRes, brandsRes, branchesRes] = await Promise.all([
    store.dispatch('getAllCategories'),
    store.dispatch('getAllBrands'),
    store.dispatch('getAllBranches'),
  ])

  if (categoriesRes.success) categories.value = categoriesRes.categories
  if (brandsRes.success) brands.value = brandsRes.brands
  if (branchesRes.success) branches.value = branchesRes.branches
}

// Helper functions to get names
const getCategoryName = (categoryId) => {
  const category = categories.value.find((c) => c.id === categoryId)
  return category ? category.name : 'N/A'
}

const getBrandName = (brandId) => {
  const brand = brands.value.find((b) => b.id === brandId)
  return brand ? brand.name : 'N/A'
}

const getBranchName = (branchId) => {
  const branch = branches.value.find((b) => b.id === branchId)
  return branch ? branch.name : 'N/A'
}

// Enhanced filtered inventory with proper type handling
const filteredInventory = computed(() => {
  let filtered = inventory.value

  // Filter by category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter((item) => item.category_id.toString() === selectedCategory.value)
  }

  // Multi-field search with null checks and type conversion
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter((item) => {
      // Convert all values to strings and handle null values
      const itemName = (item.item_name || '').toLowerCase()
      const model = (item.model || '').toLowerCase()
      const serialNumber = (item.serial_number || '').toLowerCase()
      const categoryName = getCategoryName(item.category_id).toLowerCase()
      const brandName = getBrandName(item.brand_id).toLowerCase()

      // Check each field
      return (
        itemName.includes(query) ||
        model.includes(query) ||
        serialNumber.includes(query) ||
        categoryName.includes(query) ||
        brandName.includes(query)
      )
    })
  }

  return filtered
})

const paginatedInventory = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredInventory.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredInventory.value.length / itemsPerPage))

const pageRange = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage + 1
  const end = Math.min(start + itemsPerPage - 1, filteredInventory.value.length)
  return { start, end, total: filteredInventory.value.length }
})

// Methods
const changePage = (page) => {
  currentPage.value = page
}

const fetchInventory = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await store.dispatch('getAllInventory')
    if (response.success) {
      inventory.value = response.data.inventory
    } else {
      error.value = response.message
    }
  } catch (err) {
    error.value = 'Failed to load inventory'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

// Get category name for selected category
const selectedCategoryName = computed(() => {
  if (selectedCategory.value === 'all') return 'All Items'
  const category = categories.value.find((c) => c.id.toString() === selectedCategory.value)
  return category ? category.name : 'All Items'
})

// Print function
const printInventory = () => {
  const printContent = `
    <html>
      <head>
        <title>Inventory Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            max-width: 150px;
            margin-bottom: 10px;
          }
          .company-name {
            font-size: 24px;
            font-weight: bold;
            margin: 10px 0;
          }
          .report-title {
            font-size: 18px;
            color: #666;
            margin-bottom: 20px;
          }
          .date {
            font-size: 14px;
            color: #666;
            margin-bottom: 30px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background-color: #f4f4f4;
            padding: 12px 8px;
            text-align: left;
            font-weight: bold;
            border-bottom: 2px solid #ddd;
          }
          td {
            padding: 10px 8px;
            border-bottom: 1px solid #ddd;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="/logo.png" class="logo" />
          <div class="company-name">Installmantsof</div>
          <div class="report-title">${selectedCategoryName.value} Inventory Report</div>
          <div class="date">Generated on: ${new Date().toLocaleDateString()}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Item Name</th>
              <th>Branch</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Serial No.</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${filteredInventory.value
              .map(
                (item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.item_name}</td>
                <td>${getBranchName(item.branch_id)}</td>
                <td>${getCategoryName(item.category_id)}</td>
                <td>${getBrandName(item.brand_id)}</td>
                <td>${item.model}</td>
                <td>${item.serial_number}</td>
                <td>${item.quantity}</td>
                <td>Rs. ${item.price}</td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>

        <div class="footer">
          This is a computer generated report.
        </div>
      </body>
    </html>
  `

  const printWindow = window.open('', '_blank')
  printWindow.document.write(printContent)
  printWindow.document.close()
  printWindow.print()
}

// Reset page when category changes
const handleCategoryChange = (newCategory) => {
  selectedCategory.value = newCategory
  currentPage.value = 1 // Reset to first page
}

// Reset page when searching
const handleSearch = (event) => {
  searchQuery.value = event.target.value
  currentPage.value = 1

  // Debug log to verify search values
  console.log('Search Query:', searchQuery.value)
  console.log(
    'Sample Item Search Fields:',
    inventory.value[0]
      ? {
          name: inventory.value[0].item_name,
          model: inventory.value[0].model,
          serial: inventory.value[0].serial_number,
          category: getCategoryName(inventory.value[0].category_id),
          brand: getBrandName(inventory.value[0].brand_id),
        }
      : 'No items',
  )
}

// Add refs
const selectedItem = ref(null)
let editModal = null
let qrModal = null

// Initialize modal
onMounted(() => {
  editModal = new Modal(document.getElementById('editInventoryModal'))
  qrModal = new Modal(document.getElementById('viewQRModal'))
})

// Methods
const openEditModal = async (item) => {
  console.log('Edit button clicked', item) // Debug log
  selectedItem.value = { ...item }
  if (editModal) {
    editModal.show()
  } else {
    console.error('Edit modal not initialized')
  }
}

const handleItemUpdated = async () => {
  await fetchInventory() // Refresh the list
}

// Open QR modal
const openQRModal = async (item) => {
  console.log('QR button clicked', item) // Debug log
  selectedItem.value = item
  if (qrModal) {
    qrModal.show()
  } else {
    console.error('QR modal not initialized')
  }
}

// Enhanced delete function with debugging
const handleDelete = async (item) => {
  console.log('Delete button clicked', item) // Debug log

  try {
    const willDelete = confirm('Are you sure you want to delete this item?')
    console.log('Confirm response:', willDelete) // Debug log

    if (willDelete) {
      console.log('Attempting to delete item:', item.id) // Debug log
      const response = await store.dispatch('deleteInventory', item.id)
      console.log('Delete response:', response) // Debug log

      if (response.success) {
        await fetchInventory()
      } else {
        alert(response.message || 'Failed to delete item')
      }
    }
  } catch (error) {
    console.error('Delete error:', error)
    alert('Failed to delete item')
  }
}

onMounted(() => {
  fetchInventory()
  fetchAllData()
})

const getQuantityClass = (quantity) => {
  if (quantity > 10) return 'in-stock'
  if (quantity > 0) return 'low-stock'
  return 'out-of-stock'
}
</script>

<style scoped>
.inventory-view {
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

.inventory-list {
  padding: 20px;
}

.inventory-table {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 1.5fr 0.8fr;
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
  grid-template-columns: 2fr 1fr 2fr 1.5fr 0.8fr;
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

/* Different colors for admin/employee */
.table-row[data-role='admin']::before {
  background: linear-gradient(45deg, #28a745, #20c997, #28a745);
}

.table-row[data-role='employee']::before {
  background: linear-gradient(45deg, #17a2b8, #4158d0, #17a2b8);
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

/* Product Cell */
.product-cell {
  display: flex;
  align-items: center;
  gap: 16px;
}

.product-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #4158d0, #c850c0);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
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

.product-category {
  font-size: 0.85rem;
  color: #6c757d;
}

/* Location Cell */
.location-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #e9ecef;
  border-radius: 20px;
  color: #495057;
  font-size: 0.9rem;
}

/* Specifications Cell */
.specs-cell {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spec-label {
  color: #6c757d;
  font-size: 0.85rem;
  min-width: 60px;
}

.spec-value {
  color: #212529;
  font-size: 0.9rem;
}

.spec-value.mono {
  font-family: monospace;
  color: #495057;
}

/* Stock Cell */
.stock-cell {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.price-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #495057;
  font-weight: 600;
}

.stock-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
}

.stock-badge.in-stock {
  background: #d4edda;
  color: #155724;
}

.stock-badge.low-stock {
  background: #fff3cd;
  color: #856404;
}

.stock-badge.out-of-stock {
  background: #f8d7da;
  color: #721c24;
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

.action-btn.view {
  background: #c850c0;
  cursor: pointer;
  z-index: 10;
}

.action-btn.view:active {
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

.category-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.category-btn {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  background: white;
  color: #666;
  font-size: 14px;
  transition: all 0.3s ease;
  cursor: pointer;
  white-space: nowrap;
}

.category-btn:hover {
  background: #f8f2ff;
  border-color: #8710d8;
  color: #8710d8;
}

.category-btn.active {
  background: #8710d8;
  border-color: #8710d8;
  color: white;
  box-shadow: 0 2px 4px rgba(135, 16, 216, 0.2);
}

.no-results {
  padding: 40px;
  background: #f8f9fa;
  border-radius: 8px;
}

.no-results i {
  color: #dee2e6;
}

.truncate-text {
  display: block;
  max-width: 120px; /* Adjust this value as needed */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Optional: Add tooltip on hover */
.truncate-text:hover {
  cursor: pointer;
}

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

.category-wrapper {
  width: 100%;
  display: flex;
  justify-content: center; /* Center the categories */
  overflow-x: auto;
  padding: 4px;
}

.category-buttons {
  display: inline-flex; /* Changed to inline-flex */
  justify-content: center; /* Center the buttons */
  gap: 12px;
  padding: 4px;
  flex-wrap: wrap; /* Allow wrapping */
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px; /* Increased padding */
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem; /* Slightly larger font */
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  backdrop-filter: blur(4px);
}

/* Enhanced hover and active states */
.category-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.category-btn.active {
  background: linear-gradient(135deg, #4158d0, #c850c0);
  color: white;
  box-shadow: 0 4px 15px rgba(65, 88, 208, 0.3);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .search-wrapper {
    width: 90%;
  }

  .category-buttons {
    justify-content: flex-start; /* Left align on mobile */
    padding: 4px 0;
  }
}

/* Responsive Styles */
@media (max-width: 1200px) {
  .table-header,
  .table-row {
    grid-template-columns: 1.5fr 1fr 1.5fr 1.2fr 0.8fr;
  }
}

@media (max-width: 992px) {
  .header-container {
    padding: 15px;
  }

  .title-bar {
    flex-direction: column;
    gap: 15px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .search-filter-container {
    flex-direction: column;
    gap: 15px;
  }

  .search-wrapper {
    width: 100%;
  }

  .category-wrapper {
    width: 100%;
    overflow-x: auto;
  }

  .category-buttons {
    padding-bottom: 5px;
    min-width: max-content;
  }
}

@media (max-width: 768px) {
  .inventory-view {
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

  .product-cell,
  .location-cell,
  .specs-cell,
  .stock-cell,
  .actions-cell {
    padding: 8px;
    border-bottom: 1px solid #eee;
  }

  .product-cell {
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
  .action-button {
    padding: 8px 16px;
    font-size: 0.8rem;
  }

  .search-input {
    font-size: 0.9rem;
  }

  .category-btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .product-info h4 {
    font-size: 0.9rem;
  }

  .product-category {
    font-size: 0.8rem;
  }

  .spec-item {
    font-size: 0.8rem;
  }

  .stock-badge {
    font-size: 0.8rem;
  }

  .action-btn {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }
}

/* Print styles */
@media print {
  .inventory-view {
    padding: 0;
  }

  .header-section,
  .search-filter-container,
  .pagination,
  .card-actions {
    display: none;
  }

  .table-header,
  .table-row {
    page-break-inside: avoid;
  }
}
</style>
