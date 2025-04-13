<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">Inscription</h5>
        <button type="button" class="btn-close" @click="$emit('close')"></button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="username" class="form-label">Nom d'utilisateur</label>
            <input
              type="text"
              class="form-control"
              id="username"
              v-model="username"
              required
              minlength="3"
            />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="email"
              required
            />
          </div>
          <div class="mb-3">
            <label for="phoneNumber" class="form-label">Numéro de téléphone (optionnel)</label>
            <input
              type="tel"
              class="form-control"
              id="phoneNumber"
              v-model="phoneNumber"
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Mot de passe</label>
            <input
              type="password"
              class="form-control"
              id="password"
              v-model="password"
              required
              minlength="6"
            />
          </div>
          <div class="mb-3">
            <label for="confirmPassword" class="form-label">Confirmer le mot de passe</label>
            <input
              type="password"
              class="form-control"
              id="confirmPassword"
              v-model="confirmPassword"
              required
              minlength="6"
            />
          </div>
          <div class="d-grid">
            <button type="submit" class="btn btn-primary" :disabled="loading || !isFormValid">
              {{ loading ? 'Inscription...' : 'S\'inscrire' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const emit = defineEmits(['close']);

const username = ref('');
const email = ref('');
const phoneNumber = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);

const isFormValid = computed(() => {
  return (
    username.value.length >= 3 &&
    email.value &&
    password.value.length >= 6 &&
    password.value === confirmPassword.value
  );
});

const handleSubmit = async () => {
  if (!isFormValid.value) return;

  try {
    loading.value = true;
    await store.dispatch('auth/register', {
      username: username.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      password: password.value
    });
    emit('close');
  } catch (error) {
    alert(error.message || 'Erreur lors de l\'inscription');
  } finally {
    loading.value = false;
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #2d2d2d;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-title {
  color: #ffffff;
  margin: 0;
}

.btn-close {
  background-color: #ffffff;
  opacity: 0.5;
  
  &:hover {
    opacity: 0.75;
  }
}

.form-control {
  background-color: #1a1a1a;
  border: 1px solid #3d3d3d;
  color: #ffffff;
  
  &:focus {
    background-color: #1a1a1a;
    border-color: #007bff;
    color: #ffffff;
    box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
  }
}

.form-label {
  color: #ffffff;
}
</style> 
 
 