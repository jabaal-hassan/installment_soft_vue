<template>
  <div class="branch-view">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-container">
        <div class="title-bar">
          <div class="title-wrapper">
            <i class="fas fa-building title-icon"></i>
            <h2 class="section-title">Branches</h2>
          </div>
        </div>
        <div class="search-filter-container">
          <div class="search-wrapper">
            <div class="search-box">
              <i class="fas fa-search search-icon"></i>
              <input
                type="text"
                v-model="searchQuery"
                class="search-input"
                placeholder="Search by Branch Name, City, or Company"
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
    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>
    <div v-else class="branch-list">
      <div v-if="filteredBranches.length === 0" class="no-results mt-4 text-center">
        <i class="fas fa-search fa-2x text-muted mb-2"></i>
        <p class="text-muted">No branches found matching your search criteria</p>
      </div>
      <div class="branch-cards">
        <div v-for="branch in paginatedBranches" :key="branch.id" class="branch-card">
          <div class="branch-header">
            <img
              v-if="branch.company && branch.company.logo"
              :src="branch.company.logo"
              alt="Company Logo"
              class="company-logo"
            />
            <div class="branch-title-group">
              <h3 class="branch-name">{{ branch.name }}</h3>
              <span class="branch-city">{{ branch.city }}</span>
            </div>
          </div>
          <div class="branch-body">
            <div class="branch-info">
              <div><strong>Address:</strong> {{ branch.address }}</div>
              <div v-if="isAdmin"><strong>Company:</strong> {{ branch.company?.name || '-' }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- Pagination -->
      <div class="d-flex justify-content-between align-items-center mt-4" v-if="totalPages > 1">
        <div class="showing-entries">
          Showing <span class="fw-bold">{{ pageRange.start }}-{{ pageRange.end }}</span> of
          <span class="fw-bold">{{ pageRange.total }}</span> entries
        </div>
        <nav aria-label="Page navigation">
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const branches = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 8
const isAdmin = computed(() => {
  const role = store.getters.getUserRole
  return role === 'admin'
})
const fetchBranches = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await store.dispatch('getAllBranches')
    if (response.success) {
      branches.value = response.branches
    } else {
      error.value = response.message || 'Failed to fetch branches'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to fetch branches'
  } finally {
    loading.value = false
  }
}

const filteredBranches = computed(() => {
  let filtered = branches.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter((branch) => {
      const name = (branch.name || '').toLowerCase()
      const city = (branch.city || '').toLowerCase()
      const company = (branch.company?.name || '').toLowerCase()
      return name.includes(query) || city.includes(query) || company.includes(query)
    })
  }
  return filtered
})

const paginatedBranches = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredBranches.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredBranches.value.length / itemsPerPage))

const pageRange = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage + 1
  const end = Math.min(start + itemsPerPage - 1, filteredBranches.value.length)
  return { start, end, total: filteredBranches.value.length }
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

onMounted(() => {
  fetchBranches()
})
</script>

<style scoped>
/* ===== BASE ===== */
.branch-view {
  padding: 20px;
}

/* ===== HEADER SECTION ===== */
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

/* ===== SEARCH ===== */
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

/* ===== BRANCH LIST ===== */
.branch-list {
  padding: 20px;
}

.branch-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* ===== BRANCH CARD ===== */
.branch-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
}

/* Animated rainbow border */
.branch-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 16px;
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

.branch-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.1);
}

.branch-card:hover::before {
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

/* ===== CARD HEADER ===== */
.branch-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px 14px;
  border-bottom: 1px solid #f0f0f0;
  background: #f8f9fa;
}

.company-logo {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid #e9ecef;
  flex-shrink: 0;
}

.branch-title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.branch-name {
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.branch-city {
  font-size: 0.82rem;
  color: #6c757d;
}

/* ===== CARD BODY ===== */
.branch-body {
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.branch-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.88rem;
  color: #495057;
}

.branch-info strong {
  color: #343a40;
}

/* ===== MISC ===== */
.no-results {
  padding: 40px;
  background: #f8f9fa;
  border-radius: 12px;
}

.showing-entries {
  color: #6c757d;
  font-size: 0.9rem;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .branch-cards {
    grid-template-columns: 1fr;
  }

  .branch-list {
    padding: 10px;
  }

  .showing-entries {
    text-align: center;
    margin-bottom: 12px;
  }

  .pagination {
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .branch-name {
    font-size: 0.92rem;
  }

  .branch-info {
    font-size: 0.82rem;
  }

  .company-logo {
    width: 42px;
    height: 42px;
  }
}
</style>
