<template>
  <div class="modal fade" id="viewQRModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Item QR Code</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body text-center">
          <h6 class="mb-3">{{ item?.item_name }}</h6>
          <qrcode-vue :value="qrValue" :size="200" level="H" class="mx-auto mb-3" />
          <div class="text-muted small mb-3">
            Serial: {{ item?.serial_number }}<br />
            Model: {{ item?.model }}
          </div>
          <button class="btn btn-primary" @click="downloadQR">
            <i class="fas fa-download me-2"></i>Download QR
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import QrcodeVue from 'qrcode.vue'

const props = defineProps({
  item: Object,
  categories: Array,
  brands: Array,
})

// Helper functions to get names
const getCategoryName = (categoryId) => {
  const category = props.categories?.find((c) => c.id === categoryId)
  return category ? category.name : 'N/A'
}

const getBrandName = (brandId) => {
  const brand = props.brands?.find((b) => b.id === brandId)
  return brand ? brand.name : 'N/A'
}

// Create QR value with item details
const qrValue = computed(() => {
  if (!props.item) return ''
  return JSON.stringify({
    name: props.item.item_name,
    category: getCategoryName(props.item.category_id),
    brand: getBrandName(props.item.brand_id),
    model: props.item.model,
    price: props.item.price,
    color: props.item.color || 'N/A',
  })
})

// Download QR code
const downloadQR = () => {
  const canvas = document.querySelector('#viewQRModal canvas')
  if (canvas) {
    const link = document.createElement('a')
    link.download = `qr-${props.item.item_name}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }
}
</script>
