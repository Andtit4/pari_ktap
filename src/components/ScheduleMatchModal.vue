<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Programmer un Match</h2>
        <button class="close-btn" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleSubmit" class="match-form">
          <div class="form-group">
            <label for="homeTeam">Équipe à domicile</label>
            <input
              id="homeTeam"
              v-model="form.homeTeam"
              type="text"
              required
              placeholder="Nom de l'équipe à domicile"
            />
          </div>

          <div class="form-group">
            <label for="awayTeam">Équipe à l'extérieur</label>
            <input
              id="awayTeam"
              v-model="form.awayTeam"
              type="text"
              required
              placeholder="Nom de l'équipe à l'extérieur"
            />
          </div>

          <div class="form-group">
            <label for="startTime">Date et heure de début</label>
            <input
              id="startTime"
              v-model="form.startTime"
              type="datetime-local"
              required
              :min="minDateTime"
            />
          </div>

          <div class="odds-section">
            <h3>Cotes</h3>
            <div class="odds-grid">
              <div class="form-group">
                <label for="homeOdd">Cote domicile</label>
                <input
                  id="homeOdd"
                  v-model.number="form.odds.home"
                  type="number"
                  step="0.01"
                  min="1.01"
                  required
                  placeholder="1.50"
                />
              </div>

              <div class="form-group">
                <label for="drawOdd">Cote nul</label>
                <input
                  id="drawOdd"
                  v-model.number="form.odds.draw"
                  type="number"
                  step="0.01"
                  min="1.01"
                  required
                  placeholder="3.50"
                />
              </div>

              <div class="form-group">
                <label for="awayOdd">Cote extérieur</label>
                <input
                  id="awayOdd"
                  v-model.number="form.odds.away"
                  type="number"
                  step="0.01"
                  min="1.01"
                  required
                  placeholder="4.50"
                />
              </div>
            </div>
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
              <span v-else>Programmer le match</span>
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
  name: 'ScheduleMatchModal',
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const form = ref({
      homeTeam: '',
      awayTeam: '',
      startTime: '',
      odds: {
        home: null,
        draw: null,
        away: null
      }
    });

    const loading = ref(false);

    const minDateTime = computed(() => {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 5);
      return now.toISOString().slice(0, 16);
    });

    const isValid = computed(() => {
      return (
        form.value.homeTeam &&
        form.value.awayTeam &&
        form.value.startTime &&
        form.value.odds.home > 1 &&
        form.value.odds.draw > 1 &&
        form.value.odds.away > 1
      );
    });

    const handleSubmit = async () => {
      if (!isValid.value) return;

      loading.value = true;
      try {
        await emit('submit', {
          ...form.value,
          startTime: new Date(form.value.startTime).getTime()
        });
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      minDateTime,
      isValid,
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

  .match-form {
    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-secondary);
        font-weight: 500;
      }

      input {
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
    }

    .odds-section {
      margin-bottom: 1.5rem;

      h3 {
        font-size: 1.125rem;
        color: var(--text-primary);
        margin-bottom: 1rem;
      }

      .odds-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
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
 
 