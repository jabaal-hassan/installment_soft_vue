<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header Section -->
    <div class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-2xl font-bold text-gray-800">Pending Installments</h1>
        <p class="text-gray-500">Manage your upcoming customer payments</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Due</p>
              <p class="text-xl font-bold">Rs. {{ calculateTotalDue() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Pending Installments</p>
              <p class="text-xl font-bold">{{ pendingInstallments.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100 text-red-500 mr-4">
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Overdue</p>
              <p class="text-xl font-bold">{{ countOverdueInstallments() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filter Controls -->
      <div class="bg-white rounded-lg shadow mb-8">
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-800">Filters</h2>
        </div>
        <div class="p-4">
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex-1 min-w-48">
              <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search by customer name or ID"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div class="w-48">
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                v-model="statusFilter"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div class="w-48">
              <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                v-model="dateFilter"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Dates</option>
                <option value="this-week">This Week</option>
                <option value="next-week">Next Week</option>
                <option value="this-month">This Month</option>
              </select>
            </div>

            <div class="flex-1 min-w-40 flex items-end">
              <button
                @click="resetFilters"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Installments Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div v-if="filteredInstallments.length > 0">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr
                  class="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  <th class="px-6 py-3">Customer</th>
                  <th class="px-6 py-3">Product</th>
                  <th class="px-6 py-3">Amount</th>
                  <th class="px-6 py-3">Status</th>
                  <th class="px-6 py-3">Due Date</th>
                  <th class="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="installment in filteredInstallments"
                  :key="installment.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div
                        class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center"
                      >
                        <span class="text-gray-500 font-medium">{{
                          getInitials(installment.customer.name)
                        }}</span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ installment.customer.name }}
                        </div>
                        <div class="text-sm text-gray-500">ID: {{ installment.customer.id }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">{{ installment.product_name }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900">
                      Rs. {{ formatPrice(installment.installment_price) }}
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      :class="getStatusClass(installment)"
                      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    >
                      {{ isOverdue(installment) ? 'Overdue' : installment.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">
                      {{ formatDate(installment.installment_date) }}
                    </div>
                    <div class="text-xs text-gray-500">{{ getDaysUntilDue(installment) }}</div>
                  </td>
                  <td class="px-6 py-4 text-right space-x-2">
                    <button
                      @click="viewDetails(installment)"
                      class="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      View
                    </button>
                    <button
                      @click="markPaid(installment.id)"
                      class="text-green-600 hover:text-green-900 text-sm font-medium"
                    >
                      Mark Paid
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700">
                Showing <span class="font-medium">1</span> to
                <span class="font-medium">{{ filteredInstallments.length }}</span> of
                <span class="font-medium">{{ pendingInstallments.length }}</span> results
              </div>
              <div class="flex-1 flex justify-end">
                <button
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="p-8 text-center">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No installments found</h3>
          <p class="mt-1 text-sm text-gray-500">No pending installments match your filters.</p>
          <div class="mt-6">
            <button
              @click="resetFilters"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Details Modal -->
    <div v-if="selectedInstallment" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
      >
        <div class="fixed inset-0 transition-opacity" @click="selectedInstallment = null">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full"
        >
          <div
            class="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center"
          >
            <h3 class="text-lg leading-6 font-medium text-gray-900">Installment Details</h3>
            <button @click="selectedInstallment = null" class="text-gray-400 hover:text-gray-500">
              <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
              <!-- Customer Information -->
              <div class="col-span-2">
                <div class="flex items-center mb-4">
                  <div
                    class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg"
                  >
                    {{ getInitials(selectedInstallment.customer.name) }}
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">
                      {{ selectedInstallment.customer.name }}
                    </h3>
                    <p class="text-sm text-gray-500">
                      Customer ID: {{ selectedInstallment.customer.id }}
                    </p>
                  </div>
                </div>

                <div class="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Personal Information
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm text-gray-500">CNIC</p>
                      <p class="text-sm font-medium">{{ selectedInstallment.customer.cnic }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Father's Name</p>
                      <p class="text-sm font-medium">
                        {{ selectedInstallment.customer.father_name }}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Phone</p>
                      <p class="text-sm font-medium">
                        {{ selectedInstallment.customer.phone_number }}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Address</p>
                      <p class="text-sm font-medium">{{ selectedInstallment.customer.address }}</p>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Employment Details
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm text-gray-500">Employment Type</p>
                      <p class="text-sm font-medium">
                        {{ selectedInstallment.customer.employment_type }}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Company</p>
                      <p class="text-sm font-medium">
                        {{ selectedInstallment.customer.company_name }}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Experience</p>
                      <p class="text-sm font-medium">
                        {{ selectedInstallment.customer.years_of_experience }} years
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Office Address</p>
                      <p class="text-sm font-medium">
                        {{ selectedInstallment.customer.office_address }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Installment Information -->
              <div>
                <div class="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Installment Details
                  </h4>
                  <div>
                    <p class="text-sm text-gray-500">Product</p>
                    <p class="text-sm font-medium mb-2">{{ selectedInstallment.product_name }}</p>

                    <p class="text-sm text-gray-500">Amount</p>
                    <p class="text-lg font-bold text-gray-900 mb-2">
                      Rs. {{ formatPrice(selectedInstallment.installment_price) }}
                    </p>

                    <p class="text-sm text-gray-500">Status</p>
                    <p class="mb-2">
                      <span
                        :class="getStatusClass(selectedInstallment)"
                        class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      >
                        {{
                          isOverdue(selectedInstallment) ? 'Overdue' : selectedInstallment.status
                        }}
                      </span>
                    </p>

                    <p class="text-sm text-gray-500">Due Date</p>
                    <p class="text-sm font-medium mb-2">
                      {{ formatDate(selectedInstallment.installment_date) }}
                    </p>
                    <p class="text-sm text-gray-500">{{ getDaysUntilDue(selectedInstallment) }}</p>
                  </div>
                </div>

                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Timeline
                  </h4>
                  <div class="space-y-3">
                    <div class="flex items-start">
                      <div class="flex-shrink-0">
                        <div class="h-2 w-2 rounded-full bg-green-500 mt-1.5"></div>
                      </div>
                      <div class="ml-3">
                        <p class="text-xs font-medium text-gray-900">Created</p>
                        <p class="text-xs text-gray-500">
                          {{ formatDateTime(selectedInstallment.created_at) }}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-start">
                      <div class="flex-shrink-0">
                        <div class="h-2 w-2 rounded-full bg-blue-500 mt-1.5"></div>
                      </div>
                      <div class="ml-3">
                        <p class="text-xs font-medium text-gray-900">Last Updated</p>
                        <p class="text-xs text-gray-500">
                          {{ formatDateTime(selectedInstallment.updated_at) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="markPaid(selectedInstallment.id)"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Mark as Paid
            </button>
            <button
              @click="selectedInstallment = null"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pendingInstallments: [],
      selectedInstallment: null,
      searchQuery: '',
      statusFilter: 'all',
      dateFilter: 'all',
      today: new Date(),
    }
  },

  created() {
    // Sample data - in a real app, fetch from API
    this.pendingInstallments = [
      {
        id: 49214,
        customer_id: 76,
        customer_account_id: 1,
        recived_officer_id: 15,
        product_name: 'Samsung Galaxy S36',
        status: 'pending',
        installment_date: '2025-04-10',
        installment_price: '3000.00',
        created_at: '2025-03-11T01:38:01.000000Z',
        updated_at: '2025-04-05T23:29:47.000000Z',
        customer: {
          id: 76,
          name: 'Jabal Ahmad',
          father_name: 'Javed Hassan',
          sell_officer_id: 15,
          inquiry_officer_id: 35,
          branch_id: 2,
          phone_number: '03359373706',
          cnic: '3460309524906',
          address: '123 Street, City, Country',
          office_address: 'Office Building, 4th Floor',
          employment_type: 'Private Job',
          company_name: 'Tech Solutions',
          years_of_experience: 3,
          cnic_Front_image: 'customers/cnic_images/sample-0_202503102154.jpg',
          cnic_Back_image: 'customers/cnic_images/screenshot-2024-09-16-193548_202503102154.png',
          customer_image: 'customers/customer_images/wallpaperflarecom-wallpaper_202503102154.jpg',
          check_image: null,
          video: null,
          finger_print: null,
          status: 'delivered',
          deleted_at: null,
          created_at: '2025-03-10T21:39:54.000000Z',
          updated_at: '2025-03-11T01:38:01.000000Z',
        },
      },
      {
        id: 49215,
        customer_id: 82,
        customer_account_id: 2,
        recived_officer_id: 16,
        product_name: 'iPhone 18 Pro',
        status: 'pending',
        installment_date: '2025-04-15',
        installment_price: '5000.00',
        created_at: '2025-03-15T08:22:15.000000Z',
        updated_at: '2025-04-01T14:10:30.000000Z',
        customer: {
          id: 82,
          name: 'Areeba Khan',
          father_name: 'Tariq Khan',
          sell_officer_id: 16,
          inquiry_officer_id: 36,
          branch_id: 1,
          phone_number: '03125678901',
          cnic: '3520157894562',
          address: '45 Park Avenue, Downtown',
          office_address: 'Business Center, Suite 302',
          employment_type: 'Government',
          company_name: 'Ministry of Finance',
          years_of_experience: 5,
          cnic_Front_image: 'customers/cnic_images/cnic_front_202503150822.jpg',
          cnic_Back_image: 'customers/cnic_images/cnic_back_202503150822.png',
          customer_image: 'customers/customer_images/profile_202503150822.jpg',
          check_image: null,
          video: null,
          finger_print: null,
          status: 'delivered',
          deleted_at: null,
          created_at: '2025-03-15T08:22:15.000000Z',
          updated_at: '2025-03-15T08:22:15.000000Z',
        },
      },
      {
        id: 49216,
        customer_id: 90,
        customer_account_id: 3,
        recived_officer_id: 18,
        product_name: 'MacBook Pro M4',
        status: 'pending',
        installment_date: '2025-04-02',
        installment_price: '8500.00',
        created_at: '2025-03-20T11:45:33.000000Z',
        updated_at: '2025-03-28T09:17:22.000000Z',
        customer: {
          id: 90,
          name: 'Hamza Ali',
          father_name: 'Naveed Ali',
          sell_officer_id: 18,
          inquiry_officer_id: 38,
          branch_id: 3,
          phone_number: '03009876543',
          cnic: '3740512398745',
          address: '78 Green Street, New Town',
          office_address: 'Tech Park, Building B',
          employment_type: 'Self-employed',
          company_name: 'Ali Enterprises',
          years_of_experience: 8,
          cnic_Front_image: 'customers/cnic_images/cnic_front_202503201145.jpg',
          cnic_Back_image: 'customers/cnic_images/cnic_back_202503201145.png',
          customer_image: 'customers/customer_images/profile_202503201145.jpg',
          check_image: null,
          video: null,
          finger_print: null,
          status: 'delivered',
          deleted_at: null,
          created_at: '2025-03-20T11:45:33.000000Z',
          updated_at: '2025-03-20T11:45:33.000000Z',
        },
      },
    ]
  },

  computed: {
    filteredInstallments() {
      let result = [...this.pendingInstallments]

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(
          (item) =>
            item.customer.name.toLowerCase().includes(query) ||
            item.customer.id.toString().includes(query) ||
            item.id.toString().includes(query),
        )
      }

      // Apply status filter
      if (this.statusFilter === 'overdue') {
        result = result.filter((item) => this.isOverdue(item))
      } else if (this.statusFilter === 'pending') {
        result = result.filter((item) => !this.isOverdue(item) && item.status === 'pending')
      }

      // Apply date filter
      if (this.dateFilter !== 'all') {
        const today = new Date()
        const thisWeekStart = new Date(today)
        thisWeekStart.setDate(today.getDate() - today.getDay())

        const nextWeekStart = new Date(thisWeekStart)
        nextWeekStart.setDate(thisWeekStart.getDate() + 7)

        const nextWeekEnd = new Date(nextWeekStart)
        nextWeekEnd.setDate(nextWeekStart.getDate() + 6)

        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
        const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1)

        result = result.filter((item) => {
          const dueDate = new Date(item.installment_date)

          if (this.dateFilter === 'this-week') {
            return dueDate >= thisWeekStart && dueDate < nextWeekStart
          } else if (this.dateFilter === 'next-week') {
            return dueDate >= nextWeekStart && dueDate <= nextWeekEnd
          } else if (this.dateFilter === 'this-month') {
            return dueDate >= thisMonthStart && dueDate < nextMonthStart
          }
          return true
        })
      }

      return result
    },
  },

  methods: {
    calculateTotalDue() {
      return this.filteredInstallments
        .reduce((total, item) => {
          return total + parseFloat(item.installment_price)
        }, 0)
        .toFixed(2)
    },

    countOverdueInstallments() {
      return this.filteredInstallments.filter((item) => this.isOverdue(item)).length
    },

    isOverdue(installment) {
      const dueDate = new Date(installment.installment_date)
      return dueDate < this.today && installment.status === 'pending'
    },

    getStatusClass(installment) {
      if (this.isOverdue(installment)) {
        return 'bg-red-100 text-red-800'
      }
      return 'bg-yellow-100 text-yellow-800'
    },

    formatPrice(price) {
      return parseFloat(price)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },

    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return new Date(dateString).toLocaleDateString(undefined, options)
    },

    formatDateTime(dateTimeString) {
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
      return new Date(dateTimeString).toLocaleDateString(undefined, options)
    },

    getDaysUntilDue(installment) {
      const dueDate = new Date(installment.installment_date)
      const diffTime = dueDate - this.today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 0) {
        return `${Math.abs(diffDays)} days overdue`
      } else if (diffDays === 0) {
        return 'Due today'
      } else {
        return `Due in ${diffDays} days`
      }
    },

    getInitials(name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    },

    resetFilters() {
      this.searchQuery = ''
      this.statusFilter = 'all'
      this.dateFilter = 'all'
    },

    viewDetails(installment) {
      this.selectedInstallment = installment
    },

    markPaid(id) {
      // In a real app, this would call an API
      const index = this.pendingInstallments.findIndex((i) => i.id === id)
      if (index !== -1) {
        this.pendingInstallments[index].status = 'paid'
        this.pendingInstallments = [...this.pendingInstallments] // Trigger reactivity
      }
    },
  },
}
</script>
