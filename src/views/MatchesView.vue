<template>
  <div class="matches-container">
    <!-- Notification d'erreur -->
    <div v-if="error" class="error-notification">
      <i class="fas fa-exclamation-circle"></i>
      {{ error }}
      <button class="close-btn" @click="error = null">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <div class="matches-header">
      <h1>Matches en direct</h1>
      <div class="matches-filters">
        <button 
          class="filter-btn" 
          :class="{ active: activeFilter === 'all' }"
          @click="activeFilter = 'all'"
        >
          Tous
        </button>
        <button 
          class="filter-btn" 
          :class="{ active: activeFilter === 'live' }"
          @click="activeFilter = 'live'"
        >
          En direct
        </button>
        <button 
          class="filter-btn" 
          :class="{ active: activeFilter === 'upcoming' }"
          @click="activeFilter = 'upcoming'"
        >
          À venir
        </button>
      </div>
    </div>

    <!-- Matches en direct -->
    <div v-if="activeFilter === 'all' || activeFilter === 'live'" class="matches-section">
      <h2>Matches en direct</h2>
      <div v-if="loading" class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        Chargement des matches...
      </div>
      <div v-else-if="liveMatches.length === 0" class="no-matches">
        <i class="fas fa-info-circle"></i>
        Aucun match en direct pour le moment
      </div>
      <div v-else class="matches-grid">
        <div v-for="match in liveMatches" :key="match._id" class="match-card">
          <div class="match-header">
            <div class="match-teams">
              <span class="team">{{ match.teamA?.name }}</span>
              <span class="vs">VS</span>
              <span class="team">{{ match.teamB?.name }}</span>
            </div>
            <div class="match-time">
              <i class="fas fa-clock"></i>
              {{ formatTime(match.startTime) }}
            </div>
          </div>
          
          <div class="match-score" v-if="match.status === 'live'">
            <span class="score">{{ match.teamA?.score || 0 }} - {{ match.teamB?.score || 0 }}</span>
            <span class="status live">En direct</span>
          </div>
          
          <div class="match-odds">
            <div class="odd-group">
              <button 
                class="odd-btn" 
                :class="{ selected: selectedBet?.matchId === match._id && selectedBet?.choice === 'teamA' }"
                @click="selectBet(match, 'teamA')"
                :disabled="!isAuthenticated || match.status !== 'live'"
              >
                <span class="team-name">{{ match.teamA?.name }}</span>
                <span class="odd-value">{{ match.odds?.teamA || 2.0 }}</span>
              </button>
              
              <button 
                class="odd-btn" 
                :class="{ selected: selectedBet?.matchId === match._id && selectedBet?.choice === 'draw' }"
                @click="selectBet(match, 'draw')"
                :disabled="!isAuthenticated || match.status !== 'live'"
              >
                <span class="team-name">Match nul</span>
                <span class="odd-value">{{ match.odds?.draw || 3.0 }}</span>
              </button>
              
              <button 
                class="odd-btn" 
                :class="{ selected: selectedBet?.matchId === match._id && selectedBet?.choice === 'teamB' }"
                @click="selectBet(match, 'teamB')"
                :disabled="!isAuthenticated || match.status !== 'live'"
              >
                <span class="team-name">{{ match.teamB?.name }}</span>
                <span class="odd-value">{{ match.odds?.teamB || 2.0 }}</span>
              </button>
            </div>
          </div>
          
          <div v-if="selectedBet?.matchId === match._id" class="bet-form">
            <div class="bet-amount">
              <label>Montant du pari (KTAP)</label>
              <input 
                type="number" 
                v-model="betAmount" 
                min="1" 
                :max="userBalance"
                class="amount-input"
                :class="{ 'error': betAmount > userBalance }"
              />
              <div v-if="betAmount > userBalance" class="error-message">
                Solde KTAP insuffisant. Votre solde : {{ formatBalance(userBalance) }} KTAP
              </div>
            </div>
            <div class="potential-winnings">
              <span>Gains potentiels:</span>
              <span class="winnings-amount">{{ formatBalance(calculateWinnings(match, selectedBet.choice, betAmount)) }} KTAP</span>
            </div>
            <button 
              class="place-bet-btn" 
              @click="placeBet(match)"
              :disabled="!canPlaceBet"
            >
              Placer le pari
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Matches à venir -->
    <div v-if="activeFilter === 'all' || activeFilter === 'upcoming'" class="matches-section">
      <h2>Matches à venir</h2>
      <div v-if="loading" class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        Chargement des matches...
      </div>
      <div v-else-if="upcomingMatches.length === 0" class="no-matches">
        <i class="fas fa-info-circle"></i>
        Aucun match à venir pour le moment
      </div>
      <div v-else class="matches-grid">
        <div v-for="match in upcomingMatches" :key="match._id" class="match-card upcoming">
          <div class="match-header">
            <div class="match-teams">
              <span class="team">{{ match.teamA?.name }}</span>
              <span class="vs">VS</span>
              <span class="team">{{ match.teamB?.name }}</span>
            </div>
            <div class="match-time">
              <i class="fas fa-calendar"></i>
              {{ formatDate(match.startTime) }}
            </div>
          </div>
          
          <div class="match-odds">
            <div class="odd-group">
              <div class="odd-display">
                <span class="team-name">{{ match.teamA?.name }}</span>
                <span class="odd-value">{{ match.odds?.teamA || 2.0 }}</span>
              </div>
              
              <div class="odd-display">
                <span class="team-name">Match nul</span>
                <span class="odd-value">{{ match.odds?.draw || 3.0 }}</span>
              </div>
              
              <div class="odd-display">
                <span class="team-name">{{ match.teamB?.name }}</span>
                <span class="odd-value">{{ match.odds?.teamB || 2.0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, inject } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'MatchesView',
  
  setup() {
    const store = useStore();
    const openLoginModal = inject('openLoginModal');
    
    const loading = ref(false);
    const error = ref(null);
    const activeFilter = ref('all');
    const selectedBet = ref(null);
    const betAmount = ref(1);
    
    const matches = computed(() => store.state.matches.matches || []);
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
    const userBalance = computed(() => store.getters['auth/balance']);
    
    const liveMatches = computed(() => {
      return matches.value.filter(match => match.status === 'live');
    });
    
    const upcomingMatches = computed(() => {
      return matches.value.filter(match => match.status === 'scheduled');
    });
    
    const canPlaceBet = computed(() => {
      if (!selectedBet.value || !betAmount.value) return false;
      if (betAmount.value < 1) return false;
      if (betAmount.value > userBalance.value) return false;
      return true;
    });
    
    const formatDate = (date) => {
      if (!date) return '';
      return new Date(date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    const formatTime = (date) => {
      if (!date) return '';
      return new Date(date).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    const formatBalance = (value) => {
      return new Intl.NumberFormat('fr-FR').format(value || 0);
    };
    
    const selectBet = (match, choice) => {
      if (!isAuthenticated.value) {
        openLoginModal();
        return;
      }
      
      selectedBet.value = {
        matchId: match._id,
        choice,
        odds: match.odds[choice]
      };
      
      betAmount.value = 1;
    };
    
    const calculateWinnings = (match, choice, amount) => {
      if (!match || !choice || !amount) return 0;
      return Math.round(amount * match.odds[choice]);
    };
    
    const placeBet = async (match) => {
      if (!canPlaceBet.value) return;
      
      try {
        error.value = null;
        await store.dispatch('bets/placeBet', {
          matchId: match._id,
          betType: selectedBet.value.choice,
          amount: betAmount.value
        });
        
        selectedBet.value = null;
        betAmount.value = 1;
      } catch (error) {
        console.error('Erreur lors du placement du pari:', error);
        error.value = error.response?.data?.message || 'Erreur lors du placement du pari. Veuillez réessayer.';
      }
    };
    
    onMounted(async () => {
      loading.value = true;
      try {
        await store.dispatch('matches/fetchMatches');
      } catch (error) {
        console.error('Erreur lors du chargement des matches:', error);
      } finally {
        loading.value = false;
      }
    });
    
    return {
      loading,
      error,
      activeFilter,
      selectedBet,
      betAmount,
      liveMatches,
      upcomingMatches,
      isAuthenticated,
      userBalance,
      canPlaceBet,
      formatDate,
      formatTime,
      formatBalance,
      selectBet,
      calculateWinnings,
      placeBet
    };
  }
};
</script>

<style lang="scss" scoped>
.matches-container {
  .matches-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    
    h1 {
      font-size: 2rem;
      color: #fff;
    }
    
    .matches-filters {
      display: flex;
      gap: 1rem;
      
      .filter-btn {
        padding: 0.5rem 1rem;
        border: 1px solid #333;
        border-radius: 4px;
        background-color: transparent;
        color: #fff;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          background-color: #333;
        }
        
        &.active {
          background-color: #4CAF50;
          border-color: #4CAF50;
        }
      }
    }
  }
  
  .matches-section {
    margin-bottom: 3rem;
    
    h2 {
      font-size: 1.5rem;
      color: #fff;
      margin-bottom: 1.5rem;
    }
    
    .loading, .no-matches {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 2rem;
      background-color: #1a1a1a;
      border-radius: 8px;
      color: #888;
      
      i {
        font-size: 1.2rem;
      }
    }
    
    .matches-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      
      .match-card {
        background-color: #1a1a1a;
        border-radius: 8px;
        padding: 1.5rem;
        
        &.upcoming {
          opacity: 0.8;
        }
        
        .match-header {
          margin-bottom: 1.5rem;
          
          .match-teams {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1rem;
            
            .team {
              font-weight: 500;
              color: #fff;
            }
            
            .vs {
              color: #888;
              font-size: 0.9rem;
            }
          }
          
          .match-time {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #888;
            font-size: 0.9rem;
            
            i {
              color: #4CAF50;
            }
          }
        }
        
        .match-score {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          
          .score {
            font-size: 1.5rem;
            font-weight: bold;
            color: #fff;
          }
          
          .status {
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 500;
            
            &.live {
              background-color: #f44336;
              color: white;
            }
          }
        }
        
        .match-odds {
          .odd-group {
            display: grid;
            gap: 0.5rem;
            
            .odd-btn, .odd-display {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0.75rem;
              border-radius: 4px;
              background-color: #2d2d2d;
              
              .team-name {
                color: #fff;
              }
              
              .odd-value {
                font-weight: 500;
                color: #4CAF50;
              }
            }
            
            .odd-btn {
              border: none;
              cursor: pointer;
              transition: all 0.3s ease;
              
              &:hover:not(:disabled) {
                background-color: #333;
                transform: translateY(-2px);
              }
              
              &:disabled {
                opacity: 0.5;
                cursor: not-allowed;
              }
              
              &.selected {
                background-color: #4CAF50;
                
                .team-name, .odd-value {
                  color: white;
                }
              }
            }
          }
        }
        
        .bet-form {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #333;
          
          .bet-amount {
            margin-bottom: 1rem;
            
            label {
              display: block;
              color: #888;
              font-size: 0.9rem;
              margin-bottom: 0.5rem;
            }
            
            .amount-input {
              width: 100%;
              padding: 0.5rem;
              border: 1px solid #333;
              border-radius: 4px;
              background-color: #2d2d2d;
              color: #fff;
              
              &:focus {
                outline: none;
                border-color: #4CAF50;
              }
              
              &.error {
                border-color: #f44336;
              }
            }
            
            .error-message {
              color: #f44336;
              font-size: 0.8rem;
              margin-top: 0.5rem;
            }
          }
          
          .potential-winnings {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            color: #888;
            font-size: 0.9rem;
            
            .winnings-amount {
              color: #4CAF50;
              font-weight: 500;
            }
          }
          
          .place-bet-btn {
            width: 100%;
            padding: 0.75rem;
            border: none;
            border-radius: 4px;
            background-color: #4CAF50;
            color: white;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            
            &:hover:not(:disabled) {
              background-color: #45a049;
              transform: translateY(-2px);
            }
            
            &:disabled {
              opacity: 0.7;
              cursor: not-allowed;
            }
          }
        }
      }
    }
  }

  .error-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #f44336;
    color: white;
    padding: 1rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    
    i {
      font-size: 1.2rem;
    }
    
    .close-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 0.25rem;
      margin-left: 1rem;
      
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style> 
 
 