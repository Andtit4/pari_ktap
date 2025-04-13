<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Placer un Pari</h2>
        <button class="close-btn" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="match-info">
          <div class="teams">
            <span class="team">{{ match.teamA.name }}</span>
            <span class="vs">VS</span>
            <span class="team">{{ match.teamB.name }}</span>
          </div>
          <div class="time">
            <i class="far fa-clock"></i>
            {{ formatTime(match.startTime) }}
          </div>
        </div>

        <div class="odds-info">
          <div class="odds-grid">
            <button
              v-for="(odd, type) in match.odds"
              :key="type"
              class="odd-btn"
              :class="{ active: selectedType === type }"
              @click="selectOdd(type)"
            >
              <span class="type">{{ getOddTypeLabel(type) }}</span>
              <span class="value">{{ formatOdd(odd) }}</span>
            </button>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="bet-form">
          <div class="form-group">
            <label for="amount">Mise (KTAP)</label>
            <div class="amount-input">
              <input
                id="amount"
                v-model="amount"
                type="number"
                :min="minBet"
                :max="maxBet"
                step="0.01"
                required
                placeholder="Entrez votre mise"
              />
              <span class="currency">KTAP</span>
            </div>
            <div class="bet-info">
              <small class="help-text">
                Mise minimum : {{ formatAmount(minBet) }} KTAP
              </small>
              <small class="help-text">
                Mise maximum : {{ formatAmount(maxBet) }} KTAP
              </small>
            </div>
          </div>

          <div class="potential-winnings" v-if="selectedType && amount">
            <span>Gains potentiels :</span>
            <span class="amount">{{ formatAmount(potentialWinnings) }} KTAP</span>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="$emit('close')">
              Annuler
            </button>
            <button 
              type="submit" 
              class="btn-primary" 
              :disabled="loading || !isValid"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin"></i>
              <span v-else>Confirmer le pari</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'BetModal',
  props: {
    match: {
      type: Object,
      required: true
    },
    balance: {
      type: Number,
      required: true
    },
    minBet: {
      type: Number,
      default: 1
    },
    maxBet: {
      type: Number,
      default: 1000
    }
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const amount = ref('');
    const selectedType = ref('');
    const loading = ref(false);

    const isValid = computed(() => {
      const amountNum = parseFloat(amount.value);
      return (
        selectedType.value &&
        amountNum >= props.minBet &&
        amountNum <= Math.min(props.maxBet, props.balance)
      );
    });

    const potentialWinnings = computed(() => {
      if (!selectedType.value || !amount.value) return 0;
      const amountNum = parseFloat(amount.value);
      return amountNum * props.match.odds[selectedType.value];
    });

    const formatAmount = (value) => {
      return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    };

    const formatOdd = (value) => {
      return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    };

    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const getOddTypeLabel = (type) => {
      const labels = {
        teamA: 'Équipe A',
        draw: 'Match nul',
        teamB: 'Équipe B'
      };
      return labels[type] || type;
    };

    const selectOdd = (type) => {
      selectedType.value = type;
    };

    const handleSubmit = async () => {
      if (!isValid.value) return;

      loading.value = true;
      try {
        await emit('submit', {
          matchId: props.match.id,
          type: selectedType.value,
          amount: parseFloat(amount.value)
        });
      } finally {
        loading.value = false;
      }
    };

    return {
      amount,
      selectedType,
      loading,
      isValid,
      potentialWinnings,
      formatAmount,
      formatOdd,
      formatTime,
      getOddTypeLabel,
      selectOdd,
      handleSubmit
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
  max-width: 500px;
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

  .match-info {
    text-align: center;
    margin-bottom: 2rem;

    .teams {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;

      .team {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
      }

      .vs {
        color: var(--text-tertiary);
        font-weight: 500;
      }
    }

    .time {
      color: var(--text-secondary);
      font-size: 0.875rem;

      i {
        margin-right: 0.5rem;
      }
    }
  }

  .odds-info {
    margin-bottom: 2rem;

    .odds-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;

      .odd-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: var(--bg-hover);
        }

        &.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;

          .type, .value {
            color: white;
          }
        }

        .type {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .value {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
        }
      }
    }
  }

  .bet-form {
    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-secondary);
        font-weight: 500;
      }

      .amount-input {
        position: relative;

        input {
          width: 100%;
          padding: 0.75rem 1rem;
          padding-right: 4rem;
          border: 1px solid var(--border-color);
          border-radius: 0.5rem;
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 1rem;
          transition: all 0.3s ease;

          &:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 2px var(--primary-light);
          }

          &::placeholder {
            color: var(--text-tertiary);
          }
        }

        .currency {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-tertiary);
          font-weight: 500;
        }
      }

      .bet-info {
        display: flex;
        justify-content: space-between;
        margin-top: 0.5rem;
      }

      .help-text {
        color: var(--text-tertiary);
        font-size: 0.875rem;
      }
    }

    .potential-winnings {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: var(--bg-secondary);
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;

      span {
        color: var(--text-secondary);
        font-weight: 500;
      }

      .amount {
        color: var(--text-primary);
        font-size: 1.25rem;
        font-weight: 600;
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;

      button {
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        i {
          font-size: 1rem;
        }
      }
    }
  }
}
</style> 
 
 