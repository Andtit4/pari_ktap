import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default {
  namespaced: true,
  
  state: {
    userBets: [],
    matchBets: {},
    loading: false,
    error: null
  },
  
  mutations: {
    SET_USER_BETS(state, bets) {
      state.userBets = bets;
    },
    
    SET_MATCH_BETS(state, { matchId, bets }) {
      state.matchBets = {
        ...state.matchBets,
        [matchId]: bets
      };
    },
    
    ADD_BET(state, bet) {
      state.userBets.unshift(bet);
      if (state.matchBets[bet.match]) {
        state.matchBets[bet.match].unshift(bet);
      }
    },
    
    UPDATE_BET(state, updatedBet) {
      const userBetIndex = state.userBets.findIndex(b => b._id === updatedBet._id);
      if (userBetIndex !== -1) {
        state.userBets.splice(userBetIndex, 1, updatedBet);
      }
      
      if (state.matchBets[updatedBet.match]) {
        const matchBetIndex = state.matchBets[updatedBet.match].findIndex(
          b => b._id === updatedBet._id
        );
        if (matchBetIndex !== -1) {
          state.matchBets[updatedBet.match].splice(matchBetIndex, 1, updatedBet);
        }
      }
    },
    
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    
    SET_ERROR(state, error) {
      state.error = error;
    }
  },
  
  actions: {
    async fetchUserBets({ commit, state }) {
      try {
        commit('SET_LOADING', true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/bets/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        commit('SET_USER_BETS', response.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la récupération des paris');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async fetchMatchBets({ commit, state }, matchId) {
      try {
        commit('SET_LOADING', true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/bets/match/${matchId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        commit('SET_MATCH_BETS', { matchId, bets: response.data });
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la récupération des paris du match');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async placeBet({ commit, state }, { matchId, amount, betType }) {
      try {
        commit('SET_LOADING', true);
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${API_URL}/bets`,
          { matchId, amount, betType },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        commit('ADD_BET', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors du placement du pari');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async settleBets({ commit, state }, matchId) {
      try {
        commit('SET_LOADING', true);
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${API_URL}/bets/settle/${matchId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        // Mettre à jour les paris après le règlement
        await this.dispatch('bets/fetchUserBets');
        await this.dispatch('bets/fetchMatchBets', matchId);
        
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors du règlement des paris');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },
  
  getters: {
    userBets: state => state.userBets,
    matchBets: state => matchId => state.matchBets[matchId] || [],
    isLoading: state => state.loading,
    error: state => state.error,
    
    // Statistiques des paris
    betStats: state => {
      const stats = {
        total: state.userBets.length,
        won: state.userBets.filter(bet => bet.status === 'won').length,
        lost: state.userBets.filter(bet => bet.status === 'lost').length,
        pending: state.userBets.filter(bet => bet.status === 'pending').length,
        totalWinnings: state.userBets.reduce((sum, bet) => sum + (bet.actualWinnings || 0), 0)
      };
      
      stats.winRate = stats.total > 0 ? (stats.won / stats.total) * 100 : 0;
      
      return stats;
    }
  }
}; 