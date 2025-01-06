<template>
  <div class="modal fade" id="editInventoryModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Inventory Item</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="row g-3">
              <!-- Item Name -->
              <div class="col-md-6">
                <label class="form-label">Item Name</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="form.item_name"
                  :class="{ 'is-invalid': errors.item_name }"
                  required
                />
                <div class="invalid-feedback">{{ errors.item_name }}</div>
              </div>

              <!-- Category -->
              <div class="col-md-6">
                <label class="form-label">Category</label>
                <select class="form-select" v-model="form.category_id" required>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>

              <!-- Brand -->
              <div class="col-md-6">
                <label class="form-label">Brand</label>
                <select class="form-select" v-model="form.brand_id" required>
                  <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                    {{ brand.name }}
                  </option>
                </select>
              </div>

              <!-- Model -->
              <div class="col-md-6">
                <label class="form-label">Model</label>
                <input type="text" class="form-control" v-model="form.model" required />
              </div>

              <!-- Serial Number -->
              <div class="col-md-6">
                <label class="form-label">Serial Number</label>
                <input type="text" class="form-control" v-model="form.serial_number" />
              </div>

              <!-- Price -->
              <div class="col-md-6">
                <label class="form-label">Price</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="form.price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <!-- Quantity -->
              <div class="col-md-6">
                <label class="form-label">Quantity</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="form.quantity"
                  min="0"
                  required
                />
              </div>

              <!-- Branch -->
              <div class="col-md-6">
                <label class="form-label">Branch</label>
                <select class="form-select" v-model="form.branch_id" required>
                  <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                    {{ branch.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="mt-4">
              <button type="submit" class="btn btn-primary me-2" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
                Save Changes
              </button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import bootstrap from 'bootstrap'
import { useStore } from 'vuex'

const props = defineProps({
  item: Object,
  categories: Array,
  brands: Array,
  branches: Array
})

const emit = defineEmits(['updated'])
const store = useStore()

const form = ref({
  item_name: '',
  category_id: '',
  brand_id: '',
  model: '',
  serial_number: '',
  price: 0,
  quantity: 0,
  branch_id: ''
})

const errors = ref({})
const loading = ref(false)

// Watch for changes in item prop
watch(() => props.item, (newItem) => {
  if (newItem) {
    form.value = { ...newItem }
  }
}, { deep: true })

const validateForm = () => {
  errors.value = {}

  if (!form.value.item_name?.trim()) {
    errors.value.item_name = 'Item name is required'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    const response = await store.dispatch('updateInventory', {
      id: props.item.id,
      ...form.value
    })

    if (response.success) {
      emit('updated')
      const modal = document.getElementById('editInventoryModal')
      const bootstrapModal = bootstrap.Modal.getInstance(modal)
      bootstrapModal.hide()
    }
  } catch (error) {
    console.error('Update error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-body {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}
</style>
