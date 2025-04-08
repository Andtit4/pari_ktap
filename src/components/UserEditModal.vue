<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ isNew ? 'Nouvel utilisateur' : 'Modifier l\'utilisateur' }}</h2>
        <button class="close-btn" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleSubmit" class="edit-form">
          <div class="form-group">
            <label for="username">Nom d'utilisateur</label>
            <div class="input-group">
              <i class="fas fa-user"></i>
              <input 
                type="text"
                id="username"
                v-model="form.username"
                :class="{ 'error': errors.username }"
                placeholder="Entrez le nom d'utilisateur"
                required
              >
            </div>
            <span v-if="errors.username" class="error-message">
              {{ errors.username }}
            </span>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <div class="input-group">
              <i class="fas fa-envelope"></i>
              <input 
                type="email"
                id="email"
                v-model="form.email"
                :class="{ 'error': errors.email }"
                placeholder="Entrez l'email"
                required
              >
            </div>
            <span v-if="errors.email" class="error-message">
              {{ errors.email }}
            </span>
          </div>

          <div class="form-group">
            <label for="phone">Téléphone</label>
            <div class="input-group">
              <i class="fas fa-phone"></i>
              <input 
                type="tel"
                id="phone"
                v-model="form.phone"
                :class="{ 'error': errors.phone }"
                placeholder="Entrez le numéro de téléphone"
              >
            </div>
            <span v-if="errors.phone" class="error-message">
              {{ errors.phone }}
            </span>
          </div>

          <div class="form-group">
            <label for="role">Rôle</label>
            <div class="input-group">
              <i class="fas fa-user-shield"></i>
              <select 
                id="role"
                v-model="form.role"
                :class="{ 'error': errors.role }"
                required
              >
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
            <span v-if="errors.role" class="error-message">
              {{ errors.role }}
            </span>
          </div>

          <div class="form-group">
            <label for="status">Statut</label>
            <div class="input-group">
              <i class="fas fa-toggle-on"></i>
              <select 
                id="status"
                v-model="form.status"
                :class="{ 'error': errors.status }"
                required
              >
                <option value="active">Actif</option>
                <option value="suspended">Suspendu</option>
                <option value="banned">Banni</option>
              </select>
            </div>
            <span v-if="errors.status" class="error-message">
              {{ errors.status }}
            </span>
          </div>

          <div class="form-group">
            <label for="balance">Solde KTAP</label>
            <div class="input-group">
              <i class="fas fa-coins"></i>
              <input 
                type="number"
                id="balance"
                v-model="form.balance"
                :class="{ 'error': errors.balance }"
                placeholder="Entrez le solde"
                min="0"
                step="0.01"
                required
              >
            </div>
            <span v-if="errors.balance" class="error-message">
              {{ errors.balance }}
            </span>
          </div>

          <div v-if="isNew" class="form-group">
            <label for="password">Mot de passe</label>
            <div class="input-group">
              <i class="fas fa-lock"></i>
              <input 
                type="password"
                id="password"
                v-model="form.password"
                :class="{ 'error': errors.password }"
                placeholder="Entrez le mot de passe"
                required
              >
            </div>
            <span v-if="errors.password" class="error-message">
              {{ errors.password }}
            </span>
          </div>

          <div class="form-actions">
            <button 
              type="button" 
              class="btn-secondary"
              @click="$emit('close')"
              :disabled="loading"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              class="btn-primary"
              :disabled="loading"
            >
              <i class="fas fa-save"></i>
              {{ isNew ? 'Créer' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'UserEditModal',
  props: {
    user: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const form = ref({
      username: '',
      email: '',
      phone: '',
      role: 'user',
      status: 'active',
      balance: 0,
      password: ''
    });

    const errors = ref({});

    const isNew = computed(() => !props.user);

    const validateForm = () => {
      errors.value = {};
      let isValid = true;

      if (!form.value.username) {
        errors.value.username = 'Le nom d\'utilisateur est requis';
        isValid = false;
      }

      if (!form.value.email) {
        errors.value.email = 'L\'email est requis';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        errors.value.email = 'L\'email n\'est pas valide';
        isValid = false;
      }

      if (form.value.phone && !/^[0-9+\s-]{10,}$/.test(form.value.phone)) {
        errors.value.phone = 'Le numéro de téléphone n\'est pas valide';
        isValid = false;
      }

      if (!form.value.role) {
        errors.value.role = 'Le rôle est requis';
        isValid = false;
      }

      if (!form.value.status) {
        errors.value.status = 'Le statut est requis';
        isValid = false;
      }

      if (form.value.balance < 0) {
        errors.value.balance = 'Le solde ne peut pas être négatif';
        isValid = false;
      }

      if (isNew.value && !form.value.password) {
        errors.value.password = 'Le mot de passe est requis';
        isValid = false;
      } else if (isNew.value && form.value.password.length < 6) {
        errors.value.password = 'Le mot de passe doit contenir au moins 6 caractères';
        isValid = false;
      }

      return isValid;
    };

    const handleSubmit = () => {
      if (!validateForm()) return;

      const userData = { ...form.value };
      if (!isNew.value) {
        delete userData.password;
      }

      emit('save', userData);
    };

    onMounted(() => {
      if (props.user) {
        form.value = {
          ...props.user,
          password: ''
        };
      }
    });

    return {
      form,
      errors,
      isNew,
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

  .edit-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      label {
        color: var(--text-secondary);
        font-size: 0.875rem;
      }

      .input-group {
        position: relative;

        i {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
        }

        input,
        select {
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

          &.error {
            border-color: var(--danger);
          }
        }

        select {
          appearance: none;
          padding-right: 2.5rem;
          cursor: pointer;

          &::-ms-expand {
            display: none;
          }
        }
      }

      .error-message {
        color: var(--danger);
        font-size: 0.75rem;
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;

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

      .btn-primary {
        background: var(--primary);
        color: white;

        &:hover:not(:disabled) {
          background: var(--primary-dark);
        }
      }

      .btn-secondary {
        background: var(--bg-secondary);
        color: var(--text-primary);

        &:hover:not(:disabled) {
          background: var(--bg-hover);
        }
      }
    }
  }
}
</style> 