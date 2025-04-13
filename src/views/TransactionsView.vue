<template>
  <div class="transactions-container">
    <div class="transactions-header">
      <h1>Transactions Financières</h1>
      <div class="transaction-actions">
        <button class="btn-primary" @click="showDepositModal = true">
          <i class="fas fa-plus"></i> Nouveau Dépôt
        </button>
        <button class="btn-secondary" @click="showWithdrawModal = true">
          <i class="fas fa-minus"></i> Nouveau Retrait
        </button>
      </div>
    </div>

    <div class="transactions-tabs">
      <button 
        :class="['tab-btn', { active: activeTab === 'deposits' }]"
        @click="activeTab = 'deposits'"
      >
        Dépôts
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'withdrawals' }]"
        @click="activeTab = 'withdrawals'"
      >
        Retraits
      </button>
    </div>

    <div class="transactions-content">
      <div v-if="loading" class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
      </div>

      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-else>
        <!-- Dépôts -->
        <div v-if="activeTab === 'deposits'" class="transactions-list">
          <div v-if="deposits.length === 0" class="no-transactions">
            Aucun dépôt trouvé
          </div>
          <div v-else class="transaction-cards">
            <div v-for="deposit in deposits" :key="deposit._id" class="transaction-card">
              <div class="transaction-header">
                <span class="amount">+{{ formatAmount(deposit.amount) }} KTAP</span>
                <span :class="['status', deposit.status]">{{ getStatusText(deposit.status) }}</span>
              </div>
              <div class="transaction-details">
                <div class="detail">
                  <i class="fas fa-calendar"></i>
                  <span>{{ formatDate(deposit.createdAt) }}</span>
                </div>
                <div v-if="deposit.processedAt" class="detail">
                  <i class="fas fa-clock"></i>
                  <span>Traité le {{ formatDate(deposit.processedAt) }}</span>
                </div>
                <div v-if="deposit.reason" class="detail">
                  <i class="fas fa-comment"></i>
                  <span>{{ deposit.reason }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Retraits -->
        <div v-if="activeTab === 'withdrawals'" class="transactions-list">
          <div v-if="withdrawals.length === 0" class="no-transactions">
            Aucun retrait trouvé
          </div>
          <div v-else class="transaction-cards">
            <div v-for="withdrawal in withdrawals" :key="withdrawal._id" class="transaction-card">
              <div class="transaction-header">
                <span class="amount">-{{ formatAmount(withdrawal.amount) }} KTAP</span>
                <span :class="['status', withdrawal.status]">{{ getStatusText(withdrawal.status) }}</span>
              </div>
              <div class="transaction-details">
                <div class="detail">
                  <i class="fas fa-calendar"></i>
                  <span>{{ formatDate(withdrawal.createdAt) }}</span>
                </div>
                <div v-if="withdrawal.processedAt" class="detail">
                  <i class="fas fa-clock"></i>
                  <span>Traité le {{ formatDate(withdrawal.processedAt) }}</span>
                </div>
                <div v-if="withdrawal.reason" class="detail">
                  <i class="fas fa-comment"></i>
                  <span>{{ withdrawal.reason }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de dépôt -->
    <DepositModal
      v-if="showDepositModal"
      @close="showDepositModal = false"
      @submit="handleDeposit"
    />

    <!-- Modal de retrait -->
    <WithdrawModal
      v-if="showWithdrawModal"
      @close="showWithdrawModal = false"
      @submit="handleWithdraw"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import DepositModal from '@/components/DepositModal.vue';
import WithdrawModal from '@/components/WithdrawModal.vue';

export default {
  name: 'TransactionsView',
  components: {
    DepositModal,
    WithdrawModal
  },
  setup() {
    const store = useStore();
    const activeTab = ref('deposits');
    const showDepositModal = ref(false);
    const showWithdrawModal = ref(false);

    const deposits = computed(() => store.getters['transactions/deposits']);
    const withdrawals = computed(() => store.getters['transactions/withdrawals']);
    const loading = computed(() => store.getters['transactions/loading']);
    const error = computed(() => store.getters['transactions/error']);

    onMounted(async () => {
      await Promise.all([
        store.dispatch('transactions/fetchDeposits'),
        store.dispatch('transactions/fetchWithdrawals')
      ]);
    });

    const formatAmount = (amount) => {
      return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const getStatusText = (status) => {
      const statusMap = {
        pending: 'En attente',
        approved: 'Approuvé',
        rejected: 'Rejeté'
      };
      return statusMap[status] || status;
    };

    const handleDeposit = async (depositData) => {
      try {
        await store.dispatch('transactions/createDeposit', {
          amount: depositData.amount,
          proofOfPayment: depositData.proofOfPayment
        });
        showDepositModal.value = false;
        // Rafraîchir la liste des transactions
        await Promise.all([
          store.dispatch('transactions/fetchDeposits'),
          store.dispatch('transactions/fetchWithdrawals')
        ]);
      } catch (error) {
        console.error('Erreur lors du dépôt:', error);
        // L'erreur sera affichée via le getter error du store
      }
    };

    const handleWithdraw = async (withdrawalData) => {
      try {
        await store.dispatch('transactions/createWithdrawal', withdrawalData);
        showWithdrawModal.value = false;
        // Rafraîchir la liste des transactions
        await Promise.all([
          store.dispatch('transactions/fetchDeposits'),
          store.dispatch('transactions/fetchWithdrawals')
        ]);
      } catch (error) {
        console.error('Erreur lors du retrait:', error);
        // L'erreur sera affichée via le getter error du store
      }
    };

    return {
      activeTab,
      showDepositModal,
      showWithdrawModal,
      deposits,
      withdrawals,
      loading,
      error,
      formatAmount,
      formatDate,
      getStatusText,
      handleDeposit,
      handleWithdraw
    };
  }
};
</script>

<style lang="scss" scoped>
.transactions-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  .transactions-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    h1 {
      font-size: 2rem;
      color: var(--text-primary);
    }

    .transaction-actions {
      display: flex;
      gap: 1rem;

      button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        transition: all 0.3s ease;

        i {
          font-size: 1rem;
        }
      }
    }
  }

  .transactions-tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;

    .tab-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      background: var(--bg-secondary);
      color: var(--text-secondary);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      &.active {
        background: var(--primary);
        color: white;
      }

      &:hover:not(.active) {
        background: var(--bg-hover);
      }
    }
  }

  .transactions-content {
    min-height: 400px;
    position: relative;

    .loading-spinner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 2rem;
      color: var(--primary);
    }

    .error-message {
      text-align: center;
      color: var(--error);
      padding: 2rem;
    }

    .no-transactions {
      text-align: center;
      color: var(--text-secondary);
      padding: 2rem;
    }

    .transaction-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;

      .transaction-card {
        background: var(--bg-secondary);
        border-radius: 1rem;
        padding: 1.5rem;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .transaction-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;

          .amount {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-primary);
          }

          .status {
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.875rem;
            font-weight: 500;

            &.pending {
              background: var(--warning-light);
              color: var(--warning);
            }

            &.approved {
              background: var(--success-light);
              color: var(--success);
            }

            &.rejected {
              background: var(--error-light);
              color: var(--error);
            }
          }
        }

        .transaction-details {
          .detail {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 0.5rem;
            color: var(--text-secondary);

            i {
              width: 1rem;
              color: var(--text-tertiary);
            }
          }
        }
      }
    }
  }
}
</style> 
 
 