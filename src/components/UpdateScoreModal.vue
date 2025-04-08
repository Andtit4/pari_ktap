<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Mettre à jour le Score</h2>
        <button class="close-btn" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="match-info">
          <div class="teams">
            <span class="team">{{ match.homeTeam }}</span>
            <span class="vs">vs</span>
            <span class="team">{{ match.awayTeam }}</span>
          </div>
          <div class="start-time">
            <i class="far fa-clock"></i>
            {{ formatDate(match.startTime) }}
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="score-form">
          <div class="score-inputs">
            <div class="form-group">
              <label for="homeScore">Score domicile</label>
              <input
                id="homeScore"
                v-model.number="form.homeScore"
                type="number"
                min="0"
                required
                placeholder="0"
              />
            </div>

            <div class="form-group">
              <label for="awayScore">Score extérieur</label>
              <input
                id="awayScore"
                v-model.number="form.awayScore"
                type="number"
                min="0"
                required
                placeholder="0"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="status">Statut du match</label>
            <select
              id="status"
              v-model="form.status"
              required
              class="status-select"
            >
              <option value="live">En cours</option>
              <option value="finished">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>

          <div class="form-group">
            <label for="comment">Commentaire (optionnel)</label>
            <textarea
              id="comment"
              v-model="form.comment"
              rows="3"
              placeholder="Ajouter un commentaire sur le match..."
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
              <span v-else>Mettre à jour</span>
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
  name: 'UpdateScoreModal',
  props: {
    match: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const form = ref({
      homeScore: props.match.homeScore || 0,
      awayScore: props.match.awayScore || 0,
      status: props.match.status || 'live',
      comment: props.match.comment || ''
    });

    const loading = ref(false);

    const isValid = computed(() => {
      return (
        form.value.homeScore >= 0 &&
        form.value.awayScore >= 0 &&
        form.value.status
      );
    });

    const formatDate = (timestamp) => {
      return new Date(timestamp).toLocaleString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const handleSubmit = async () => {
      if (!isValid.value) return;

      loading.value = true;
      try {
        await emit('submit', {
          ...form.value,
          matchId: props.match._id
        });
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      isValid,
      formatDate,
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
    margin-bottom: 2rem;
    text-align: center;

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
        font-size: 0.875rem;
      }
    }

    .start-time {
      color: var(--text-secondary);
      font-size: 0.875rem;

      i {
        margin-right: 0.5rem;
      }
    }
  }

  .score-form {
    .score-inputs {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-secondary);
        font-weight: 500;
      }

      input,
      select,
      textarea {
        width: 100%;
        padding: 0.75rem 1rem;
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

      textarea {
        resize: vertical;
        min-height: 100px;
      }
    }

    .status-select {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 1rem center;
      background-size: 1rem;
      padding-right: 2.5rem;
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