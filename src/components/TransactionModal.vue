<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Gestion des transactions</h2>
        <button class="close-btn" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="filters">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input 
              type="text"
              v-model="searchQuery"
              placeholder="Rechercher une transaction..."
            >
          </div>

          <div class="filter-group">
            <select v-model="selectedType">
              <option value="all">Tous les types</option>
              <option value="deposit">Dépôts</option>
              <option value="withdrawal">Retraits</option>
              <option value="bet">Paris</option>
              <option value="win">Gains</option>
            </select>

            <select v-model="selectedStatus">
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="completed">Complété</option>
              <option value="failed">Échoué</option>
              <option value="cancelled">Annulé</option>
            </select>

            <div class="date-range">
              <input 
                type="date"
                v-model="startDate"
                :max="endDate"
              >
              <span>à</span>
              <input 
                type="date"
                v-model="endDate"
                :min="startDate"
              >
            </div>
          </div>
        </div>

        <div class="summary">
          <div class="summary-card">
            <i class="fas fa-exchange-alt"></i>
            <div class="summary-info">
              <span class="label">Total des transactions</span>
              <span class="value">{{ filteredTransactions.length }}</span>
            </div>
          </div>

          <div class="summary-card">
            <i class="fas fa-arrow-up"></i>
            <div class="summary-info">
              <span class="label">Total des dépôts</span>
              <span class="value">{{ totalDeposits }} KTAP</span>
            </div>
          </div>

          <div class="summary-card">
            <i class="fas fa-arrow-down"></i>
            <div class="summary-info">
              <span class="label">Total des retraits</span>
              <span class="value">{{ totalWithdrawals }} KTAP</span>
            </div>
          </div>

          <div class="summary-card">
            <i class="fas fa-chart-line"></i>
            <div class="summary-info">
              <span class="label">Balance nette</span>
              <span class="value" :class="{ 'positive': netBalance >= 0, 'negative': netBalance < 0 }">
                {{ netBalance }} KTAP
              </span>
            </div>
          </div>
        </div>

        <div class="transactions-list">
          <div v-if="loading" class="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Chargement des transactions...</span>
          </div>

          <div v-else-if="filteredTransactions.length === 0" class="empty-state">
            <i class="fas fa-search"></i>
            <span>Aucune transaction trouvée</span>
          </div>

          <div v-else class="transactions">
            <div 
              v-for="transaction in filteredTransactions" 
              :key="transaction._id"
              class="transaction-card"
              :class="transaction.status"
            >
              <div class="transaction-header">
                <div class="transaction-type">
                  <i :class="getTypeIcon(transaction.type)"></i>
                  <span>{{ getTypeLabel(transaction.type) }}</span>
                </div>
                <div class="transaction-status">
                  <span :class="transaction.status">
                    {{ getStatusLabel(transaction.status) }}
                  </span>
                </div>
              </div>

              <div class="transaction-details">
                <div class="detail-row">
                  <span class="label">Utilisateur</span>
                  <span class="value">
                    <button class="btn-link" @click="showUserDetails(transaction.user)">
                      {{ transaction.user.username }}
                    </button>
                  </span>
                </div>

                <div class="detail-row">
                  <span class="label">Montant</span>
                  <span class="value" :class="{ 'positive': transaction.amount > 0, 'negative': transaction.amount < 0 }">
                    {{ formatAmount(transaction.amount) }} KTAP
                  </span>
                </div>

                <div class="detail-row">
                  <span class="label">Date</span>
                  <span class="value">{{ formatDate(transaction.createdAt) }}</span>
                </div>

                <div v-if="transaction.reference" class="detail-row">
                  <span class="label">Référence</span>
                  <span class="value">{{ transaction.reference }}</span>
                </div>

                <div v-if="transaction.description" class="detail-row">
                  <span class="label">Description</span>
                  <span class="value">{{ transaction.description }}</span>
                </div>

                <div v-if="transaction.adminNotes" class="detail-row">
                  <span class="label">Notes admin</span>
                  <span class="value">{{ transaction.adminNotes }}</span>
                </div>

                <div v-if="transaction.actionHistory?.length" class="detail-row">
                  <span class="label">Historique</span>
                  <div class="action-history">
                    <div v-for="(action, index) in transaction.actionHistory" :key="index" class="action-item">
                      <span class="action-type">{{ action.type }}</span>
                      <span class="action-date">{{ formatDate(action.date) }}</span>
                      <span class="action-admin">{{ action.admin }}</span>
                      <span v-if="action.note" class="action-note">{{ action.note }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="transaction-actions">
                <div class="admin-notes">
                  <textarea 
                    v-model="transaction.newNote"
                    placeholder="Ajouter une note..."
                    rows="2"
                  ></textarea>
                </div>

                <div class="action-buttons">
                  <button 
                    v-if="transaction.status === 'pending'"
                    class="btn-primary"
                    @click="handleAction(transaction, 'approve')"
                  >
                    <i class="fas fa-check"></i>
                    Approuver
                  </button>

                  <button 
                    v-if="transaction.status === 'pending'"
                    class="btn-danger"
                    @click="handleAction(transaction, 'reject')"
                  >
                    <i class="fas fa-times"></i>
                    Rejeter
                  </button>

                  <button 
                    v-if="transaction.status === 'failed'"
                    class="btn-secondary"
                    @click="handleAction(transaction, 'retry')"
                  >
                    <i class="fas fa-redo"></i>
                    Réessayer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'TransactionModal',
  props: {
    transactions: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'action', 'showUserDetails'],
  setup(props, { emit }) {
    const searchQuery = ref('');
    const selectedType = ref('all');
    const selectedStatus = ref('all');
    const startDate = ref('');
    const endDate = ref('');

    const filteredTransactions = computed(() => {
      return props.transactions.filter(transaction => {
        const matchesSearch = !searchQuery.value || 
          transaction.reference?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          transaction.description?.toLowerCase().includes(searchQuery.value.toLowerCase());

        const matchesType = selectedType.value === 'all' || 
          transaction.type === selectedType.value;

        const matchesStatus = selectedStatus.value === 'all' || 
          transaction.status === selectedStatus.value;

        const matchesDate = (!startDate.value || new Date(transaction.createdAt) >= new Date(startDate.value)) &&
          (!endDate.value || new Date(transaction.createdAt) <= new Date(endDate.value));

        return matchesSearch && matchesType && matchesStatus && matchesDate;
      });
    });

    const totalDeposits = computed(() => {
      return filteredTransactions.value
        .filter(t => t.type === 'deposit' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0)
        .toFixed(2);
    });

    const totalWithdrawals = computed(() => {
      return filteredTransactions.value
        .filter(t => t.type === 'withdrawal' && t.status === 'completed')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)
        .toFixed(2);
    });

    const netBalance = computed(() => {
      return filteredTransactions.value
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0)
        .toFixed(2);
    });

    const getTypeIcon = (type) => {
      const icons = {
        deposit: 'fas fa-arrow-up',
        withdrawal: 'fas fa-arrow-down',
        bet: 'fas fa-dice',
        win: 'fas fa-trophy'
      };
      return icons[type] || 'fas fa-exchange-alt';
    };

    const getTypeLabel = (type) => {
      const labels = {
        deposit: 'Dépôt',
        withdrawal: 'Retrait',
        bet: 'Paris',
        win: 'Gain'
      };
      return labels[type] || type;
    };

    const getStatusLabel = (status) => {
      const labels = {
        pending: 'En attente',
        completed: 'Complété',
        failed: 'Échoué',
        cancelled: 'Annulé'
      };
      return labels[status] || status;
    };

    const formatAmount = (amount) => {
      return Math.abs(amount).toFixed(2);
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const showUserDetails = (user) => {
      emit('showUserDetails', user);
    };

    const handleAction = (transaction, action) => {
      emit('action', {
        transactionId: transaction._id,
        action,
        note: transaction.newNote
      });
      transaction.newNote = '';
    };

    return {
      searchQuery,
      selectedType,
      selectedStatus,
      startDate,
      endDate,
      filteredTransactions,
      totalDeposits,
      totalWithdrawals,
      netBalance,
      getTypeIcon,
      getTypeLabel,
      getStatusLabel,
      formatAmount,
      formatDate,
      showUserDetails,
      handleAction
    };
  }
};
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-primary);
  border-radius: 1rem;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);

  h2 {
    font-size: 1.5rem;
    color: var(--text-primary);
    margin: 0;
  }

  .close-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.3s ease;

    &:hover {
      background: var(--bg-hover);
      color: var(--text-primary);
    }
  }
}

