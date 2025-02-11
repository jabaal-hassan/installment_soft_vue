<template>
  <!-- Add Image Modal -->
  <div class="modal fade" id="imageModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ selectedImageTitle }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body text-center">
          <img :src="selectedImageUrl" class="img-fluid" alt="Full size image" />
        </div>
      </div>
    </div>
  </div>

  <div class="employee-view px-4">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-container">
        <!-- Title and Actions -->
        <div class="title-bar">
          <div class="title-wrapper">
            <i class="fas fa-users title-icon"></i>
            <h2 class="section-title">Employee Management</h2>
          </div>
          <div class="header-actions">
            <button class="action-button print" @click="printEmployees">
              <i class="fas fa-print"></i>
              <span>Print List</span>
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

          <!-- Company Filter -->
          <div class="category-wrapper" v-if="userRole === 'admin'">
            <div class="category-buttons">
              <button
                class="category-btn"
                :class="{ active: selectedCompany === 'all' }"
                @click="handleCompanyChange('all')"
              >
                <i class="fas fa-border-all"></i>
                <span>All Companies</span>
              </button>
              <button
                v-for="company in mainCompanies"
                :key="company.id"
                class="category-btn"
                :class="{ active: selectedCompany === company.name }"
                @click="handleCompanyChange(company.name)"
              >
                <i class="fas fa-building"></i>
                <span>{{ company.name }}</span>
              </button>

              <!-- Dropdown for additional companies -->
              <div class="dropdown d-inline-block" v-if="dropdownCompanies.length > 0">
                <button
                  class="category-btn dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <i class="fas fa-ellipsis-h"></i>
                  <span>More</span>
                </button>
                <ul class="dropdown-menu modern-dropdown">
                  <li v-for="company in dropdownCompanies" :key="company.id">
                    <a
                      class="dropdown-item"
                      href="#"
                      :class="{ active: selectedCompany === company.name }"
                      @click.prevent="handleCompanyChange(company.name)"
                    >
                      <i class="fas fa-building"></i>
                      <span>{{ company.name }}</span>
                    </a>
                  </li>
                </ul>
              </div>
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

    <!-- Employee Cards -->
    <div class="row g-4">
      <div v-for="employee in paginatedEmployees" :key="employee.id" class="col-md-6 col-lg-4">
        <div class="employee-card" :data-role="employee.role">
          <div class="card-header">
            <div class="header-content">
              <div class="employee-info">
                <h3 class="name">{{ employee.name }}</h3>
                <div class="position">{{ employee.position }}</div>
              </div>
              <div
                class="status-badge"
                :class="employee.role === 'branch admin' ? 'admin' : 'employee'"
              >
                {{ employee.role }}
              </div>
            </div>
          </div>

          <div class="card-body">
            <div class="images-row">
              <div
                class="image-container"
                v-if="employee.id_card_image"
                @click="openImage(employee.id_card_image, 'ID Card')"
              >
                <img :src="employee.id_card_image" alt="ID Card" class="side-image" />
                <div class="image-label">ID</div>
              </div>

              <div class="phone-container">
                <div class="phone-number">
                  <i class="fas fa-phone-alt phone-icon"></i>
                  {{ employee.phone_number }}
                </div>
              </div>

              <div
                class="image-container"
                v-if="employee.check_image"
                @click="openImage(employee.check_image, 'Check')"
              >
                <img :src="employee.check_image" alt="Check" class="side-image" />
                <div class="image-label">Check</div>
              </div>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <i class="fas fa-id-badge"></i>
                <span>ID: {{ employee.id }}</span>
              </div>
              <div class="info-item">
                <i class="fas fa-id-card"></i>
                <span>CNIC: {{ employee.id_card_number }}</span>
              </div>
              <div class="info-item email">
                <i class="fas fa-envelope"></i>
                <span>{{ employee.email }}</span>
              </div>
              <div class="info-item">
                <i class="fas fa-user"></i>
                <span>Father: {{ employee['father name'] }}</span>
              </div>
              <div class="info-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>{{ employee.address }}</span>
              </div>
              <div class="info-item">
                <i class="fas fa-code-branch"></i>
                <span>{{ employee.branch_name }} ({{ employee.branch_city }})</span>
              </div>
              <div class="info-item">
                <i class="fas fa-calendar"></i>
                <span>Joined: {{ new Date(employee.date_of_joining).toLocaleDateString() }}</span>
              </div>
              <div class="info-item">
                <i class="fas fa-money-bill"></i>
                <span>Pay: Rs. {{ employee.pay }}</span>
              </div>
              <div class="info-item">
                <i class="fas fa-question-circle"></i>
                <span>Inquiry:</span>
                <label class="switch">
                  <input
                    type="checkbox"
                    v-model="employee.inquiry"
                    @change="toggleInquiry(employee)"
                  />
                  <span class="slider round"></span>
                </label>
              </div>
              <div class="info-item">
                <i class="fas fa-undo-alt"></i>
                <span>Recovery:</span>
                <label class="switch">
                  <input
                    type="checkbox"
                    v-model="employee.recovery"
                    @change="toggleRecovery(employee)"
                  />
                  <span class="slider round"></span>
                </label>
              </div>
            </div>
          </div>

          <div class="card-actions">
            <button class="action-btn edit" @click="editEmployee(employee)" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn view" @click="viewDetails(employee)" title="View">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn delete" @click="deleteEmployee(employee)" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Empty State -->
    <div v-if="!loading && !error && filteredEmployees.length === 0" class="text-center py-5">
      <i class="fas fa-users-viewfinder fa-3x text-muted mb-3"></i>
      <h4 class="text-muted">No Employee found</h4>
    </div>
    <!-- Pagination -->
    <div class="d-flex justify-content-center mt-4">
      <nav aria-label="Page navigation">
        <ul class="pagination">
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
            <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
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
</template>

