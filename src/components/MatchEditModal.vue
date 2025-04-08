<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ isEdit ? 'Modifier le match' : 'Nouveau match' }}</h2>
        <button class="close-btn" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleSubmit" class="match-form">
          <div class="form-group">
            <label for="sport">Sport</label>
            <select 
              id="sport"
              v-model="formData.sport"
              :class="{ 'error': errors.sport }"
              required
            >
              <option value="">Sélectionner un sport</option>
              <option value="football">Football</option>
              <option value="basketball">Basketball</option>
              <option value="tennis">Tennis</option>
            </select>
            <span class="error-message" v-if="errors.sport">
              {{ errors.sport }}
            </span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="team1">Équipe 1</label>
              <input 
                id="team1"
                type="text"
                v-model="formData.team1"
                :class="{ 'error': errors.team1 }"
                placeholder="Nom de l'équipe 1"
                required
              >
              <span class="error-message" v-if="errors.team1">
                {{ errors.team1 }}
              </span>
            </div>

            <div class="form-group">
              <label for="team2">Équipe 2</label>
              <input 
                id="team2"
                type="text"
                v-model="formData.team2"
                :class="{ 'error': errors.team2 }"
                placeholder="Nom de l'équipe 2"
                required
              >
              <span class="error-message" v-if="errors.team2">
                {{ errors.team2 }}
              </span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="date">Date</label>
              <input 
                id="date"
                type="date"
                v-model="formData.date"
                :class="{ 'error': errors.date }"
                :min="minDate"
                required
              >
              <span class="error-message" v-if="errors.date">
                {{ errors.date }}
              </span>
            </div>

            <div class="form-group">
              <label for="time">Heure</label>
              <input 
                id="time"
                type="time"
                v-model="formData.time"
                :class="{ 'error': errors.time }"
                required
              >
              <span class="error-message" v-if="errors.time">
                {{ errors.time }}
              </span>
            </div>
          </div>

          <div class="form-row" v-if="isEdit">
            <div class="form-group">
              <label for="score1">Score Équipe 1</label>
              <input 
                id="score1"
                type="number"
                v-model="formData.score1"
                :class="{ 'error': errors.score1 }"
                min="0"
                :disabled="formData.status === 'scheduled'"
              >
              <span class="error-message" v-if="errors.score1">
                {{ errors.score1 }}
              </span>
            </div>

            <div class="form-group">
              <label for="score2">Score Équipe 2</label>
              <input 
                id="score2"
                type="number"
                v-model="formData.score2"
                :class="{ 'error': errors.score2 }"
                min="0"
                :disabled="formData.status === 'scheduled'"
              >
              <span class="error-message" v-if="errors.score2">
                {{ errors.score2 }}
              </span>
            </div>
          </div>

          <div class="form-group" v-if="isEdit">
            <label for="status">Statut</label>
            <select 
              id="status"
              v-model="formData.status"
              :class="{ 'error': errors.status }"
              required
            >
              <option value="scheduled">Programmé</option>
              <option value="live">En direct</option>
              <option value="finished">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>
            <span class="error-message" v-if="errors.status">
              {{ errors.status }}
            </span>
          </div>

          <div class="form-actions">
            <button 
              type="button" 
              class="btn-secondary"
              @click="$emit('close')"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              class="btn-primary"
              :disabled="loading"
            >
              <i class="fas fa-spinner fa-spin" v-if="loading"></i>
              <span v-else>{{ isEdit ? 'Enregistrer' : 'Créer' }}</span>
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
  name: 'MatchEditModal',
  props: {
    match: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const isEdit = computed(() => !!props.match);

    const formData = ref({
      sport: '',
      team1: '',
      team2: '',
      date: '',
      time: '',
      score1: 0,
      score2: 0,
      status: 'scheduled',
      ...props.match
    });

    const errors = ref({});

    const minDate = computed(() => {
      const today = new Date();
      return today.toISOString().split('T')[0];
    });

    const validateForm = () => {
      errors.value = {};

      if (!formData.value.sport) {
        errors.value.sport = 'Le sport est requis';
      }

      if (!formData.value.team1) {
        errors.value.team1 = 'L\'équipe 1 est requise';
      }

      if (!formData.value.team2) {
        errors.value.team2 = 'L\'équipe 2 est requise';
      }

      if (formData.value.team1 === formData.value.team2) {
        errors.value.team2 = 'Les équipes doivent être différentes';
      }

      if (!formData.value.date) {
        errors.value.date = 'La date est requise';
      }

      if (!formData.value.time) {
        errors.value.time = 'L\'heure est requise';
      }

      if (formData.value.status !== 'scheduled') {
        if (formData.value.score1 < 0) {
          errors.value.score1 = 'Le score ne peut pas être négatif';
        }

        if (formData.value.score2 < 0) {
          errors.value.score2 = 'Le score ne peut pas être négatif';
        }
      }

      return Object.keys(errors.value).length === 0;
    };

    const handleSubmit = () => {
      if (!validateForm()) return;

      const matchData = {
        ...formData.value,
        date: new Date(`${formData.value.date}T${formData.value.time}`)
      };

      emit('submit', matchData);
    };

    return {
      isEdit,
      formData,
      errors,
      minDate,
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
  max-width: 600px;
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
      margin-bottom: 1rem;

      label {
        display: block;
        color: var(--text-secondary);
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
      }

      input,
      select {
        width: 100%;
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

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        &.error {
          border-color: var(--danger);
        }
      }

      .error-message {
        display: block;
        color: var(--danger);
        font-size: 0.75rem;
        margin-top: 0.25rem;
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;

      button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        i {
          font-size: 1rem;
        }
      }

      .btn-secondary {
        background: var(--bg-secondary);
        color: var(--text-primary);

        &:hover:not(:disabled) {
          background: var(--bg-hover);
        }
      }

      .btn-primary {
        background: var(--primary);
        color: white;

        &:hover:not(:disabled) {
          background: var(--primary-dark);
        }
      }
    }
  }
}
</style> 