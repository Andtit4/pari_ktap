<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Nouveau Retrait</h2>
        <button class="close-btn" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="balance-info">
          <span>Solde disponible :</span>
          <span class="amount">{{ formatAmount(balance) }} KTAP</span>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="amount">Montant à retirer (KTAP)</label>
            <div class="amount-input">
              <input
                id="amount"
                v-model="amount"
                type="number"
                :min="minWithdraw"
                :max="balance"
                step="0.01"
                required
                placeholder="Entrez le montant"
              />
              <span class="currency">KTAP</span>
            </div>
            <small class="help-text">
              Minimum : {{ formatAmount(minWithdraw) }} KTAP
            </small>
          </div>

          <div class="form-group">
            <label for="reason">Raison (optionnelle)</label>
            <textarea
              id="reason"
              v-model="reason"
              rows="3"
              placeholder="Entrez une raison pour ce retrait"
            ></textarea>
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
              <span v-else>Confirmer le retrait</span>
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
  name: 'WithdrawModal',
  props: {
    balance: {
      type: Number,
      required: true
    },
    minWithdraw: {
      type: Number,
      default: 10
    }
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const amount = ref('');
    const reason = ref('');
    const loading = ref(false);

    const isValid = computed(() => {
      const amountNum = parseFloat(amount.value);
      return amountNum >= props.minWithdraw && amountNum <= props.balance;
    });

    const formatAmount = (value) => {
      return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    };

    const handleSubmit = async () => {
      if (!isValid.value) return;

      loading.value = true;
      try {
        await emit('submit', {
          amount: parseFloat(amount.value),
          reason: reason.value
        });
      } finally {
        loading.value = false;
      }
    };

    return {
      amount,
      reason,
      loading,
      isValid,
      formatAmount,
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

  .balance-info {
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

    .help-text {
      display: block;
      margin-top: 0.5rem;
      color: var(--text-tertiary);
      font-size: 0.875rem;
    }

    textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      background: var(--bg-secondary);
      color: var(--text-primary);
      font-size: 1rem;
      resize: vertical;
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
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;

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
</style> 
 
 