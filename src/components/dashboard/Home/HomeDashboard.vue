<template>
  <div class="dashboard">
    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card customers">
        <div class="stat-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-content">
          <h3>Total Customers</h3>
          <div class="stat-value">{{ statistics.totalCustomers || 0 }}</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            <span>12% from last month</span>
          </div>
        </div>
      </div>

      <div class="stat-card sales">
        <div class="stat-icon">
          <i class="fas fa-shopping-cart"></i>
        </div>
        <div class="stat-content">
          <h3>Total Sales</h3>
          <div class="stat-value">Rs. {{ statistics.totalSales || 0 }}</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            <span>8% from last month</span>
          </div>
        </div>
      </div>

      <div class="stat-card pending">
        <div class="stat-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stat-content">
          <h3>Pending Approvals</h3>
          <div class="stat-value">{{ statistics.pendingApprovals || 0 }}</div>
          <div class="stat-change neutral">
            <i class="fas fa-minus"></i>
            <span>Same as last month</span>
          </div>
        </div>
      </div>

      <div class="stat-card collections">
        <div class="stat-icon">
          <i class="fas fa-money-bill-wave"></i>
        </div>
        <div class="stat-content">
          <h3>Monthly Collections</h3>
          <div class="stat-value">Rs. {{ statistics.monthlyCollections || 0 }}</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            <span>15% from last month</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="dashboard-grid">
      <!-- Recent Activities -->
      <div class="dashboard-card activities">
        <div class="card-header">
          <h2>Recent Activities</h2>
          <button class="view-all">View All</button>
        </div>
        <div class="activity-list">
          <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
            <div class="activity-icon" :class="activity.type">
              <i :class="activity.icon"></i>
            </div>
            <div class="activity-content">
              <div class="activity-title">{{ activity.title }}</div>
              <div class="activity-time">{{ activity.time }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="dashboard-card quick-actions">
        <div class="card-header">
          <h2>Quick Actions</h2>
        </div>
        <div class="actions-grid">
          <router-link to="/dashboard/add-customer" class="action-item">
            <i class="fas fa-user-plus"></i>
            <span>Add Customer</span>
          </router-link>
          <router-link to="/dashboard/add-installment-plan" class="action-item">
            <i class="fas fa-file-invoice-dollar"></i>
            <span>Create Plan</span>
          </router-link>
          <router-link to="/dashboard/add-inventory" class="action-item">
            <i class="fas fa-box"></i>
            <span>Add Product</span>
          </router-link>
          <router-link to="/dashboard/view-customers" class="action-item">
            <i class="fas fa-users"></i>
            <span>View Customers</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-grid">
      <!-- Sales Chart -->
      <div class="dashboard-card">
        <div class="card-header">
          <h2>Sales Analysis</h2>
          <select v-model="salesPeriod" class="period-selector">
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <canvas ref="salesChart"></canvas>
      </div>

      <!-- Receivable Installments Chart -->
      <div class="dashboard-card">
        <div class="card-header">
          <h2>Receivable Installments</h2>
          <select v-model="installmentPeriod" class="period-selector">
            <option value="upcoming">Upcoming</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        <canvas ref="installmentChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import Chart from 'chart.js/auto'

const store = useStore()
const statistics = ref({
  totalCustomers: 0,
  totalSales: 0,
  pendingApprovals: 0,
  monthlyCollections: 0,
})

const recentActivities = ref([
  {
    id: 1,
    type: 'customer',
    icon: 'fas fa-user-plus',
    title: 'New customer registration',
    time: '5 minutes ago',
  },
  {
    id: 2,
    type: 'sale',
    icon: 'fas fa-shopping-cart',
    title: 'New sale completed',
    time: '2 hours ago',
  },
  {
    id: 3,
    type: 'payment',
    icon: 'fas fa-money-bill-wave',
    title: 'Payment received',
    time: '3 hours ago',
  },
  {
    id: 4,
    type: 'approval',
    icon: 'fas fa-check-circle',
    title: 'Customer approved',
    time: '5 hours ago',
  },
])

const salesChart = ref(null)
const installmentChart = ref(null)
const salesPeriod = ref('monthly')
const installmentPeriod = ref('upcoming')

onMounted(async () => {
  try {
    // Fetch dashboard statistics
    const response = await store.dispatch('getDashboardStats')
    if (response.success) {
      statistics.value = response.data
    }

    // Initialize Sales Chart
    new Chart(salesChart.value, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Sales',
            data: [12000, 19000, 15000, 25000, 22000, 30000],
            borderColor: '#6366f1',
            tension: 0.4,
            fill: true,
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
        },
      },
    })

    // Initialize Installments Chart
    new Chart(installmentChart.value, {
      type: 'bar',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Receivable Amount',
            data: [15000, 25000, 18000, 22000],
            backgroundColor: '#10b981',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
        },
      },
    })
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error)
  }
})
</script>

<style scoped>
.dashboard {
  padding: 24px;
  background: #f8f9fe;
  min-height: 100vh;
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.customers .stat-icon {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
}

.sales .stat-icon {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.pending .stat-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.collections .stat-icon {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}

.stat-change {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.negative {
  color: #ef4444;
}

.stat-change.neutral {
  color: #6b7280;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.dashboard-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.card-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.view-all {
  background: none;
  border: none;
  color: #6366f1;
  font-size: 14px;
  cursor: pointer;
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 12px;
  transition: background-color 0.2s ease;
}

.activity-item:hover {
  background: #f9fafb;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
}

.activity-icon.customer {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
}

.activity-icon.sale {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.activity-icon.payment {
  background: linear-gradient(135deg, #10b981, #059669);
}

.activity-icon.approval {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 12px;
  color: #6b7280;
}

/* Quick Actions */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f9fafb;
  border-radius: 12px;
  text-decoration: none;
  color: #111827;
  transition: all 0.3s ease;
}

.action-item:hover {
  background: #6366f1;
  color: white;
  transform: translateY(-2px);
}

.action-item i {
  font-size: 24px;
  margin-bottom: 8px;
}

.action-item span {
  font-size: 14px;
  font-weight: 500;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 24px;
}

.period-selector {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .stat-value {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
  }

  .stat-content {
    width: 100%;
  }
}
</style>
