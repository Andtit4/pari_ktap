import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default {
  namespaced: true,
  
  state: {
    matches: [],
    liveMatches: [],
    currentMatch: null,
    loading: false,
    error: null
  },
  
  mutations: {
    SET_MATCHES(state, matches) {
      state.matches = matches;
    },
    
    SET_LIVE_MATCHES(state, matches) {
      state.liveMatches = matches;
    },
    
    SET_CURRENT_MATCH(state, match) {
      state.currentMatch = match;
    },
    
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    
    SET_ERROR(state, error) {
      state.error = error;
    },
    
    UPDATE_MATCH(state, updatedMatch) {
      const index = state.matches.findIndex(m => m._id === updatedMatch._id);
      if (index !== -1) {
        state.matches.splice(index, 1, updatedMatch);
      }
      
      if (state.currentMatch?._id === updatedMatch._id) {
        state.currentMatch = updatedMatch;
      }
      
      const liveIndex = state.liveMatches.findIndex(m => m._id === updatedMatch._id);
      if (liveIndex !== -1) {
        if (updatedMatch.status === 'live') {
          state.liveMatches.splice(liveIndex, 1, updatedMatch);
        } else {
          state.liveMatches.splice(liveIndex, 1);
        }
      } else if (updatedMatch.status === 'live') {
        state.liveMatches.push(updatedMatch);
      }
    },
    
    ADD_MATCH(state, match) {
      state.matches.unshift(match);
    }
  },
  
  actions: {
    async fetchMatches({ commit, state }) {
      try {
        commit('SET_LOADING', true);
        const response = await axios.get(`${API_URL}/matches`);
        commit('SET_MATCHES', response.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error || 'Erreur lors de la récupération des matchs');
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async fetchLiveMatches({ commit, state }) {
      try {
        commit('SET_LOADING', true);
        const response = await axios.get(`${API_URL}/matches/live`);
        commit('SET_LIVE_MATCHES', response.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error || 'Erreur lors de la récupération des matchs en direct');
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async fetchMatch({ commit, state }, matchId) {
      try {
        commit('SET_LOADING', true);
        const response = await axios.get(`${API_URL}/matches/${matchId}`);
        commit('SET_CURRENT_MATCH', response.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error || 'Erreur lors de la récupération du match');
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async createMatch({ commit, state }, matchData) {
      try {
        commit('SET_LOADING', true);
        const response = await axios.post(
          `${API_URL}/matches`,
          matchData,
          {
            headers: {
              Authorization: `Bearer ${state.auth?.token}`
            }
          }
        );
        commit('SET_MATCHES', [...state.matches, response.data]);
        return response.data;
      } catch (error) {
        throw error.response?.data?.error || 'Erreur lors de la création du match';
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async updateMatchScore({ commit }, { matchId, teamAScore, teamBScore }) {
      try {
        commit('SET_LOADING', true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token d\'authentification manquant');
        }
        
        const response = await axios.patch(
          `${API_URL}/matches/${matchId}/score`,
          { teamAScore, teamBScore },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        commit('UPDATE_MATCH', response.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la mise à jour du score');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async updateMatchStatus({ commit, state }, { matchId, status, winner }) {
      try {
        commit('SET_LOADING', true);
        const response = await axios.patch(
          `${API_URL}/matches/${matchId}/status`,
          { status, winner },
          {
            headers: {
              Authorization: `Bearer ${state.auth?.token}`
            }
          }
        );
        commit('UPDATE_MATCH', response.data);
        return response.data;
      } catch (error) {
        throw error.response?.data?.error || 'Erreur lors de la mise à jour du statut';
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async fetchAdminMatches({ commit }) {
      try {
        commit('SET_LOADING', true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/matches/admin/matches`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        commit('SET_MATCHES', response.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la récupération des matches');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async createMatchAdmin({ commit }, matchData) {
      try {
        commit('SET_LOADING', true);
        const token = localStorage.getItem('token');
        
        // S'assurer que les données sont correctement formatées
        const formattedData = {
          teamA: matchData.teamA,
          teamB: matchData.teamB,
          startTime: matchData.startTime
        };
        
        const response = await axios.post(`${API_URL}/matches/admin/matches`, formattedData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        commit('ADD_MATCH', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la création du match');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async updateMatchAdmin({ commit }, { matchId, matchData }) {
      try {
        commit('SET_LOADING', true);
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/matches/admin/matches/${matchId}`, matchData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        commit('UPDATE_MATCH', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la mise à jour du match');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async deleteMatchAdmin({ commit }, matchId) {
      try {
        commit('SET_LOADING', true);
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/matches/admin/matches/${matchId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        commit('SET_MATCHES', state.matches.filter(match => match._id !== matchId));
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la suppression du match');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async startMatch({ commit, state }, matchId) {
      try {
        commit('SET_LOADING', true);
        const token = localStorage.getItem('token');
        const response = await axios.patch(
          `${API_URL}/matches/admin/matches/${matchId}/start`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        commit('UPDATE_MATCH', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors du démarrage du match');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },
  
  getters: {
    allMatches: state => state.matches,
    liveMatches: state => state.liveMatches,
    currentMatch: state => state.currentMatch,
    isLoading: state => state.loading,
    error: state => state.error,
    
    upcomingMatches: state => {
      const now = new Date();
      return state.matches.filter(match => 
        new Date(match.startTime) > now && match.status === 'scheduled'
      );
    },
    
    pastMatches: state => {
      const now = new Date();
      return state.matches.filter(match => 
        new Date(match.startTime) < now || match.status === 'finished'
      );
    }
  }
}; 
 
 