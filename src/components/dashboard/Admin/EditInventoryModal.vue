<template>
  <div class="modal fade" id="editInventoryModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Inventory Item</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <!-- Item Name -->
            <div class="mb-3">
              <label class="form-label">Item Name</label>
              <input type="text" class="form-control" v-model="formData.item_name" required />
            </div>

            <!-- Branch (Only for admin and company_admin) -->
            <div class="mb-3" v-if="userRole !== 'branch_admin'">
              <label class="form-label">Branch</label>
              <select
                class="form-select"
                v-model="formData.branch_id"
                :disabled="userRole === 'branch_admin'"
                required
              >
                <option v-for="branch in filteredBranches" :key="branch.id" :value="branch.id">
                  {{ branch.name }}
                </option>
              </select>
            </div>

            <!-- Category -->
            <div class="mb-3">
              <label class="form-label">Category</label>
              <select class="form-select" v-model="formData.category_id" required>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <!-- Brand -->
            <div class="mb-3">
              <label class="form-label">Brand</label>
              <select class="form-select" v-model="formData.brand_id" required>
                <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                  {{ brand.name }}
                </option>
              </select>
            </div>

            <!-- Model -->
            <div class="mb-3">
              <label class="form-label">Model</label>
              <input type="text" class="form-control" v-model="formData.model" required />
            </div>

            <!-- Serial Number -->
            <div class="mb-3">
              <label class="form-label">Serial Number</label>
              <input type="text" class="form-control" v-model="formData.serial_number" required />
            </div>

            <!-- Color -->
            <div class="mb-3">
              <label class="form-label">Color</label>
              <input type="text" class="form-control" v-model="formData.color" />
            </div>

            <!-- Description -->
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea class="form-control" v-model="formData.description" rows="3"></textarea>
            </div>

            <!-- Quantity -->
            <div class="mb-3">
              <label class="form-label">Quantity</label>
              <input
                type="number"
                class="form-control"
                v-model="formData.quantity"
                required
                min="0"
              />
            </div>

            <!-- Price -->
            <div class="mb-3">
              <label class="form-label">Price</label>
              <input type="number" class="form-control" v-model="formData.price" required min="0" />
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
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