.modal-body {
  padding: 1.5rem;

  .filters {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;

    .search-box {
      position: relative;

      i {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-secondary);
      }

      input {
        width: 100%;
        padding: 0.75rem 1rem 0.75rem 2.5rem;
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        background: var(--bg-secondary);
        color: var(--text-primary);
        font-size: 0.875rem;
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          border-color: var(--primary);
        }
      }
    }

    .filter-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;

      select {
        flex: 1;
        min-width: 150px;
        padding: 0.75rem 1rem;
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        background: var(--bg-secondary);
        color: var(--text-primary);
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          border-color: var(--primary);
        }
      }

      .date-range {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
        min-width: 300px;

        input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid var(--border-color);
          border-radius: 0.5rem;
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 0.875rem;
          transition: all 0.3s ease;

          &:focus {
            outline: none;
            border-color: var(--primary);
          }
        }

        span {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }
      }
    }
  }

  .summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;

    .summary-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--bg-secondary);
      border-radius: 0.5rem;
      border: 1px solid var(--border-color);

      i {
        font-size: 1.5rem;
        color: var(--primary);
      }

      .summary-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        .label {
          color: var(--text-secondary);
          font-size: 0.75rem;
        }

        .value {
          color: var(--text-primary);
          font-size: 1.125rem;
          font-weight: 500;

          &.positive {
            color: var(--success);
          }

          &.negative {
            color: var(--danger);
          }
        }
      }
    }
  }

  .transactions-list {
    .loading-state,
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 3rem;
      color: var(--text-secondary);
      text-align: center;

      i {
        font-size: 2rem;
      }
    }

    .transactions {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .transaction-card {
        background: var(--bg-secondary);
        border-radius: 0.5rem;
        border: 1px solid var(--border-color);
        overflow: hidden;

        &.pending {
          border-left: 4px solid var(--warning);
        }

        &.completed {
          border-left: 4px solid var(--success);
        }

        &.failed {
          border-left: 4px solid var(--danger);
        }

        &.cancelled {
          border-left: 4px solid var(--text-secondary);
        }

        .transaction-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid var(--border-color);

          .transaction-type {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--text-primary);
            font-weight: 500;

            i {
              color: var(--primary);
            }
          }

          .transaction-status {
            span {
              padding: 0.25rem 0.75rem;
              border-radius: 1rem;
              font-size: 0.75rem;
              font-weight: 500;

              &.pending {
                background: var(--warning-bg);
                color: var(--warning);
              }

              &.completed {
                background: var(--success-bg);
                color: var(--success);
              }

              &.failed {
                background: var(--danger-bg);
                color: var(--danger);
              }

              &.cancelled {
                background: var(--bg-hover);
                color: var(--text-secondary);
              }
            }
          }
        }

        .transaction-details {
          padding: 1rem;

          .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;

            &:last-child {
              margin-bottom: 0;
            }

            .label {
              color: var(--text-secondary);
              font-size: 0.875rem;
            }

            .value {
              color: var(--text-primary);
              font-size: 0.875rem;
              font-weight: 500;

              &.positive {
                color: var(--success);
              }

              &.negative {
                color: var(--danger);
              }
            }
          }
        }

        .transaction-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
          border-top: 1px solid var(--border-color);

          .admin-notes {
            flex: 1;

            textarea {
              width: 100%;
              padding: 0.5rem;
              border: 1px solid var(--border-color);
              border-radius: 0.25rem;
              background: var(--bg-secondary);
              color: var(--text-primary);
              resize: vertical;
              min-height: 60px;

              &:focus {
                outline: none;
                border-color: var(--primary);
              }
            }
          }

          .action-buttons {
            display: flex;
            gap: 0.5rem;
          }
        }
      }
    }
  }

  .btn-link {
    background: none;
    border: none;
    color: var(--primary);
    text-decoration: underline;
    cursor: pointer;
    padding: 0;

    &:hover {
      color: var(--primary-dark);
    }
  }
}
</style> 