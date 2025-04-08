import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default {
  namespaced: true,
  
  state: {
    users: [],
    transactions: [],
    loading: false,
    error: null
  },
  
  mutations: {
    SET_USERS(state, users) {
      state.users = users;
    },
    SET_TRANSACTIONS(state, transactions) {
      state.transactions = transactions;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    UPDATE_USER(state, updatedUser) {
      const index = state.users.findIndex(user => user._id === updatedUser._id);
      if (index !== -1) {
        state.users.splice(index, 1, updatedUser);
      }
    },
    UPDATE_TRANSACTION(state, updatedTransaction) {
      const index = state.transactions.findIndex(transaction => transaction._id === updatedTransaction._id);
      if (index !== -1) {
        state.transactions.splice(index, 1, updatedTransaction);
      }
    }
  },
  
  actions: {
    async fetchUsers({ commit }) {
      try {
        commit('SET_LOADING', true);
        const response = await axios.get(`${API_URL}/admin/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        commit('SET_USERS', response.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la récupération des utilisateurs');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async fetchTransactions({ commit }) {
      try {
        commit('SET_LOADING', true);
        const response = await axios.get(`${API_URL}/admin/transactions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        commit('SET_TRANSACTIONS', response.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la récupération des transactions');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async suspendUser({ commit }, userId) {
      try {
        commit('SET_LOADING', true);
        const response = await axios.post(
          `${API_URL}/admin/users/${userId}/suspend`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        commit('UPDATE_USER', response.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la suspension de l\'utilisateur');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async activateUser({ commit }, userId) {
      try {
        commit('SET_LOADING', true);
        const response = await axios.post(
          `${API_URL}/admin/users/${userId}/activate`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        commit('UPDATE_USER', response.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de l\'activation de l\'utilisateur');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async banUser({ commit }, userId) {
      try {
        commit('SET_LOADING', true);
        const response = await axios.post(
          `${API_URL}/admin/users/${userId}/ban`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        commit('UPDATE_USER', response.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors du bannissement de l\'utilisateur');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async approveTransaction({ commit }, transactionId) {
      try {
        commit('SET_LOADING', true);
        const response = await axios.post(
          `${API_URL}/admin/transactions/${transactionId}/approve`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        commit('UPDATE_TRANSACTION', response.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de l\'approbation de la transaction');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async rejectTransaction({ commit }, transactionId) {
      try {
        commit('SET_LOADING', true);
        const response = await axios.post(
          `${API_URL}/admin/transactions/${transactionId}/reject`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        commit('UPDATE_TRANSACTION', response.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors du rejet de la transaction');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },
  
  getters: {
    users: state => state.users,
    transactions: state => state.transactions,
    loading: state => state.loading,
    error: state => state.error,
    
    activeUsers: state => state.users.filter(user => user.status === 'active'),
    suspendedUsers: state => state.users.filter(user => user.status === 'suspended'),
    bannedUsers: state => state.users.filter(user => user.status === 'banned'),
    
    pendingTransactions: state => state.transactions.filter(transaction => transaction.status === 'pending'),
    completedTransactions: state => state.transactions.filter(transaction => transaction.status === 'completed'),
    rejectedTransactions: state => state.transactions.filter(transaction => transaction.status === 'rejected'),
    
    totalDeposits: state => state.transactions
      .filter(transaction => transaction.type === 'deposit' && transaction.status === 'completed')
      .reduce((total, transaction) => total + transaction.amount, 0),
    
    totalWithdrawals: state => state.transactions
      .filter(transaction => transaction.type === 'withdrawal' && transaction.status === 'completed')
      .reduce((total, transaction) => total + transaction.amount, 0)
  }
}; 