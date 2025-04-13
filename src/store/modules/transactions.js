import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const state = {
  deposits: [],
  withdrawals: [],
  loading: false,
  error: null
};

const mutations = {
  SET_DEPOSITS(state, deposits) {
    state.deposits = deposits;
  },
  SET_WITHDRAWALS(state, withdrawals) {
    state.withdrawals = withdrawals;
  },
  ADD_DEPOSIT(state, deposit) {
    state.deposits.unshift(deposit);
  },
  ADD_WITHDRAWAL(state, withdrawal) {
    state.withdrawals.unshift(withdrawal);
  },
  UPDATE_DEPOSIT(state, updatedDeposit) {
    const index = state.deposits.findIndex(d => d._id === updatedDeposit._id);
    if (index !== -1) {
      state.deposits.splice(index, 1, updatedDeposit);
    }
  },
  UPDATE_WITHDRAWAL(state, updatedWithdrawal) {
    const index = state.withdrawals.findIndex(w => w._id === updatedWithdrawal._id);
    if (index !== -1) {
      state.withdrawals.splice(index, 1, updatedWithdrawal);
    }
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  }
};

const actions = {
  async fetchDeposits({ commit }) {
    try {
      commit('SET_LOADING', true);
      const response = await axios.get(`${API_URL}/transactions/deposits`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      commit('SET_DEPOSITS', response.data);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la récupération des dépôts');
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async fetchWithdrawals({ commit }) {
    try {
      commit('SET_LOADING', true);
      const response = await axios.get(`${API_URL}/transactions/withdrawals`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      commit('SET_WITHDRAWALS', response.data);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la récupération des retraits');
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async createDeposit({ commit }, { amount, proofOfPayment }) {
    try {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);

      // Validation des données
      if (!amount || amount <= 0) {
        throw new Error('Le montant doit être supérieur à 0');
      }

      if (!proofOfPayment) {
        throw new Error('La preuve de paiement est requise');
      }

      const response = await axios.post(
        `${API_URL}/transactions/deposits`,
        { amount, proofOfPayment },
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        commit('ADD_DEPOSIT', response.data.deposit);
        return response.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors de la création du dépôt');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la création du dépôt';
      commit('SET_ERROR', errorMessage);
      throw new Error(errorMessage);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async createWithdrawal({ commit }, amount) {
    try {
      commit('SET_LOADING', true);
      const response = await axios.post(
        `${API_URL}/transactions/withdrawals`,
        { amount },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      commit('ADD_WITHDRAWAL', response.data);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la création du retrait');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async processDeposit({ commit }, { id, status }) {
    try {
      commit('SET_LOADING', true);
      const response = await axios.put(
        `${API_URL}/transactions/admin/deposits/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      commit('UPDATE_DEPOSIT', response.data);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Erreur lors du traitement du dépôt');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async processWithdrawal({ commit }, { id, status, reason }) {
    try {
      commit('SET_LOADING', true);
      const response = await axios.put(
        `${API_URL}/transactions/admin/withdrawals/${id}`,
        { status, reason },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      commit('UPDATE_WITHDRAWAL', response.data);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Erreur lors du traitement du retrait');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  }
};

const getters = {
  deposits: state => state.deposits,
  withdrawals: state => state.withdrawals,
  pendingDeposits: state => state.deposits.filter(d => d.status === 'pending'),
  pendingWithdrawals: state => state.withdrawals.filter(w => w.status === 'pending'),
  loading: state => state.loading,
  error: state => state.error
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}; 
 
 