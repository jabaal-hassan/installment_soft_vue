<template>
  <div class="inventory-view">
    <!-- Header Section -->
    <div class="header-section mb-4">
      <div class="d-flex justify-content-between align-items-center">
        <h2 class="section-title">{{ selectedCategoryName }} Inventory</h2>
        <div class="header-actions">
          <button class="btn btn-outline-primary me-2" @click="printInventory">
            <i class="fas fa-print me-1"></i> Print
          </button>
          <router-link to="/dashboard/add-inventory" class="btn btn-primary">
            <i class="fas fa-plus me-1"></i> Add New
          </router-link>
        </div>
      </div>

      <!-- Search and Category Filter -->
      <div class="search-filters mt-3">
        <div class="row g-3">
          <div class="col-md-4">
            <div class="search-box">
              <i class="fas fa-search search-icon"></i>
              <input
                type="text"
                @input="handleSearch"
                :value="searchQuery"
                class="form-control search-input"
                placeholder="Search by name, category, brand, model, or serial number..."
              />
            </div>
          </div>
          <div class="col-md-8">
            <div class="category-buttons">
              <button
                class="category-btn"
                :class="{ active: selectedCategory === 'all' }"
                @click="handleCategoryChange('all')"
              >
                All Items
              </button>
              <button
                v-for="category in displayCategories"
                :key="category.id"
                class="category-btn"
                :class="{ active: selectedCategory === category.id.toString() }"
                @click="handleCategoryChange(category.id.toString())"
              >
                {{ category.name }}
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
      <!-- Table Header -->
      <div class="inventory-table">
        <div class="table-header">
          <div class="col-name">Item Name</div>
          <div class="col-branch">Branch</div>
          <div class="col-category">Category</div>
          <div class="col-brand">Brand</div>
          <div class="col-model">Model</div>
          <div class="col-serial">Serial Number</div>
          <div class="col-price">Price</div>
          <div class="col-qty">Qty</div>
          <div class="col-actions">Actions</div>
        </div>

        <!-- Table Body -->
        <div class="table-body">
          <div v-for="item in paginatedInventory" :key="item.id" class="table-row">
            <div class="col-name">
              <span class="item-name">{{ item.item_name }}</span>
            </div>
            <div class="col-branch">
              <span class="truncate-text" :title="getBranchName(item.branch_id)">
                {{ getBranchName(item.branch_id) }}
              </span>
            </div>
            <div class="col-category">{{ getCategoryName(item.category_id) }}</div>
            <div class="col-brand">{{ getBrandName(item.brand_id) }}</div>
            <div class="col-model">{{ item.model }}</div>
            <div class="col-serial">{{ item.serial_number }}</div>
            <div class="col-price">Rs. {{ item.price }}</div>
            <div class="col-qty">
              <span class="badge" :class="item.quantity > 0 ? 'bg-success' : 'bg-danger'">
                {{ item.quantity }}
              </span>
            </div>
            <div class="col-actions">
              <div class="dropdown">
                <button class="btn btn-link" data-bs-toggle="dropdown">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
                <ul class="dropdown-menu">
                  <li>
                    <a class="dropdown-item" href="#" @click.prevent="openEditModal(item)">
                      <i class="fas fa-edit me-2"></i>Edit
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#" @click.prevent="openQRModal(item)">
                      <i class="fas fa-qrcode me-2"></i>View QR
                    </a>
                  </li>
                  <li><hr class="dropdown-divider" /></li>
                  <li>
                    <a
                      class="dropdown-item text-danger"
                      href="#"
                      @click.prevent="handleDelete(item)"
                    >
                      <i class="fas fa-trash me-2"></i>Delete
                    </a>
                  </li>
                </ul>
              </div>
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
const openEditModal = (item) => {
  selectedItem.value = { ...item }
  editModal.show()
}

const handleItemUpdated = async () => {
  await fetchInventory() // Refresh the list
}

// Open QR modal
const openQRModal = (item) => {
  selectedItem.value = item
  qrModal.show()
}

// Add delete function
const handleDelete = async (item) => {
  if (confirm('Are you sure you want to delete this item?')) {
    try {
      const response = await store.dispatch('deleteInventory', item.id)
      if (response.success) {
        await fetchInventory() // Refresh the list
      } else {
        alert(response.message || 'Failed to delete item')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete item')
    }
  }
}

onMounted(() => {
  fetchInventory()
  fetchAllData()
})
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

.inventory-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 0.5fr 0.5fr;
  padding: 15px;
  background: #f8f9fa;
  border-bottom: 2px solid #eee;
  font-weight: 600;
  color: #495057;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 0.5fr 0.5fr;
  padding: 15px;
  align-items: center;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: #f8f2ff;
}

.col-name,
.col-branch,
.col-category,
.col-brand,
.col-model,
.col-serial,
.col-price,
.col-qty,
.col-actions {
  padding: 0 10px;
}

.item-name {
  font-weight: 500;
  color: #2c3e50;
}

.col-price {
  font-weight: 500;
  color: #8710d8;
}

.col-qty .badge {
  padding: 6px 12px;
  border-radius: 20px;
}

.col-actions {
  text-align: center;
}

.btn-link {
  color: #6c757d;
  padding: 5px;
}

.btn-link:hover {
  color: #8710d8;
}

.btn-outline-secondary {
  border-color: #e9ecef;
}

.btn-outline-secondary:hover,
.btn-outline-secondary.active {
  background-color: #8710d8;
  border-color: #8710d8;
  color: white;
}

.pagination .page-link {
  color: #8710d8;
}

.pagination .active .page-link {
  background-color: #8710d8;
  border-color: #8710d8;
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
</style>
