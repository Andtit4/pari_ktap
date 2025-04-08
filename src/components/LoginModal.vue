<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">Connexion</h5>
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
            />
          </div>
          <div class="d-grid">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Connexion...' : 'Se connecter' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const emit = defineEmits(['close']);

const username = ref('');
const password = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  try {
    loading.value = true;
    await store.dispatch('auth/login', {
      username: username.value,
      password: password.value
    });
    emit('close');
  } catch (error) {
    alert(error.message || 'Erreur de connexion');
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