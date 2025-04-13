<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Gestion des paris</h2>
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
              placeholder="Rechercher un pari..."
            >
          </div>

          <div class="filter-group">
            <select v-model="statusFilter">
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="won">Gagné</option>
              <option value="lost">Perdu</option>
              <option value="cancelled">Annulé</option>
            </select>

            <select v-model="matchFilter">
              <option value="">Tous les matchs</option>
              <option 
                v-for="match in matches"
                :key="match._id"
                :value="match._id"
              >
                {{ match.teamA.name }} vs {{ match.teamB.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="summary">
          <div class="summary-card">
            <i class="fas fa-ticket-alt"></i>
            <div class="summary-info">
              <span class="label">Total des paris</span>
              <span class="value">{{ filteredBets.length }}</span>
            </div>
          </div>

          <div class="summary-card">
            <i class="fas fa-trophy"></i>
            <div class="summary-info">
              <span class="label">Paris gagnés</span>
              <span class="value">{{ wonBets.length }}</span>
            </div>
          </div>

          <div class="summary-card">
            <i class="fas fa-times-circle"></i>
            <div class="summary-info">
              <span class="label">Paris perdus</span>
              <span class="value">{{ lostBets.length }}</span>
            </div>
          </div>

          <div class="summary-card">
            <i class="fas fa-chart-line"></i>
            <div class="summary-info">
              <span class="label">Taux de réussite</span>
              <span class="value">{{ winRate }}%</span>
            </div>
          </div>
        </div>

        <div class="bets-list" v-if="!loading">
          <div v-if="filteredBets.length === 0" class="empty-state">
            <i class="fas fa-search"></i>
            <p>Aucun pari trouvé</p>
          </div>

          <div v-else class="bet-cards">
            <div 
              v-for="bet in filteredBets"
              :key="bet._id"
              class="bet-card"
              :class="bet.status"
            >
              <div class="bet-header">
                <div class="match-info">
                  <span class="sport">
                    <i :class="getSportIcon(bet.match.sport)"></i>
                    {{ bet.match.sport }}
                  </span>
                  <span class="teams">
                    {{ bet.match.teamA.name }} vs {{ bet.match.teamB.name }}
                  </span>
                </div>
                <span class="status" :class="bet.status">
                  {{ getStatusLabel(bet.status) }}
                </span>
              </div>

              <div class="bet-details">
                <div class="detail-row">
                  <span class="label">Utilisateur</span>
                  <span class="value">{{ bet.user.username }}</span>
                </div>

                <div class="detail-row">
                  <span class="label">Choix</span>
                  <span class="value">{{ getChoiceLabel(bet.choice) }}</span>
                </div>

                <div class="detail-row">
                  <span class="label">Mise</span>
                  <span class="value">{{ formatAmount(bet.amount) }} KTAP</span>
                </div>

                <div class="detail-row" v-if="bet.status !== 'pending'">
                  <span class="label">Gains</span>
                  <span class="value" :class="bet.status">
                    {{ formatAmount(bet.winnings) }} KTAP
                  </span>
                </div>

                <div class="detail-row">
                  <span class="label">Date</span>
                  <span class="value">{{ formatDate(bet.createdAt) }}</span>
                </div>
              </div>

              <div class="bet-actions">
                <button 
                  v-if="bet.status === 'pending'"
                  class="btn-primary"
                  @click="handleSettle(bet)"
                  :disabled="loading"
                >
                  <i class="fas fa-check"></i>
                  Régler
                </button>

                <button 
                  v-if="bet.status === 'pending'"
                  class="btn-danger"
                  @click="handleCancel(bet)"
                  :disabled="loading"
                >
                  <i class="fas fa-times"></i>
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="loading-state">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Chargement des paris...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'BetManagementModal',
  props: {
    bets: {
      type: Array,
      required: true
    },
    matches: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'settle', 'cancel'],
  setup(props, { emit }) {
    const searchQuery = ref('');
    const statusFilter = ref('');
    const matchFilter = ref('');

    const filteredBets = computed(() => {
      return props.bets.filter(bet => {
        const matchesSearch = 
          bet.user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          bet.match.teamA.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          bet.match.teamB.name.toLowerCase().includes(searchQuery.value.toLowerCase());

        const matchesStatus = !statusFilter.value || bet.status === statusFilter.value;
        const matchesMatch = !matchFilter.value || bet.match._id === matchFilter.value;

        return matchesSearch && matchesStatus && matchesMatch;
      });
    });

    const wonBets = computed(() => 
      filteredBets.value.filter(bet => bet.status === 'won')
    );

    const lostBets = computed(() => 
      filteredBets.value.filter(bet => bet.status === 'lost')
    );

    const winRate = computed(() => {
      if (filteredBets.value.length === 0) return 0;
      return Math.round((wonBets.value.length / filteredBets.value.length) * 100);
    });

    const getSportIcon = (sport) => {
      const icons = {
        football: 'fas fa-futbol',
        basketball: 'fas fa-basketball-ball',
        tennis: 'fas fa-table-tennis'
      };
      return icons[sport] || 'fas fa-question';
    };

    const getStatusLabel = (status) => {
      const labels = {
        pending: 'En attente',
        won: 'Gagné',
        lost: 'Perdu',
        cancelled: 'Annulé'
      };
      return labels[status] || status;
    };

    const getChoiceLabel = (choice) => {
      const labels = {
        teamA: 'Équipe A',
        teamB: 'Équipe B',
        draw: 'Match nul'
      };
      return labels[choice] || choice;
    };

    const formatAmount = (amount) => {
      return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    };

    const formatDate = (date) => {
      return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'short',
        timeStyle: 'short'
      }).format(new Date(date));
    };

    const handleSettle = (bet) => {
      emit('settle', bet);
    };

    const handleCancel = (bet) => {
      emit('cancel', bet);
    };

    return {
      searchQuery,
      statusFilter,
      matchFilter,
      filteredBets,
      wonBets,
      lostBets,
      winRate,
      getSportIcon,
      getStatusLabel,
      getChoiceLabel,
      formatAmount,
      formatDate,
      handleSettle,
      handleCancel
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
  max-width: 1200px;
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
    gap: 1rem;
    margin-bottom: 1.5rem;

    .search-box {
      flex: 1;
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

      select {
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
    }
  }

  .summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;

    .summary-card {
      background: var(--bg-secondary);
      border-radius: 0.5rem;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;

      i {
        font-size: 1.5rem;
        color: var(--primary);
      }

      .summary-info {
        display: flex;
        flex-direction: column;

        .label {
          color: var(--text-secondary);
          font-size: 0.75rem;
        }

        .value {
          color: var(--text-primary);
          font-size: 1.25rem;
          font-weight: 500;
        }
      }
    }
  }

  .bets-list {
    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-secondary);

      i {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      p {
        font-size: 1rem;
      }
    }

    .bet-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;

      .bet-card {
        background: var(--bg-secondary);
        border-radius: 0.5rem;
        padding: 1rem;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        &.won {
          border-left: 4px solid var(--success);
        }

        &.lost {
          border-left: 4px solid var(--danger);
        }

        &.cancelled {
          border-left: 4px solid var(--warning);
        }

        .bet-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;

          .match-info {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;

            .sport {
              color: var(--text-secondary);
              font-size: 0.75rem;
              display: flex;
              align-items: center;
              gap: 0.5rem;

              i {
                color: var(--primary);
              }
            }

            .teams {
              color: var(--text-primary);
              font-weight: 500;
            }
          }

          .status {
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            font-weight: 500;

            &.pending {
              background: var(--bg-hover);
              color: var(--text-secondary);
            }

            &.won {
              background: var(--success-light);
              color: var(--success);
            }

            &.lost {
              background: var(--danger-light);
              color: var(--danger);
            }

            &.cancelled {
              background: var(--warning-light);
              color: var(--warning);
            }
          }
        }

        .bet-details {
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;

            .label {
              color: var(--text-secondary);
              font-size: 0.875rem;
            }

            .value {
              color: var(--text-primary);
              font-size: 0.875rem;
              font-weight: 500;

              &.won {
                color: var(--success);
              }

              &.lost {
                color: var(--danger);
              }
            }
          }
        }

        .bet-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;

          button {
            flex: 1;
            padding: 0.5rem;
            border: none;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;

            &:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }

            i {
              font-size: 1rem;
            }
          }

          .btn-primary {
            background: var(--primary);
            color: white;

            &:hover:not(:disabled) {
              background: var(--primary-dark);
            }
          }

          .btn-danger {
            background: var(--danger);
            color: white;

            &:hover:not(:disabled) {
              background: var(--danger-dark);
            }
          }
        }
      }
    }
  }

  .loading-state {
    text-align: center;
    padding: 3rem;
    color: var(--text-secondary);

    i {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1rem;
    }
  }
}
</style> 
 
 