<style scoped>
.employee-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  margin-bottom: 20px;
}

/* Rainbow border animation */
.employee-card::before {
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

.employee-card:hover::before {
  animation: borderAnimation 2s ease infinite;
}

/* Different colors for admin/employee */
.employee-card[data-role='admin']::before {
  background: linear-gradient(45deg, #28a745, #20c997, #28a745);
}

.employee-card[data-role='employee']::before {
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

.card-header {
  background: linear-gradient(135deg, #1a1c2d, #2c2f44);
  padding: 20px;
  border-radius: 20px 20px 0 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.employee-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.name {
  color: white;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
}

.position {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  backdrop-filter: blur(4px);
}

.status-badge.admin {
  background: linear-gradient(135deg, #4158d0, #c850c0);
}

.images-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin: 20px 0;
  padding: 20px;
  background: linear-gradient(135deg, #f6f9fc, #eef2f7);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.images-row::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(65, 88, 208, 0.05) 0%, rgba(200, 80, 192, 0.05) 100%);
  z-index: 0;
}

.image-container {
  width: 65px;
  height: 65px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  z-index: 1;
}

.side-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}
.image-container:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(65, 88, 208, 0.15);
}

.image-container:hover .side-image {
  transform: scale(1.1);
}

.image-container:hover .image-label {
  background: linear-gradient(to top, rgba(65, 88, 208, 0.9), rgba(200, 80, 192, 0.7));
}

.phone-container {
  flex: 1;
  text-align: center;
  position: relative;
  z-index: 1;
  padding: 12px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

phone-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(65, 88, 208, 0.12);
}

.phone-number {
  color: #4158d0;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.phone-icon {
  color: #c850c0;
  font-size: 1rem;
  background: linear-gradient(135deg, #4158d0, #c850c0);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* Optional: Add decorative elements */
.images-row::after {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, rgba(65, 88, 208, 0.03), rgba(200, 80, 192, 0.03));
  border-radius: 50%;
  top: -100px;
  right: -100px;
  z-index: 0;
}

/* Add subtle pattern */
.images-row {
  background-image: linear-gradient(135deg, #f6f9fc, #eef2f7),
    radial-gradient(circle at 100% 100%, rgba(65, 88, 208, 0.02) 0%, transparent 50%),
    radial-gradient(circle at 0% 0%, rgba(200, 80, 192, 0.02) 0%, transparent 50%);
  background-blend-mode: overlay;
}

.card-body {
  padding: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background: #f8f9fa;
  border-radius: 10px;
  font-size: 0.9rem;
}

.info-item i {
  color: #4158d0;
  width: 16px;
}

.card-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  background: #f8f9fa;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.action-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.action-btn.edit {
  background: #4158d0;
}

.action-btn.view {
  background: #c850c0;
}

.action-btn.delete {
  background: #ff4d4d;
}

.action-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.search-box {
  position: relative;
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
  border-radius: 20px;
}

.pagination {
  margin-bottom: 0;
}

.page-link {
  color: #8710d8;
  padding: 8px 16px;
}

.page-item.active .page-link {
  background-color: #8710d8;
  border-color: #8710d8;
}

.company-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.company-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.company-btn:hover {
  background: #f0f0f0;
}

.company-btn.active {
  background: #8710d8;
  color: white;
  border-color: #8710d8;
}

.dropdown-item.active {
  background-color: #8710d8;
  color: white;
}

.company-btn.dropdown-toggle {
  padding-right: 24px;
}

.company-btn.dropdown-toggle::after {
  margin-left: 8px;
}

.card-images {
  display: flex;
  align-items: stretch;
  background: linear-gradient(45deg, #8710d8, #9d3fd9);
  padding: 15px;
  gap: 10px;
}

.image-container {
  flex: 0 0 80px;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
}

.image-container:hover {
  transform: scale(1.05);
}

.side-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid white;
}

.image-label {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  white-space: nowrap;
}

.employee-header {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.status.admin {
  background: #28a745;
}

.status.employee {
  background: #17a2b8;
}

/* Modal styles */
.modal-body img {
  max-height: 80vh;
  object-fit: contain;
}

.status-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.email-text {
  color: white;
  font-size: 0.8rem;
  opacity: 0.9;
  word-break: break-all;
  max-width: 150px;
  text-align: center;
}

.employee-view {
  padding: 20px 30px;
  max-width: 1600px;
  margin: 0 auto;
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
  align-items: center;
  gap: 24px;
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
  justify-content: center;
  overflow-x: auto;
  padding: 4px;
}

.category-buttons {
  display: inline-flex;
  justify-content: center;
  gap: 12px;
  padding: 4px;
  flex-wrap: wrap;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  backdrop-filter: blur(4px);
}

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

.modern-dropdown {
  background: #2c2f44;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.dropdown-item.active {
  background: linear-gradient(135deg, #4158d0, #c850c0);
  color: white;
}

.switch {
  position: relative;
  display: inline-block;
  width: 34px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 20px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 12px;
  width: 12px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #28a745;
}

input:checked + .slider:before {
  transform: translateX(14px);
}

@media (max-width: 768px) {
  .search-wrapper {
    width: 90%;
  }

  .category-buttons {
    justify-content: flex-start;
    padding: 4px 0;
  }

  .title-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

/* Responsive Styles */
@media (max-width: 1200px) {
  .employee-card {
    margin: 10px;
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

  .company-buttons {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 5px;
  }

  .company-btn {
    white-space: nowrap;
  }
}

@media (max-width: 768px) {
  .employee-view {
    padding: 10px;
  }

  .card-header {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }

  .images-row {
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
  }

  .phone-container {
    width: 100%;
    order: -1;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .card-actions {
    flex-wrap: wrap;
    gap: 10px;
  }

  .action-btn {
    flex: 1;
    min-width: 100px;
  }

  .pagination {
    justify-content: center;
    flex-wrap: wrap;
    gap: 5px;
  }
}

@media (max-width: 576px) {
  .section-title {
    font-size: 20px;
  }

  .action-button {
    padding: 8px 16px;
    font-size: 0.8rem;
  }

  .search-input {
    font-size: 0.9rem;
    padding: 10px 10px 10px 40px;
  }

  .company-btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .employee-card {
    margin: 5px 0;
  }

  .card-header {
    padding: 12px;
  }

  .name {
    font-size: 1rem;
  }

  .position {
    font-size: 0.8rem;
  }

  .phone-number {
    font-size: 0.9rem;
  }

  .info-item {
    padding: 8px 10px;
    font-size: 0.8rem;
  }

  .image-container {
    width: 55px;
    height: 55px;
  }

  .status-badge {
    font-size: 0.7rem;
    padding: 3px 8px;
  }
}

/* Print styles */
@media print {
  .employee-view {
    padding: 0;
  }

  .header-section,
  .search-filter-container,
  .pagination,
  .card-actions {
    display: none;
  }

  .employee-card {
    break-inside: avoid;
    margin: 10px 0;
    border: 1px solid #ddd;
  }
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { Modal } from 'bootstrap'
import AuthApiServices from '@/services/AuthApiServices'

const store = useStore()
const employees = ref([])
const companies = ref([])
const loading = ref(true)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 9
const selectedCompany = ref('all')
let imageModal = null
const selectedImageUrl = ref('')
const selectedImageTitle = ref('')

// Get user role from store
const userRole = computed(() => store.getters.getUserRole)

// Fetch companies for admin
const fetchCompanies = async () => {
  if (userRole.value === 'admin') {
    const response = await store.dispatch('getAllCompanies')
    if (response.success) {
      companies.value = response.companies
    }
  }
}

// Split companies into main and dropdown
const mainCompanies = computed(() => companies.value.slice(0, 4))
const dropdownCompanies = computed(() => companies.value.slice(4))

// Handle company selection
const handleCompanyChange = (companyId) => {
  selectedCompany.value = companyId
  currentPage.value = 1 // Reset to first page when changing company
}

// Updated filtered employees
const filteredEmployees = computed(() => {
  let filtered = employees.value

  // Filter by company if selected
  if (selectedCompany.value !== 'all') {
    filtered = filtered.filter((emp) => emp.company_name === selectedCompany.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (emp) =>
        emp.name.toLowerCase().includes(query) ||
        emp.phone_number.includes(query) ||
        emp.id_card_number.includes(query) ||
        emp.id.toString().includes(query),
    )
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredEmployees.value.length / itemsPerPage))

const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredEmployees.value.slice(start, end)
})

// Methods
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Add inquiry and recovery properties to employee object if not present
const addProperties = (employees) => {
  employees.forEach((employee) => {
    if (employee.inquiry === undefined) {
      employee.inquiry = false
    }
    if (employee.recovery === undefined) {
      employee.recovery = false
    }
  })
}

// Fetch employees
const fetchEmployees = async () => {
  try {
    loading.value = true
    const response = await store.dispatch('getAllEmployees')
    if (response.success) {
      employees.value = response.employees
      addProperties(employees.value)
    }
  } catch (error) {
    console.error('Error fetching employees:', error)
  } finally {
    loading.value = false
  }
}

const fetchInquiryOfficers = async () => {
  try {
    const response = await AuthApiServices.GetRequest('/get-inquiry-officers')

    let inquiryOfficers = []

    if (Array.isArray(response.data)) {
      // API direct array return kar rahi hai
      inquiryOfficers = response.data
    } else if (response.data && Array.isArray(response.data.data)) {
      // Expected structure
      inquiryOfficers = response.data.data
    } else {
      throw new Error('API response format is incorrect')
    }

    const inquiryOfficerIds = inquiryOfficers.map((officer) => officer.employee_id)
    console.log('Extracted Employee IDs:', inquiryOfficerIds)

    employees.value.forEach((employee) => {
      employee.inquiry = inquiryOfficerIds.includes(employee.id)
    })
  } catch (error) {
    console.error('Fetch Inquiry Officers Error:', error.message || error.toString())
  }
}
const fetchRecoveryOfficers = async () => {
  try {
    const response = await AuthApiServices.GetRequest('/get-recovery-officers')

    let recoveryOfficers = []

    if (Array.isArray(response.data)) {
      // API direct array return kar rahi hai
      recoveryOfficers = response.data
    } else if (response.data && Array.isArray(response.data.data)) {
      // Expected structure
      recoveryOfficers = response.data.data
    } else {
      throw new Error('API response format is incorrect')
    }

    const recoveryOfficerIds = recoveryOfficers.map((officer) => officer.employee_id)
    console.log('Extracted Employee IDs:', recoveryOfficerIds)

    employees.value.forEach((employee) => {
      employee.recovery = recoveryOfficerIds.includes(employee.id)
    })
  } catch (error) {
    console.error('Fetch Recovery Officers Error:', error.message || error.toString())
  }
}
// Fetch both employees and companies on mount
onMounted(async () => {
  await Promise.all([
    fetchEmployees(),
    fetchCompanies(),
    fetchInquiryOfficers(),
    fetchRecoveryOfficers(),
  ])
  imageModal = new Modal(document.getElementById('imageModal'))
})

const openImage = (url, title) => {
  selectedImageUrl.value = url
  selectedImageTitle.value = title
  imageModal.show()
}

// Update placeholder text to show search options
const searchPlaceholder = 'Search by name, phone, CNIC, or employee ID...'

const printEmployees = () => {
  const printWindow = window.open('', '_blank')

  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Employee List</title>
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
          <div class="report-title">Employee List Report</div>
          <div class="date">Generated on: ${new Date().toLocaleDateString()}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Position</th>
              <th>Branch</th>
              <th>Phone Number</th>
              <th>CNIC</th>
              <th>Email</th>
              <th>Join Date</th>
              <th>Pay (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            ${employees.value
              .map(
                (emp) => `
              <tr>
                <td>${emp.id}</td>
                <td>${emp.name}</td>
                <td>${emp.position || 'N/A'}</td>
                <td>${emp.branch_name || 'N/A'}</td>
                <td>${emp.phone_number}</td>
                <td>${emp.id_card_number}</td>
                <td>${emp.email}</td>
                <td>${new Date(emp.date_of_joining).toLocaleDateString()}</td>
                <td>${emp.pay}</td>
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

  printWindow.document.write(printContent)
  printWindow.document.close()
  printWindow.onload = () => printWindow.print()
}
const toggleInquiry = async (employee) => {
  try {
    let response
    let newStatus

    if (employee.inquiry) {
      response = await AuthApiServices.PostRequest(`/add-inquiry-officer/${employee.id}`)
      newStatus = true
    } else {
      response = await AuthApiServices.DeleteRequest(`/delete-inquiry-officer/${employee.id}`)
      newStatus = false
    }

    if (response?.status === 200) {
      console.log('Success:', response.data.message)
      employee.inquiry = newStatus // Update UI state
    } else {
      console.warn('Unexpected API response:', response)
    }
  } catch (error) {
    console.error('Full Error Object:', error)
  }
}
const toggleRecovery = async (employee) => {
  try {
    let response
    let newStatus

    if (employee.recovery) {
      response = await AuthApiServices.PostRequest(`/add-recovery-officer/${employee.id}`)
      newStatus = true
    } else {
      response = await AuthApiServices.DeleteRequest(`/delete-recovery-officer/${employee.id}`)
      newStatus = false
    }

    if (response?.status === 200) {
      console.log('Success:', response.data.message)
      employee.recovery = newStatus // Update UI state
    } else {
      console.warn('Unexpected API response:', response)
    }
  } catch (error) {
    console.error('Full Error Object:', error)
  }
}
</script>
