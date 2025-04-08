import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default {
  namespaced: true,
  
  state: {
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('token')
  },
  
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      state.isAuthenticated = !!token;
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    },
    
    SET_USER(state, user) {
      state.user = user;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    }
  },
  
  actions: {
    async register({ commit }, credentials) {
      try {
        const response = await axios.post(`${API_URL}/auth/register`, credentials);
        const { token, user } = response.data;
        
        commit('SET_TOKEN', token);
        commit('SET_USER', user);
        
        return response.data;
      } catch (error) {
        throw error.response?.data?.error || 'Erreur lors de l\'inscription';
      }
    },
    
    async login({ commit }, credentials) {
      try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        const { token, user } = response.data;
        
        commit('SET_TOKEN', token);
        commit('SET_USER', user);
        
        return response.data;
      } catch (error) {
        throw error.response?.data?.error || 'Erreur lors de la connexion';
      }
    },
    
    async logout({ commit }) {
      commit('SET_TOKEN', null);
      commit('SET_USER', null);
    },
    
    async deposit({ commit, state }, { amount }) {
      try {
        const response = await axios.post(
          `${API_URL}/auth/deposit`,
          { amount },
          {
            headers: {
              Authorization: `Bearer ${state.token}`
            }
          }
        );
        
        commit('SET_USER', {
          ...state.user,
          ktapBalance: response.data.newBalance,
          isFirstDeposit: false
        });
        
        return response.data;
      } catch (error) {
        throw error.response?.data?.error || 'Erreur lors du dépôt';
      }
    },
    
    async withdraw({ commit, state }, { amount }) {
      try {
        const response = await axios.post(
          `${API_URL}/auth/withdraw`,
          { amount },
          {
            headers: {
              Authorization: `Bearer ${state.token}`
            }
          }
        );
        
        commit('SET_USER', {
          ...state.user,
          ktapBalance: response.data.newBalance
        });
        
        return response.data;
      } catch (error) {
        throw error.response?.data?.error || 'Erreur lors du retrait';
      }
    },
    
    async fetchProfile({ commit, state }) {
      try {
        const response = await axios.get(`${API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${state.token}`
          }
        });
        
        commit('SET_USER', response.data);
        return response.data;
      } catch (error) {
        throw error.response?.data?.error || 'Erreur lors de la récupération du profil';
      }
    }
  },
  
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    currentUser: state => state.user,
    userBalance: state => state.user?.ktapBalance || 0,
    isAdmin: state => state.user?.isAdmin || false
  }
}; 