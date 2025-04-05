<template>
  <div class="customer-profile">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-container">
        <div class="title-bar">
          <div class="title-wrapper">
            <i class="fas fa-user title-icon"></i>
            <h2 class="section-title">Customer Profile</h2>
          </div>
          <div class="header-actions">
            <button class="action-button print" @click="printCustomerDetails">
              <i class="fas fa-print"></i>
              <span>Print Details</span>
              <div class="button-glow"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Success Message -->
    <div v-if="showSuccess" class="alert alert-success">
      {{ successMessage }}
    </div>

    <!-- Error Message -->
    <div v-if="showError" class="alert alert-danger">
      {{ errorMessage }}
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

    <!-- Profile Content -->
    <div v-else-if="customer" class="profile-content">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="profile-image-wrapper">
          <div class="profile-image-container">
            <div class="image-overlay"></div>
            <img :src="customer.customer_image" alt="Customer" class="profile-image" />
          </div>
          <div class="profile-ring"></div>
        </div>

        <div class="profile-info">
          <div class="name-section">
            <h2 class="customer-name">Name: {{ customer.name }}</h2>
            <h3 class="customer-name">Father: {{ customer.father_name }}</h3>
          </div>

          <div class="details-section">
            <div class="detail-item">
              <div class="detail-icon">
                <i class="fas fa-id-card"></i>
              </div>
              <div class="detail-text">
                <span class="detail-label">CNIC: </span>
                <span class="detail-value">{{ customer.cnic }}</span>
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-icon">
                <i class="fas fa-phone"></i>
              </div>
              <div class="detail-text">
                <span class="detail-label">Phone: </span>
                <span class="detail-value">{{ customer.phone_number }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Status & Actions -->
        <div class="status-actions-cell">
          <span class="status-badge" :class="customer.status">{{ customer.status }}</span>
          <div class="action-buttons" v-if="customer.status !== 'delivered'">
            <button
              class="action-button deliver"
              @click="handleDeliver(customer)"
              :disabled="customer.status === 'delivered'"
            >
              <i class="fas fa-check"></i>
              <span>Deliver</span>
            </button>
            <button class="action-button delete" @click="handleDelete(customer)">
              <i class="fas fa-trash"></i>
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab-button', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <i :class="tab.icon"></i>
          {{ tab.name }}
        </button>
      </div>

      <!-- Personal Info Tab -->
      <div v-if="activeTab === 'personal'" class="tab-pane">
        <div class="info-grid">
          <div class="info-card">
            <h4>Personal Details</h4>
            <div class="info-row">
              <span class="label">Name</span>
              <span class="value">{{ customer.name }}</span>
            </div>
            <div class="info-row">
              <span class="label">Father's Name</span>
              <span class="value">{{ customer.father_name }}</span>
            </div>
            <div class="info-row">
              <span class="label">CNIC</span>
              <span class="value">{{ customer.cnic }}</span>
            </div>
            <div class="info-row">
              <span class="label">Phone</span>
              <span class="value">{{ customer.phone_number }}</span>
            </div>
            <div class="info-row">
              <span class="label">Address</span>
              <span class="value">{{ customer.address }}</span>
            </div>
          </div>

          <div class="info-card">
            <h4>Employment Details</h4>
            <div class="info-row">
              <span class="label">Type</span>
              <span class="value">{{ customer.employment_type }}</span>
            </div>
            <div class="info-row">
              <span class="label">Company</span>
              <span class="value">{{ customer.company_name }}</span>
            </div>
            <div class="info-row">
              <span class="label">Experience</span>
              <span class="value">{{ customer.years_of_experience }} years</span>
            </div>
            <div class="info-row">
              <span class="label">Office Address</span>
              <span class="value">{{ customer.office_address }}</span>
            </div>
          </div>

          <div class="info-card">
            <h4>Documents</h4>
            <div class="document-grid">
              <div class="document-item" v-if="customer.cnic_Front_image">
                <img
                  :src="customer.cnic_Front_image"
                  alt="CNIC Front"
                  @click="openImage(customer.cnic_Front_image)"
                />
                <span>CNIC Front</span>
              </div>
              <div class="document-item" v-if="customer.cnic_Back_image">
                <img
                  :src="customer.cnic_Back_image"
                  alt="CNIC Back"
                  @click="openImage(customer.cnic_Back_image)"
                />
                <span>CNIC Back</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sale Details Tab -->
      <div v-if="activeTab === 'sale'" class="tab-pane">
        <div class="info-grid">
          <div class="info-card">
            <h4>Product Details</h4>
            <div class="info-row">
              <span class="label">Item Name</span>
              <span class="value">{{ sale.item_name }}</span>
            </div>
            <div class="info-row">
              <span class="label">Model</span>
              <span class="value">{{ sale.model }}</span>
            </div>
            <div class="info-row">
              <span class="label">Brand</span>
              <span class="value">{{ sale.brand_name }}</span>
            </div>
            <div class="info-row">
              <span class="label">Serial Number</span>
              <span class="value">{{ sale.serial_number || 'N/A' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Category</span>
              <span class="value">{{ sale.category_name || 'N/A' }}</span>
            </div>
          </div>

          <div class="info-card">
            <h4>Payment Details</h4>
            <div class="info-row">
              <span class="label">Product Price</span>
              <span class="value">Rs. {{ sale.price }}</span>
            </div>
            <div class="info-row">
              <span class="label">Advance Payment</span>
              <span class="value success">Rs. {{ sale.advance }}</span>
            </div>
            <div class="info-row">
              <span class="label">Total Price</span>
              <span class="value highlight">Rs. {{ sale.total_price }}</span>
            </div>
            <div class="info-row">
              <span class="label">Installment Price</span>
              <span class="value highlight">Rs. {{ customerAccount.installment_price }}</span>
            </div>
            <div class="info-row">
              <span class="label">Sale Date</span>
              <span class="value">{{ formattedSaleDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Guarantor Tab -->
      <div v-if="activeTab === 'guarantor'" class="tab-pane">
        <div class="info-grid">
          <div class="info-card">
            <h4>Guarantor Details</h4>
            <div class="info-row">
              <span class="label">Name</span>
              <span class="value">{{ guarantors.name }}</span>
            </div>
            <div class="info-row">
              <span class="label">Father's Name</span>
              <span class="value">{{ guarantors.father_name }}</span>
            </div>
            <div class="info-row">
              <span class="label">CNIC</span>
              <span class="value">{{ guarantors.cnic }}</span>
            </div>
            <div class="info-row">
              <span class="label">Phone</span>
              <span class="value">{{ guarantors.phone_number }}</span>
            </div>
            <div class="info-row">
              <span class="label">Address</span>
              <span class="value">{{ guarantors.address }}</span>
            </div>
          </div>

          <div class="info-card">
            <h4>Professional Info</h4>
            <div class="info-row">
              <span class="label">Relationship</span>
              <span class="value">{{ guarantors.relationship }}</span>
            </div>
            <div class="info-row">
              <span class="label">Employment</span>
              <span class="value">{{ guarantors.employment_type }}</span>
            </div>
            <div class="info-row">
              <span class="label">Business/Company</span>
              <span class="value">{{ guarantors.company_name }}</span>
            </div>
            <div class="info-row">
              <span class="label">Office Address</span>
              <span class="value">{{ guarantors.office_address }}</span>
            </div>
          </div>

          <div class="info-card">
            <h4>Documents</h4>
            <div class="document-grid">
              <div class="document-item" v-if="guarantors.cnic_Front_image">
                <img
                  :src="guarantors.cnic_Front_image"
                  alt="CNIC Front"
                  @click="openImage(guarantors.cnic_Front_image)"
                />
                <span>CNIC Front</span>
              </div>
              <div class="document-item" v-if="guarantors.cnic_Back_image">
                <img
                  :src="guarantors.cnic_Back_image"
                  alt="CNIC Back"
                  @click="openImage(guarantors.cnic_Back_image)"
                />
                <span>CNIC Back</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Tab -->
      <div v-if="activeTab === 'account'" class="tab-pane">
        <div class="info-grid">
          <div class="info-card">
            <h4>Account Overview</h4>
            <div class="info-row">
              <span class="label">Product</span>
              <span class="value">{{ customerAccount.product_name }}</span>
            </div>
            <div class="info-row">
              <span class="label">Model</span>
              <span class="value">{{ sale.model }}</span>
            </div>
            <div class="info-row">
              <span class="label">Price</span>
              <span class="value">Rs. {{ customerAccount.installment_total_price }}</span>
            </div>
          </div>

          <div class="info-card">
            <h4>Installment Details</h4>
            <div class="info-row">
              <span class="label">Duration</span>
              <span class="value">{{ customerAccount.installment_duration }} months</span>
            </div>
            <div class="info-row">
              <span class="label">Product</span>
              <span class="value">{{ customerAccount.product_name }}</span>
            </div>
            <div class="info-row">
              <span class="label">Monthly Amount</span>
              <span class="value">Rs. {{ customerAccount.installment_price }}</span>
            </div>
            <div class="info-row">
              <span class="label">Remaining</span>
              <span class="value highlight">Rs. {{ customerAccount.remaining_amount }}</span>
            </div>
            <div class="info-row">
              <span class="label">Paid Amount</span>
              <span class="value success">Rs. {{ customerAccount.amount_paid }}</span>
            </div>
          </div>
        </div>
        <div class="info-card installment-table-card">
          <h4 class="text-center">Installment Table</h4>
          <!-- Success Message -->
          <div v-if="showSuccess" class="alert alert-success">
            {{ successMessage }}
          </div>

          <!-- Error Message -->
          <div v-if="showError" class="alert alert-danger">
            {{ errorMessage }}
          </div>
          <table class="installment-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Product</th>
                <th>Officer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Receiving Data</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(installment, index) in installmentTable" :key="installment.id">
                <td>{{ index + 1 }}</td>
                <td>{{ installment.product_name }}</td>
                <td>{{ installment.recived_officer_name || 'N/A' }}</td>
                <td>{{ formatDate(installment.installment_date) }}</td>
                <td>Rs. {{ installment.installment_price }}</td>
                <td>
                  <span class="status-pill" :class="installment.status">
                    {{ installment.status }}
                  </span>
                </td>
                <td>
                  <span v-if="isUpdateDifferent(installment.created_at, installment.updated_at)">
                    {{ formatDateTime(installment.updated_at) }}
                  </span>
                  <span v-else>-</span>
                </td>
                <td>
                  <button
                    v-if="installment.status === 'pending'"
                    class="action-btn pay-btn"
                    @click="handlePayment(installment)"
                  >
                    Pay Now
                  </button>
                  <span v-else class="paid-text">Paid</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import router from '@/router'

const store = useStore()
const route = useRoute()

// Reactive variables
const customer = ref({})
const sale = ref({})
const customerAccount = ref({})
const guarantors = ref({})
const installmentTable = ref([])
const loading = ref(false)
const error = ref(null)
const successMessage = ref('')
const errorMessage = ref('')
const showSuccess = ref(false)
const showError = ref(false)

// Tabs data
const tabs = [
  { id: 'personal', name: 'Personal Info', icon: 'fas fa-user' },
  { id: 'sale', name: 'Sale Details', icon: 'fas fa-shopping-cart' },
  { id: 'guarantor', name: 'Guarantor', icon: 'fas fa-user-shield' },
  { id: 'account', name: 'Account', icon: 'fas fa-file-invoice-dollar' },
]

const activeTab = ref('personal')

const formattedSaleDate = computed(() => {
  return sale.value.created_at ? sale.value.created_at.split('T')[0] : 'N/A'
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const isUpdateDifferent = (created, updated) => {
  return created !== updated
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

onMounted(async () => {
  const customerId = route.params.customer_id
  if (customerId) {
    loading.value = true
    const result = await store.dispatch('customerStore/fetchCustomerDetails', customerId)

    if (result.success) {
      customer.value = result.data.customer
      sale.value = result.data.sale
      customerAccount.value = result.data.customerAccount
      guarantors.value = result.data.guarantors
      installmentTable.value = result.data.installmentTable || []
    } else {
      error.value = result.message || 'Failed to fetch customer details'
    }
    loading.value = false
  }
})
/************************************ Handle delivered Action ************************************/

const handleDeliver = async (customer) => {
  const result = await store.dispatch('customerStore/updateCustomerStatus', {
    id: customer.id,
    status: 'delivered',
  })

  if (result.success) {
    successMessage.value = 'Customer delivered successfully'
    showSuccess.value = true
    // Refresh the page after 3 seconds
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  } else {
    errorMessage.value = result.message || 'Failed to deliver customer'
    showError.value = true
  }
}

/************************************ Handle delete Action ************************************/
const handleDelete = async (customer) => {
  const confirmDelete = confirm('Are you sure you want to delete this customer?')
  if (!confirmDelete) return

  try {
    const response = await store.dispatch('customerStore/deleteCustomer', customer.id)

    if (response.success) {
      successMessage.value = response.message || 'Customer deleted successfully'
      showSuccess.value = true
      setTimeout(() => {
        showSuccess.value = false
        router.push({ name: 'home' })
      }, 3000)
    } else {
      errorMessage.value = response.message || 'Failed to delete customer'
      showError.value = true
      setTimeout(() => {
        showError.value = false
      }, 3000)
    }
  } catch (error) {
    errorMessage.value = error.message || 'An error occurred while deleting the customer'
    showError.value = true
    setTimeout(() => {
      showError.value = false
    }, 3000)
  }
}

// Function to open images in full size
const openImage = (imageUrl) => {
  if (imageUrl) {
    window.open(imageUrl, '_blank')
  }
}

// Add print function
const printCustomerDetails = () => {
  const printWindow = window.open('', '_blank')

  const content = `
    <html>
      <head>
        <title>Customer Details - ${customer.value.name}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #333;
          }
          .header-text {
            flex: 1;
          }
          .customer-image {
            width: 100px;
            height: 100px;
            border-radius: 10px;
            object-fit: cover;
            margin-left: 20px;
          }
          .title {
            margin: 0;
            color: #2c3e50;
            font-size: 24px;
          }
          .date {
            color: #666;
            font-size: 14px;
            margin-top: 5px;
          }
          .main-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .section {
            margin-bottom: 20px;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #2c3e50;
            border-bottom: 1px solid #dee2e6;
            padding-bottom: 5px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
          }
          .label {
            font-weight: 500;
            color: #666;
          }
          .value {
            color: #333;
          }
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            .main-content {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-text">
            <h1 class="title">Customer Details</h1>
            <p class="date">Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          <img src="${customer.value.customer_image}" alt="Customer" class="customer-image"/>
        </div>

        <div class="main-content">
          <div class="section">
            <div class="section-title">Personal Information</div>
            <div class="info-row">
              <span class="label">Name:</span>
              <span class="value">${customer.value.name}</span>
            </div>
            <div class="info-row">
              <span class="label">Father's Name:</span>
              <span class="value">${customer.value.father_name}</span>
            </div>
            <div class="info-row">
              <span class="label">CNIC:</span>
              <span class="value">${customer.value.cnic}</span>
            </div>
            <div class="info-row">
              <span class="label">Phone:</span>
              <span class="value">${customer.value.phone_number}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Product Details</div>
            <div class="info-row">
              <span class="label">Item:</span>
              <span class="value">${sale.value.item_name}</span>
            </div>
            <div class="info-row">
              <span class="label">Model:</span>
              <span class="value">${sale.value.model}</span>
            </div>
            <div class="info-row">
              <span class="label">Price:</span>
              <span class="value">Rs. ${sale.value.price}</span>
            </div>
            <div class="info-row">
              <span class="label">Advance:</span>
              <span class="value">Rs. ${sale.value.advance}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Guarantor Information</div>
            <div class="info-row">
              <span class="label">Name:</span>
              <span class="value">${guarantors.value.name}</span>
            </div>
            <div class="info-row">
              <span class="label">CNIC:</span>
              <span class="value">${guarantors.value.cnic}</span>
            </div>
            <div class="info-row">
              <span class="label">Phone:</span>
              <span class="value">${guarantors.value.phone_number}</span>
            </div>
            <div class="info-row">
              <span class="label">Relationship:</span>
              <span class="value">${guarantors.value.relationship}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Account Details</div>
            <div class="info-row">
              <span class="label">Monthly:</span>
              <span class="value">Rs. ${customerAccount.value.installment_price}</span>
            </div>
            <div class="info-row">
              <span class="label">Duration:</span>
              <span class="value">${customerAccount.value.installment_duration} months</span>
            </div>
            <div class="info-row">
              <span class="label">Remaining:</span>
              <span class="value">Rs. ${customerAccount.value.remaining_amount}</span>
            </div>
            <div class="info-row">
              <span class="label">Paid:</span>
              <span class="value">Rs. ${customerAccount.value.amount_paid}</span>
            </div>
          </div>
        </div>
      </body>
    </html>
  `

  printWindow.document.write(content)
  printWindow.document.close()

  setTimeout(() => {
    printWindow.print()
  }, 250)
}
</script>

<style scoped>
/* Base Styles */
.customer-profile {
  padding: 20px;
  background-color: #f8f9fa;
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

/* Profile Content Section */
.profile-content {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 40px;
  margin-bottom: 40px;
  padding: 30px;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  position: relative;
  overflow: hidden;
}

.profile-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transform: translateX(-100%);
  animation: shine 3s infinite;
}

/* Profile Image Styles */
.profile-image-wrapper {
  position: relative;
  padding: 8px;
}

.profile-image-container {
  width: 180px;
  height: 180px;
  border-radius: 30px;
  overflow: hidden;
  position: relative;
  background: linear-gradient(145deg, #ffffff, #e6e6e6);
  box-shadow:
    -8px -8px 20px #ffffff,
    8px 8px 20px rgba(0, 0, 0, 0.1);
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.profile-image:hover {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, rgba(65, 88, 208, 0.1), rgba(200, 80, 192, 0.1));
  z-index: 1;
}

.profile-ring {
  position: absolute;
  inset: 0;
  border-radius: 30px;
  padding: 2px;
  background: linear-gradient(45deg, #4158d0, #c850c0);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

/* Profile Status */
.profile-status {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #10b981;
  border: 2px solid white;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
  z-index: 2;
}

/* Profile Info */
.profile-info {
  flex: 1;
}

.name-section {
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 1rem;
}

.customer-name {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #3a7bd5, #9500ff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0px 2px 10px rgba(154, 85, 255, 0.2);
  letter-spacing: -0.03em;
  line-height: 1.1;
  position: relative;
  padding-bottom: 5px;
}

.customer-name::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 115px;
  height: 3px;
  background: #9500ff;
  border-radius: 5px;
}

.father-name {
  font-size: 1.1rem;
  margin: 10px 0 0 0;
  color: #555;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.father-name::before {
  content: '•';
  margin-right: 8px;
  color: #9500ff;
  font-size: 1.5rem;
}

.father-name span {
  background: linear-gradient(135deg, #3a7bd5, #9500ff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
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
  font-size: 0.9rem;
  font-weight: 500;
}

.status-badge.delivered {
  background-color: #10b981;
  color: white;
}
.status-badge.confirmed {
  background: #00cc66;
  color: #fff;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.3s ease;
}

.action-button.deliver {
  background-color: #3b82f6;
  color: white;
}

.action-button.deliver:hover {
  background-color: #2563eb;
}

.action-button.delete {
  background-color: #ef4444;
  color: white;
}

.action-button.delete:hover {
  background-color: #dc2626;
}

.action-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
/* Details Section */
.details-section {
  display: flex;
  gap: 30px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.detail-item:hover {
  transform: translateY(-2px);
}

.detail-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4158d0, #c850c0);
  border-radius: 12px;
  color: white;
  font-size: 18px;
}

/* Tab Navigation */
.tab-navigation {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.tab-button {
  padding: 12px 24px;
  border: none;
  background: none;
  color: #666;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-button.active {
  color: #4158d0;
  position: relative;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #4158d0;
}

/* Info Grid and Cards */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.info-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #eee;
}

.info-card h4 {
  color: #2c3e50;
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.info-row:last-child {
  border-bottom: none;
}

/* Labels and Values */
.label {
  color: #666;
  font-weight: 500;
}

.value {
  color: #2c3e50;
  font-weight: 600;
}

.highlight {
  color: #4158d0;
}

.success {
  color: #10b981;
}

/* Document Grid */
.document-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 10px;
}

.document-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.document-item img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.document-item img:hover {
  transform: scale(1.05);
}

.document-item span {
  font-size: 0.9rem;
  color: #666;
}

/* Animations */
@keyframes shine {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    padding: 20px;
    gap: 20px;
    text-align: center;
  }

  .details-section {
    flex-direction: column;
    gap: 15px;
  }

  .detail-item {
    width: 100%;
    justify-content: center;
  }

  .tab-navigation {
    overflow-x: auto;
    padding-bottom: 5px;
  }

  .tab-button {
    padding: 10px 15px;
    font-size: 14px;
    white-space: nowrap;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}

/* Add print button hover effect */
.action-button.print:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Installment Table Styles */
.installment-table-card {
  margin-top: 20px;
  overflow-x: auto;
}

.installment-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  background: white;
  border-radius: 8px;
}

.installment-table th,
.installment-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #edf2f7;
}

.installment-table th {
  background: #f8fafc;
  color: #4a5568;
  font-weight: 600;
  font-size: 0.875rem;
}

.installment-table tr:hover {
  background: #f8fafc;
}

.status-pill {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-pill.pending {
  background: #fff7ed;
  color: #c2410c;
}

.status-pill.paid {
  background: #f0fdf4;
  color: #15803d;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.pay-btn {
  background: #3b82f6;
  color: white;
}

.pay-btn:hover {
  background: #2563eb;
}

.paid-text {
  color: #15803d;
  font-size: 0.75rem;
  font-weight: 500;
}

.installment-table td {
  white-space: nowrap;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
