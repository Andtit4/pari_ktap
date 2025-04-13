<template>
  <div class="bets-container">
    <div class="row mb-4">
      <div class="col">
        <h2>Mes paris</h2>
      </div>
      <div class="col-auto">
        <div class="stats-card">
          <div class="stat-item">
            <span class="stat-label">Pari total</span>
            <span class="stat-value">{{ totalBets }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Gains totaux</span>
            <span class="stat-value">{{ totalWinnings }} KTAP</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Taux de réussite</span>
            <span class="stat-value">{{ winRate }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="filters mb-4">
      <div class="btn-group">
        <button 
          v-for="status in ['Tous', 'En cours', 'Gagnés', 'Perdus']" 
          :key="status"
          class="btn"
          :class="selectedStatus === status ? 'btn-primary' : 'btn-outline-primary'"
          @click="selectedStatus = status"
        >
          {{ status }}
        </button>
      </div>
    </div>

    <!-- Liste des paris -->
    <div class="bets-list">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
      </div>

      <div v-else-if="filteredBets.length === 0" class="no-bets">
        <p>Aucun pari trouvé.</p>
      </div>

      <div v-else class="row">
        <div class="col-12 col-md-6 col-lg-4 mb-4" v-for="bet in filteredBets" :key="bet._id">
          <div class="bet-card">
            <div class="bet-header">
              <span class="badge" :class="getStatusClass(bet.status)">
                {{ getStatusText(bet.status) }}
              </span>
              <span class="bet-date">{{ formatDate(bet.placedAt) }}</span>
            </div>

            <div class="match-info">
              <div class="teams">
                <span class="team">{{ bet.match?.teamA?.name || 'Équipe A' }}</span>
                <span class="vs">VS</span>
                <span class="team">{{ bet.match?.teamB?.name || 'Équipe B' }}</span>
              </div>
              <div class="scores" v-if="bet.match?.status === 'finished'">
                <span class="score">{{ bet.match?.teamA?.score || 0 }}</span>
                <span class="score">{{ bet.match?.teamB?.score || 0 }}</span>
              </div>
            </div>

            <div class="bet-details">
              <div class="detail-item">
                <span class="label">Votre choix</span>
                <span class="value">{{ getTeamName(bet.betType, bet.match) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Montant</span>
                <span class="value">{{ bet.amount }} KTAP</span>
              </div>
              <div class="detail-item" v-if="bet.status === 'won'">
                <span class="label">Gains</span>
                <span class="value success">{{ bet.actualWinnings }} KTAP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const store = useStore();
const loading = ref(false);
const selectedStatus = ref('Tous');

// Computed properties
const userBets = computed(() => store.getters['bets/userBets']);
const totalBets = computed(() => userBets.value.length);
const totalWinnings = computed(() => 
  userBets.value.reduce((total, bet) => total + (bet.actualWinnings || 0), 0)
);
const winRate = computed(() => {
  if (totalBets.value === 0) return 0;
  const wonBets = userBets.value.filter(bet => bet.status === 'won').length;
  return Math.round((wonBets / totalBets.value) * 100);
});

const filteredBets = computed(() => {
  if (selectedStatus.value === 'Tous') return userBets.value;
  
  const statusMap = {
    'En cours': 'pending',
    'Gagnés': 'won',
    'Perdus': 'lost'
  };
  
  return userBets.value.filter(bet => bet.status === statusMap[selectedStatus.value]);
});

// Méthodes
const formatDate = (date) => {
  return format(new Date(date), 'dd MMM yyyy HH:mm', { locale: fr });
};

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-warning',
    won: 'bg-success',
    lost: 'bg-danger'
  };
  return classes[status] || 'bg-secondary';
};

const getStatusText = (status) => {
  const texts = {
    pending: 'En cours',
    won: 'Gagné',
    lost: 'Perdu'
  };
  return texts[status] || status;
};

const getTeamName = (betType, match) => {
  if (betType === 'teamA') {
    return match?.teamA?.name || 'Équipe A';
  } else if (betType === 'teamB') {
    return match?.teamB?.name || 'Équipe B';
  } else if (betType === 'draw') {
    return 'Match nul';
  }
  return betType;
};

// Cycle de vie
onMounted(async () => {
  try {
    loading.value = true;
    await store.dispatch('bets/fetchUserBets');
  } catch (error) {
    console.error('Erreur lors du chargement des paris:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.bets-container {
  padding: 20px;
}

.stats-card {
  display: flex;
  gap: 20px;
  background-color: #2d2d2d;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 500;
  color: #ffffff;
}

.filters {
  display: flex;
  justify-content: center;
}

.bet-card {
  background-color: #2d2d2d;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.bet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.bet-date {
  color: #6c757d;
  font-size: 0.9rem;
}

.match-info {
  margin-bottom: 20px;
}

.teams {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.team {
  font-weight: 500;
}

.vs {
  color: #6c757d;
  margin: 0 10px;
}

.scores {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.score {
  font-size: 1.5rem;
  font-weight: bold;
}

.bet-details {
  border-top: 1px solid #3d3d3d;
  padding-top: 15px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.label {
  color: #6c757d;
}

.value {
  font-weight: 500;
  
  &.success {
    color: #28a745;
  }
}

.no-bets {
  text-align: center;
  padding: 40px;
  background-color: #2d2d2d;
  border-radius: 12px;
  color: #6c757d;
}
</style> 
 
 