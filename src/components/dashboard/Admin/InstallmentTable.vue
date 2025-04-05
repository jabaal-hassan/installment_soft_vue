<template>
  <div class="installment-table">
    <h1>Installment Table</h1>
    <table>
      <thead>
        <tr>
          <th>Installment ID</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <!-- <tr v-for="installment in installments" :key="installment.id">
          <td>{{ installment.id }}</td>
          <td>{{ installment.amount }}</td>
          <td>{{ installment.status }}</td>
          <td>{{ installment.date }}</td>
        </tr> -->
      </tbody>
    </table>
  </div>
</template>
<script setup>
// import { ref } from 'vue'
// import { useStore } from 'vuex'
// import { useRoute } from 'vue-router'
// import { useFetchInstallments } from '@/composables/useFetchInstallments'

// const store = useStore()
// const route = useRoute()
// const userRole = store.getters.getUserRole
// const installments = ref([])

// const fetchInstallments = async () => {
//   try {
//     const response = await useFetchInstallments(userRole)
//     installments.value = response.data
//   } catch (error) {
//     console.error('Error fetching installments:', error)
//   }
// }
</script>
<style scoped>
.installment-table {
  padding: 20px;
  background-color: #f8f9fe;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
tr:nth-child(even) {
  background-color: #f9f9f9;
}
tr:hover {
  background-color: #ddd;
}
th {
  cursor: pointer;
}
th:hover {
  background-color: #ddd;
}
th:active {
  background-color: #ccc;
}
th:focus {
  outline: none;
}
th:focus-visible {
  outline: 2px solid #007bff;
}
th:focus:not(:focus-visible) {
  outline: none;
}
th:focus-within {
  outline: 2px solid #007bff;
}
th:focus-within:not(:focus-visible) {
  outline: none;
}
th:focus-within:hover {
  background-color: #ddd;
}
th:focus-within:active {
  background-color: #ccc;
}
th:focus-within:focus {
  outline: 2px solid #007bff;
}
th:focus-within:focus:not(:focus-visible) {
  outline: none;
}
th:focus-within:focus-visible {
  outline: 2px solid #007bff;
}
</style>
