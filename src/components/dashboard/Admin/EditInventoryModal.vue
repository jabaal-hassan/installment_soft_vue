<template>
  <div class="modal fade" id="editInventoryModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content light-modal">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-edit title-icon"></i>
            Edit Inventory Item
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="row g-4">
              <!-- Item Name -->
              <div class="col-md-6">
                <div class="form-floating modern-input">
                  <input
                    type="text"
                    class="form-control"
                    id="itemName"
                    v-model="formData.item_name"
                    required
                  />
                  <label for="itemName">Item Name</label>
                </div>
              </div>

              <!-- Branch -->
              <div class="col-md-6" v-if="userRole !== 'branch_admin'">
                <div class="form-floating modern-input">
                  <select
                    class="form-select"
                    id="branch"
                    v-model="formData.branch_id"
                    :disabled="userRole === 'branch_admin'"
                    required
                  >
                    <option value="">Select Branch</option>
                    <option v-for="branch in filteredBranches" :key="branch.id" :value="branch.id">
                      {{ branch.name }}
                    </option>
                  </select>
                  <label for="branch">Branch</label>
                </div>
              </div>

              <!-- Category -->
              <div class="col-md-6">
                <div class="form-floating modern-input">
                  <select class="form-select" id="category" v-model="formData.category_id" required>
                    <option value="">Select Category</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                  <label for="category">Category</label>
                </div>
              </div>

              <!-- Brand -->
              <div class="col-md-6">
                <div class="form-floating modern-input">
                  <select class="form-select" id="brand" v-model="formData.brand_id" required>
                    <option value="">Select Brand</option>
                    <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                      {{ brand.name }}
                    </option>
                  </select>
                  <label for="brand">Brand</label>
                </div>
              </div>

              <!-- Model -->
              <div class="col-md-6">
                <div class="form-floating modern-input">
                  <input
                    type="text"
                    class="form-control"
                    id="model"
                    v-model="formData.model"
                    required
                  />
                  <label for="model">Model</label>
                </div>
              </div>

              <!-- Serial Number -->
              <div class="col-md-6">
                <div class="form-floating modern-input">
                  <input
                    type="text"
                    class="form-control"
                    id="serialNumber"
                    v-model="formData.serial_number"
                    required
                  />
                  <label for="serialNumber">Serial Number</label>
                </div>
              </div>

              <!-- Color -->
              <div class="col-md-6">
                <div class="form-floating modern-input">
                  <input type="text" class="form-control" id="color" v-model="formData.color" />
                  <label for="color">Color</label>
                </div>
              </div>

              <!-- Quantity -->
              <div class="col-md-6">
                <div class="form-floating modern-input">
                  <input
                    type="number"
                    class="form-control"
                    id="quantity"
                    v-model="formData.quantity"
                    required
                    min="0"
                  />
                  <label for="quantity">Quantity</label>
                </div>
              </div>

              <!-- Price -->
              <div class="col-md-6">
                <div class="form-floating modern-input">
                  <input
                    type="number"
                    class="form-control"
                    id="price"
                    v-model="formData.price"
                    required
                    min="0"
                  />
                  <label for="price">Price</label>
                </div>
              </div>

              <!-- Description -->
              <div class="col-12">
                <div class="form-floating modern-input">
                  <textarea
                    class="form-control"
                    id="description"
                    v-model="formData.description"
                    rows="3"
                    style="height: 100px"
                  ></textarea>
                  <label for="description">Description</label>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="submit" class="btn btn-gradient" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { Modal } from 'bootstrap'

const store = useStore()
const userRole = computed(() => store.state.user?.role)
const userBranchId = computed(() => store.state.user?.branch_id)

// Filter branches based on user role
const filteredBranches = computed(() => {
  if (userRole.value === 'branch_admin') {
    return props.branches.filter((branch) => branch.id === userBranchId.value)
  }
  return props.branches
})

const props = defineProps({
  item: Object,
  categories: Array,
  brands: Array,
  branches: Array,
})

const emit = defineEmits(['update:item', 'updated'])
const loading = ref(false)

const formData = ref({
  item_name: '',
  category_id: '',
  brand_id: '',
  model: '',
  serial_number: '',
  color: '',
  description: '',
  quantity: 0,
  price: 0,
})

