<template>
  <div class="orders-page">
    <div class="orders-container">
      <h1 class="orders-title">سفارش‌های من</h1>

      <div v-if="orders.length === 0" class="orders-empty">
        <p>شما هنوز سفارشی ثبت نکرده‌اید</p>
        <router-link to="/products" class="shop-link">
          شروع خرید
        </router-link>
      </div>

      <div v-else class="orders-list">
        <div v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-header">
            <div class="order-info">
              <span class="order-id">سفارش #{{ order.id }}</span>
              <span class="order-date">{{ order.date }}</span>
            </div>
            <span class="order-status" :class="`order-status--${order.status}`">
              {{ getStatusText(order.status) }}
            </span>
          </div>

          <div class="order-items">
            <div v-for="item in order.items" :key="item.id" class="order-item">
              <img :src="item.image" :alt="item.name" class="order-item__image">
              <div class="order-item__info">
                <h4>{{ item.name }}</h4>
                <p>{{ item.price }} تومان x {{ item.quantity }}</p>
              </div>
            </div>
          </div>

          <div class="order-footer">
            <div class="order-total">
              <span>مبلغ کل:</span>
              <strong>{{ order.total }} تومان</strong>
            </div>
            <button class="order-details-btn" @click="viewOrderDetails(order.id)">
              مشاهده جزئیات
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Order {
  id: number
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: string
  items: {
    id: number
    name: string
    price: string
    quantity: number
    image: string
  }[]
}

const orders = ref<Order[]>([
  {
    id: 1234,
    date: '۱۴۰۴/۱۱/۲۵',
    status: 'delivered',
    total: '۸۵۰,۰۰۰',
    items: [
      {
        id: 1,
        name: 'محصول ۱',
        price: '۲۵۰,۰۰۰',
        quantity: 2,
        image: 'https://via.placeholder.com/80x80?text=محصول+1'
      },
      {
        id: 2,
        name: 'محصول ۲',
        price: '۳۵۰,۰۰۰',
        quantity: 1,
        image: 'https://via.placeholder.com/80x80?text=محصول+2'
      }
    ]
  },
  {
    id: 1235,
    date: '۱۴۰۴/۱۱/۲۰',
    status: 'processing',
    total: '۴۵۰,۰۰۰',
    items: [
      {
        id: 3,
        name: 'محصول ۳',
        price: '۴۵۰,۰۰۰',
        quantity: 1,
        image: 'https://via.placeholder.com/80x80?text=محصول+3'
      }
    ]
  }
])

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'در انتظار پرداخت',
    processing: 'در حال پردازش',
    shipped: 'ارسال شده',
    delivered: 'تحویل شده',
    cancelled: 'لغو شده'
  }
  return statusMap[status] || status
}

const viewOrderDetails = (orderId: number) => {
  console.log('مشاهده جزئیات سفارش:', orderId)
}
</script>

<style scoped>
.orders-page {
  padding: 2rem;
  min-height: 70vh;
  background: #f8f9fa;
}

.orders-container {
  max-width: 1280px;
  margin: 0 auto;
}

.orders-title {
  font-size: 2rem;
  color: #374151;
  margin-bottom: 2rem;
}

.orders-empty {
  text-align: center;
  padding: 4rem;
  background: white;
  border-radius: 12px;
}

.orders-empty p {
  font-size: 1.2rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.shop-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 8px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #f0f0f0;
}

.order-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.order-id {
  font-weight: bold;
  color: #374151;
}

.order-date {
  color: #6b7280;
  font-size: 0.9rem;
}

.order-status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 500;
}

.order-status--pending {
  background: #fef3c7;
  color: #d97706;
}

.order-status--processing {
  background: #dbeafe;
  color: #2563eb;
}

.order-status--shipped {
  background: #e0f2fe;
  color: #0891b2;
}

.order-status--delivered {
  background: #d1fae5;
  color: #059669;
}

.order-status--cancelled {
  background: #fee2e2;
  color: #dc2626;
}

.order-items {
  padding: 1.5rem;
}

.order-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.order-item:last-child {
  border-bottom: none;
}

.order-item__image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.order-item__info h4 {
  color: #374151;
  margin-bottom: 0.25rem;
}

.order-item__info p {
  color: #6b7280;
  font-size: 0.9rem;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #f0f0f0;
}

.order-total {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.order-total span {
  color: #6b7280;
}

.order-total strong {
  color: #374151;
  font-size: 1.1rem;
}

.order-details-btn {
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.order-details-btn:hover {
  background: #f3f4f6;
}
</style>