// Initialize form data when item prop changes
const initializeForm = () => {
  if (props.item) {
    formData.value = { ...props.item }
  }
}

// Watch for item changes
watch(() => props.item, initializeForm, { immediate: true })

const handleSubmit = async () => {
  try {
    loading.value = true
    const response = await store.dispatch('updateInventory', {
      id: props.item.id,
      data: formData.value,
    })

    if (response.success) {
      emit('updated')
      // Close modal using Bootstrap
      const modal = Modal.getInstance(document.getElementById('editInventoryModal'))
      modal.hide()
    } else {
      alert(response.message || 'Failed to update inventory')
    }
  } catch (error) {
    console.error('Update error:', error)
    alert('Failed to update inventory')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.light-modal {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: none;
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(to right, #f8f9fa, #ffffff);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 20px 25px;
}

.modal-title {
  color: #2c3e50;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-icon {
  color: #4158d0;
  font-size: 1.2rem;
}

.modal-body {
  padding: 30px;
  background: #ffffff;
}

.modern-input {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 5px;
}

.modern-input:hover {
  border-color: #4158d0;
  box-shadow: 0 2px 8px rgba(65, 88, 208, 0.1);
}

.modern-input:focus-within {
  border-color: #4158d0;
  box-shadow: 0 4px 12px rgba(65, 88, 208, 0.15);
}

.form-control,
.form-select {
  height: 60px;
  border: none;
  padding: 1.5rem 1rem 0.5rem;
  font-size: 1rem;
  background: transparent;
  color: #2c3e50;
}

.form-control:focus,
.form-select:focus {
  box-shadow: none;
  background: transparent;
}

.form-floating > label {
  padding: 1rem;
  color: #6c757d;
  font-size: 0.9rem;
}

.form-floating > .form-control:focus ~ label,
.form-floating > .form-control:not(:placeholder-shown) ~ label,
.form-floating > .form-select ~ label {
  transform: scale(0.85) translateY(-0.75rem) translateX(0.15rem);
  color: #4158d0;
  opacity: 1;
}

textarea.form-control {
  min-height: 120px;
  resize: none;
}

.modal-footer {
  background: #f8f9fa;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding: 20px 25px;
}

.btn-gradient {
  background: linear-gradient(135deg, #4158d0, #c850c0);
  border: none;
  padding: 12px 30px;
  border-radius: 12px;
  font-weight: 500;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(65, 88, 208, 0.2);
}

.btn-gradient:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(65, 88, 208, 0.3);
}

.btn-gradient:disabled {
  background: linear-gradient(135deg, #9ea4c9, #d4b6d4);
  opacity: 0.7;
}

.btn-outline-secondary {
  border: 1px solid #dee2e6;
  border-radius: 12px;
  padding: 12px 30px;
  font-weight: 500;
  color: #6c757d;
  transition: all 0.3s ease;
}

.btn-outline-secondary:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
}

/* Updated Select Styling */
.form-select {
  height: 60px;
  border: none;
  padding: 1.5rem 1rem 0.5rem;
  font-size: 1rem;
  background-color: #ffffff;
  color: #2c3e50;
  border-radius: 12px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%234158D0' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 16px 12px;
  cursor: pointer;
}

.form-select:focus {
  box-shadow: none;
  border-color: #4158d0;
}

/* Dropdown Options Styling */
.form-select option {
  color: #2c3e50;
  padding: 12px;
  font-size: 1rem;
  background: white;
}

/* Select Container Styling */
.modern-input .form-select {
  border: none;
  background-color: transparent;
}

.modern-input:has(.form-select) {
  background: #ffffff;
  transition: all 0.3s ease;
}

.modern-input:has(.form-select:hover) {
  border-color: #4158d0;
  box-shadow: 0 2px 8px rgba(65, 88, 208, 0.1);
}

.modern-input:has(.form-select:focus) {
  border-color: #4158d0;
  box-shadow: 0 4px 12px rgba(65, 88, 208, 0.15);
}

/* Remove default select arrow in IE */
select::-ms-expand {
  display: none;
}

/* Custom arrow styling */
.modern-input::after {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #4158d0;
  pointer-events: none;
}

/* Remove spinners from number inputs */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
