<template>
  <div class="admin-container">
    <div class="admin-header">
      <h1>Administration</h1>
      <div class="admin-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'matches' }"
          @click="activeTab = 'matches'"
        >
          <i class="fas fa-futbol"></i>
          Matches
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'users' }"
          @click="activeTab = 'users'"
        >
          <i class="fas fa-users"></i>
          Utilisateurs
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'transactions' }"
          @click="activeTab = 'transactions'"
        >
          <i class="fas fa-exchange-alt"></i>
          Transactions
        </button>
      </div>
    </div>

    <!-- Gestion des matches -->
    <div v-if="activeTab === 'matches'" class="admin-section">
      <div class="section-header">
        <h2>Gestion des matches</h2>
        <button class="action-btn" @click="showCreateMatchModal = true">
          <i class="fas fa-plus"></i>
          Nouveau match
        </button>
      </div>

      <div class="matches-filters">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="matchSearch" 
            placeholder="Rechercher un match..."
          />
        </div>
        <div class="filter-group">
          <button 
            class="filter-btn" 
            :class="{ active: matchFilter === 'all' }"
            @click="matchFilter = 'all'"
          >
            Tous
          </button>
          <button 
            class="filter-btn" 
            :class="{ active: matchFilter === 'scheduled' }"
            @click="matchFilter = 'scheduled'"
          >
            Planifiés
          </button>
          <button 
            class="filter-btn" 
            :class="{ active: matchFilter === 'live' }"
            @click="matchFilter = 'live'"
          >
            En direct
          </button>
          <button 
            class="filter-btn" 
            :class="{ active: matchFilter === 'finished' }"
            @click="matchFilter = 'finished'"
          >
            Terminés
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        Chargement des matches...
      </div>
      <div v-else-if="filteredMatches.length === 0" class="no-data">
        <i class="fas fa-info-circle"></i>
        Aucun match trouvé
      </div>
      <div v-else class="matches-table">
        <table>
          <thead>
            <tr>
              <th>Match</th>
              <th>Date</th>
              <th>Score</th>
              <th>Statut</th>
              <th>Streaming</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="match in filteredMatches" :key="match._id">
              <td class="teams">
                <span>{{ match.teamA?.name }}</span>
                <span class="vs">vs</span>
                <span>{{ match.teamB?.name }}</span>
              </td>
              <td>{{ formatDate(match.startTime) }}</td>
              <td>
                <span v-if="match.status === 'live' || match.status === 'finished'">
                  {{ match.teamA?.score || 0 }} - {{ match.teamB?.score || 0 }}
                </span>
                <span v-else>-</span>
              </td>
              <td>
                <span class="status-badge" :class="match.status">
                  {{ getStatusLabel(match.status) }}
                </span>
              </td>
              <td>
                <span v-if="match.streamingLink" class="streaming-link">
                  <a :href="match.streamingLink" target="_blank">
                    <i class="fas fa-video"></i> Voir le stream
                  </a>
                </span>
                <span v-else>-</span>
              </td>
              <td class="actions">
                <button 
                  v-if="match.status === 'scheduled'"
                  class="action-btn start"
                  @click="startMatch(match)"
                >
                  <i class="fas fa-play"></i>
                  Démarrer
                </button>
                <button 
                  v-if="match.status === 'live'"
                  class="action-btn update"
                  @click="updateScore(match)"
                >
                  <i class="fas fa-edit"></i>
                  Score
                </button>
                <button 
                  v-if="match.status === 'live'"
                  class="action-btn streaming"
                  @click="updateStreaming(match)"
                >
                  <i class="fas fa-video"></i>
                  Streaming
                </button>
                <button 
                  v-if="match.status === 'live'"
                  class="action-btn finish"
                  @click="finishMatch(match)"
                >
                  <i class="fas fa-stop"></i>
                  Terminer
                </button>
                <button 
                  v-if="match.status === 'scheduled'"
                  class="action-btn delete"
                  @click="deleteMatch(match)"
                >
                  <i class="fas fa-trash"></i>
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Gestion des utilisateurs -->
    <div v-if="activeTab === 'users'" class="admin-section">
      <div class="section-header">
        <h2>Gestion des utilisateurs</h2>
      </div>

      <div class="users-filters">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="userSearch" 
            placeholder="Rechercher un utilisateur..."
          />
        </div>
        <div class="filter-group">
          <button 
            class="filter-btn" 
            :class="{ active: userFilter === 'all' }"
            @click="userFilter = 'all'"
          >
            Tous
          </button>
          <button 
            class="filter-btn" 
            :class="{ active: userFilter === 'active' }"
            @click="userFilter = 'active'"
          >
            Actifs
          </button>
          <button 
            class="filter-btn" 
            :class="{ active: userFilter === 'suspended' }"
            @click="userFilter = 'suspended'"
          >
            Suspendus
          </button>
          <button 
            class="filter-btn" 
            :class="{ active: userFilter === 'banned' }"
            @click="userFilter = 'banned'"
          >
            Bannis
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        Chargement des utilisateurs...
      </div>
      <div v-else-if="filteredUsers.length === 0" class="no-data">
        <i class="fas fa-info-circle"></i>
        Aucun utilisateur trouvé
      </div>
      <div v-else class="users-table">
        <table>
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Solde</th>
              <th>Statut</th>
              <th>Date d'inscription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user._id">
              <td class="user-info">
                <span class="username">{{ user.username }}</span>
                <span class="role" :class="user.role">{{ user.role }}</span>
              </td>
              <td>{{ user.email }}</td>
              <td class="balance">{{ formatBalance(user.ktapBalance) }} KTAP</td>
              <td>
                <span class="status-badge" :class="user.status">
                  {{ getUserStatusLabel(user.status) }}
                </span>
              </td>
              <td>{{ formatDate(user.createdAt) }}</td>
              <td class="actions">
                <button 
                  v-if="user.status === 'active'"
                  class="action-btn suspend"
                  @click="suspendUser(user)"
                >
                  <i class="fas fa-ban"></i>
                  Suspendre
                </button>
                <button 
                  v-if="user.status === 'suspended'"
                  class="action-btn activate"
                  @click="activateUser(user)"
                >
                  <i class="fas fa-check"></i>
                  Activer
                </button>
                <button 
                  v-if="user.status !== 'banned'"
                  class="action-btn ban"
                  @click="banUser(user)"
                >
                  <i class="fas fa-user-slash"></i>
                  Bannir
                </button>
                <button 
                  class="action-btn edit"
                  @click="editUser(user)"
                >
                  <i class="fas fa-edit"></i>
                  Éditer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Gestion des transactions -->
    <div v-if="activeTab === 'transactions'" class="admin-section">
      <div class="section-header">
        <h2>Gestion des transactions</h2>
      </div>

      <div class="transactions-filters">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="transactionSearch" 
            placeholder="Rechercher une transaction..."
          />
        </div>
        <div class="filter-group">
          <button 
            class="filter-btn" 
            :class="{ active: transactionFilter === 'all' }"
            @click="transactionFilter = 'all'"
          >
            Toutes
          </button>
          <button 
            class="filter-btn" 
            :class="{ active: transactionFilter === 'pending' }"
            @click="transactionFilter = 'pending'"
          >
            En attente
          </button>
          <button 
            class="filter-btn" 
            :class="{ active: transactionFilter === 'completed' }"
            @click="transactionFilter = 'completed'"
          >
            Complétées
          </button>
          <button 
            class="filter-btn" 
            :class="{ active: transactionFilter === 'rejected' }"
            @click="transactionFilter = 'rejected'"
          >
            Rejetées
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        Chargement des transactions...
      </div>
      <div v-else-if="filteredTransactions.length === 0" class="no-data">
        <i class="fas fa-info-circle"></i>
        Aucune transaction trouvée
      </div>
      <div v-else class="transactions-table">
        <table>
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Type</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in filteredTransactions" :key="transaction._id">
              <td class="user-info">
                <span class="username">{{ transaction.user.username }}</span>
              </td>
              <td>
                <span class="type-badge" :class="transaction.type">
                  {{ getTransactionTypeLabel(transaction.type) }}
                </span>
              </td>
              <td class="amount" :class="transaction.type">
                {{ transaction.type === 'deposit' ? '+' : '-' }}
                {{ formatBalance(transaction.amount) }} KTAP
              </td>
              <td>
                <span class="status-badge" :class="transaction.status">
                  {{ getTransactionStatusLabel(transaction.status) }}
                </span>
              </td>
              <td>{{ formatDate(transaction.createdAt) }}</td>
              <td class="actions">
                <button 
                  v-if="transaction.status === 'pending'"
                  class="action-btn approve"
                  @click="approveTransaction(transaction)"
                >
                  <i class="fas fa-check"></i>
                  Approuver
                </button>
                <button 
                  v-if="transaction.status === 'pending'"
                  class="action-btn reject"
                  @click="rejectTransaction(transaction)"
                >
                  <i class="fas fa-times"></i>
                  Rejeter
                </button>
                <button 
                  class="action-btn view"
                  @click="viewTransaction(transaction)"
                >
                  <i class="fas fa-eye"></i>
                  Voir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de création de match -->
    <div v-if="showCreateMatchModal" class="modal-overlay" @click="showCreateMatchModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Nouveau match</h2>
          <button class="close-btn" @click="showCreateMatchModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="createMatch">
            <div class="form-group">
              <label>Équipe 1</label>
              <input 
                type="text" 
                v-model="newMatch.team1" 
                placeholder="Nom de l'équipe 1"
                required
              />
            </div>
            
            <div class="form-group">
              <label>Équipe 2</label>
              <input 
                type="text" 
                v-model="newMatch.team2" 
                placeholder="Nom de l'équipe 2"
                required
              />
            </div>
            
            <div class="form-group">
              <label>Date et heure</label>
              <input 
                type="datetime-local" 
                v-model="newMatch.startTime" 
                required
              />
            </div>
            
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="showCreateMatchModal = false">
                Annuler
              </button>
              <button type="submit" class="submit-btn" :disabled="loading">
                <i class="fas fa-plus"></i>
                Créer le match
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Modal de mise à jour du score -->
    <div v-if="showUpdateScoreModal" class="modal-overlay" @click="showUpdateScoreModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Mise à jour du score</h2>
          <button class="close-btn" @click="showUpdateScoreModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="submitScoreUpdate">
            <div class="match-info">
              <h3>{{ selectedMatch?.teamA?.name }} vs {{ selectedMatch?.teamB?.name }}</h3>
            </div>
            
            <div class="score-inputs">
              <div class="form-group">
                <label>{{ selectedMatch?.teamA?.name }}</label>
                <input 
                  type="number" 
                  v-model="scoreUpdate.score1" 
                  min="0"
                  required
                />
              </div>
              
              <div class="form-group">
                <label>{{ selectedMatch?.teamB?.name }}</label>
                <input 
                  type="number" 
                  v-model="scoreUpdate.score2" 
                  min="0"
                  required
                />
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="showUpdateScoreModal = false">
                Annuler
              </button>
              <button type="submit" class="submit-btn" :disabled="loading">
                <i class="fas fa-save"></i>
                Mettre à jour
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Modal de mise à jour du streaming -->
    <div v-if="showStreamingModal" class="modal-overlay" @click="showStreamingModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Lien de streaming</h2>
          <button class="close-btn" @click="showStreamingModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="submitStreamingUpdate">
            <div class="match-info">
              <h3>{{ selectedMatch?.teamA?.name }} vs {{ selectedMatch?.teamB?.name }}</h3>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Lien de streaming</label>
              <div class="flex gap-2">
                <input
                  v-model="streamingUpdate.link"
                  type="text"
                  class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
                <button
                  v-if="streamingUpdate.link"
                  @click="openStreamingUrl"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <i class="fas fa-play mr-2"></i>Play
                </button>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="showStreamingModal = false">
                Annuler
              </button>
              <button type="submit" class="submit-btn" :disabled="loading">
                <i class="fas fa-save"></i>
                Mettre à jour
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'AdminView',
  
  setup() {
    const store = useStore();
    const loading = ref(false);
    const activeTab = ref('matches');
    
    // État des modals
    const showCreateMatchModal = ref(false);
    const showUpdateScoreModal = ref(false);
    const showStreamingModal = ref(false);
    const selectedMatch = ref(null);
    
    // Filtres
    const matchSearch = ref('');
    const matchFilter = ref('all');
    const userSearch = ref('');
    const userFilter = ref('all');
    const transactionSearch = ref('');
    const transactionFilter = ref('all');
    
    // Formulaire de création de match
    const newMatch = ref({
      team1: '',
      team2: '',
      startTime: ''
    });
    
    // Formulaire de mise à jour du score
    const scoreUpdate = ref({
      score1: 0,
      score2: 0
    });
    
    // Formulaire de mise à jour du streaming
    const streamingUpdate = ref({
      link: ''
    });
    
    // Computed properties
    const matches = computed(() => store.state.matches.matches || []);
    const users = computed(() => store.state.admin.users || []);
    const transactions = computed(() => store.state.admin.transactions || []);
    
    const filteredMatches = computed(() => {
      let filtered = matches.value;
      
      // Filtre par recherche
      if (matchSearch.value) {
        const search = matchSearch.value.toLowerCase();
        filtered = filtered.filter(match => 
          match.teamA?.name.toLowerCase().includes(search) ||
          match.teamB?.name.toLowerCase().includes(search)
        );
      }
      
      // Filtre par statut
      if (matchFilter.value !== 'all') {
        filtered = filtered.filter(match => match.status === matchFilter.value);
      }
      
      return filtered;
    });
    
    const filteredUsers = computed(() => {
      let filtered = users.value;
      
      // Filtre par recherche
      if (userSearch.value) {
        const search = userSearch.value.toLowerCase();
        filtered = filtered.filter(user => 
          user.username.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search)
        );
      }
      
      // Filtre par statut
      if (userFilter.value !== 'all') {
        filtered = filtered.filter(user => user.status === userFilter.value);
      }
      
      return filtered;
    });
    
    const filteredTransactions = computed(() => {
      let filtered = transactions.value;
      
      // Filtre par recherche
      if (transactionSearch.value) {
        const search = transactionSearch.value.toLowerCase();
        filtered = filtered.filter(transaction => 
          transaction.user.username.toLowerCase().includes(search) ||
          transaction.user.email.toLowerCase().includes(search)
        );
      }
      
      // Filtre par statut
      if (transactionFilter.value !== 'all') {
        filtered = filtered.filter(transaction => transaction.status === transactionFilter.value);
      }
      
      return filtered;
    });
    
    // Méthodes
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
    
    const formatBalance = (value) => {
      return new Intl.NumberFormat('fr-FR').format(value || 0);
    };
    
    const getStatusLabel = (status) => {
      const labels = {
        scheduled: 'Planifié',
        live: 'En direct',
        finished: 'Terminé',
        cancelled: 'Annulé'
      };
      return labels[status] || status;
    };
    
    const getUserStatusLabel = (status) => {
      const labels = {
        active: 'Actif',
        suspended: 'Suspendu',
        banned: 'Banni'
      };
      return labels[status] || status;
    };
    
    const getTransactionTypeLabel = (type) => {
      const labels = {
        deposit: 'Dépôt',
        withdrawal: 'Retrait'
      };
      return labels[type] || type;
    };
    
    const getTransactionStatusLabel = (status) => {
      const labels = {
        pending: 'En attente',
        completed: 'Complétée',
        rejected: 'Rejetée'
      };
      return labels[status] || status;
    };
    
    const createMatch = async () => {
      try {
        loading.value = true;
        // Transformer les données pour correspondre à la structure attendue par l'API
        const matchData = {
          teamA: newMatch.value.team1,
          teamB: newMatch.value.team2,
          startTime: newMatch.value.startTime
        };
        await store.dispatch('matches/createMatchAdmin', matchData);
        showCreateMatchModal.value = false;
        newMatch.value = {
          team1: '',
          team2: '',
          startTime: ''
        };
      } catch (error) {
        console.error('Erreur lors de la création du match:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const startMatch = async (match) => {
      try {
        loading.value = true;
        await store.dispatch('matches/startMatch', match._id);
      } catch (error) {
        console.error('Erreur lors du démarrage du match:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const updateScore = (match) => {
      selectedMatch.value = match;
      scoreUpdate.value = {
        score1: match.teamA?.score || 0,
        score2: match.teamB?.score || 0
      };
      showUpdateScoreModal.value = true;
    };
    
    const submitScoreUpdate = async () => {
      if (!selectedMatch.value) return;
      
      try {
        loading.value = true;
        await store.dispatch('matches/updateMatchScore', {
          matchId: selectedMatch.value._id,
          teamAScore: scoreUpdate.value.score1,
          teamBScore: scoreUpdate.value.score2
        });
        showUpdateScoreModal.value = false;
      } catch (error) {
        console.error('Erreur lors de la mise à jour du score:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const finishMatch = async (match) => {
      try {
        loading.value = true;
        await store.dispatch('matches/updateMatchAdmin', {
          matchId: match._id,
          matchData: {
            status: 'finished',
            endTime: new Date()
          }
        });
      } catch (error) {
        console.error('Erreur lors de la fin du match:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const deleteMatch = async (match) => {
      if (!confirm('Êtes-vous sûr de vouloir supprimer ce match ?')) return;
      
      try {
        loading.value = true;
        await store.dispatch('matches/deleteMatchAdmin', match._id);
      } catch (error) {
        console.error('Erreur lors de la suppression du match:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const suspendUser = async (user) => {
      try {
        loading.value = true;
        await store.dispatch('admin/suspendUser', user._id);
      } catch (error) {
        console.error('Erreur lors de la suspension de l\'utilisateur:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const activateUser = async (user) => {
      try {
        loading.value = true;
        await store.dispatch('admin/activateUser', user._id);
      } catch (error) {
        console.error('Erreur lors de l\'activation de l\'utilisateur:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const banUser = async (user) => {
      try {
        loading.value = true;
        await store.dispatch('admin/banUser', user._id);
      } catch (error) {
        console.error('Erreur lors du bannissement de l\'utilisateur:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const editUser = (user) => {
      // À implémenter
      console.log('Édition de l\'utilisateur:', user);
    };
    
    const approveTransaction = async (transaction) => {
      try {
        loading.value = true;
        await store.dispatch('admin/approveTransaction', {
          id: transaction._id,
          type: transaction.type
        });
      } catch (error) {
        console.error('Erreur lors de l\'approbation de la transaction:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const rejectTransaction = async (transaction) => {
      try {
        loading.value = true;
        await store.dispatch('admin/rejectTransaction', {
          id: transaction._id,
          type: transaction.type,
          reason: 'Rejeté par l\'administrateur'
        });
      } catch (error) {
        console.error('Erreur lors du rejet de la transaction:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const viewTransaction = (transaction) => {
      // À implémenter
      console.log('Voir la transaction:', transaction);
    };
    
    const updateStreaming = (match) => {
      selectedMatch.value = match;
      streamingUpdate.value = {
        link: match.streamingLink || ''
      };
      showStreamingModal.value = true;
    };
    
    const submitStreamingUpdate = async () => {
      if (!selectedMatch.value) return;
      
      try {
        loading.value = true;
        await store.dispatch('matches/updateMatchAdmin', {
          matchId: selectedMatch.value._id,
          matchData: {
            streamingLink: streamingUpdate.value.link
          }
        });
        showStreamingModal.value = false;
      } catch (error) {
        console.error('Erreur lors de la mise à jour du lien de streaming:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const openStreamingUrl = () => {
      if (streamingUpdate.value.link) {
        window.open(streamingUpdate.value.link, '_blank');
      }
    };
    
    // Cycle de vie
    onMounted(async () => {
      try {
        loading.value = true;
        await Promise.all([
          store.dispatch('admin/fetchUsers'),
          store.dispatch('admin/fetchTransactions')
        ]);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        loading.value = false;
      }
    });

    // Rafraîchir les données périodiquement
    let refreshInterval;
    onMounted(() => {
      refreshInterval = setInterval(async () => {
        if (activeTab.value === 'matches') {
          await store.dispatch('matches/fetchAdminMatches');
        } else if (activeTab.value === 'users') {
          await store.dispatch('admin/fetchUsers');
        } else if (activeTab.value === 'transactions') {
          await store.dispatch('admin/fetchTransactions');
        }
      }, 30000); // Rafraîchir toutes les 30 secondes
    });

    onUnmounted(() => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    });
    
    return {
      loading,
      activeTab,
      showCreateMatchModal,
      showUpdateScoreModal,
      showStreamingModal,
      selectedMatch,
      matchSearch,
      matchFilter,
      userSearch,
      userFilter,
      transactionSearch,
      transactionFilter,
      newMatch,
      scoreUpdate,
      streamingUpdate,
      filteredMatches,
      filteredUsers,
      filteredTransactions,
      formatDate,
      formatBalance,
      getStatusLabel,
      getUserStatusLabel,
      getTransactionTypeLabel,
      getTransactionStatusLabel,
      createMatch,
      startMatch,
      updateScore,
      submitScoreUpdate,
      finishMatch,
      deleteMatch,
      suspendUser,
      activateUser,
      banUser,
      editUser,
      approveTransaction,
      rejectTransaction,
      viewTransaction,
      updateStreaming,
      submitStreamingUpdate,
      openStreamingUrl
    };
  }
};
</script>

<style lang="scss" scoped>
.admin-container {
  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    
    h1 {
      font-size: 2rem;
      color: #fff;
    }
    
    .admin-tabs {
      display: flex;
      gap: 1rem;
      
      .tab-btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        background-color: #2d2d2d;
        color: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
        
        i {
          font-size: 1rem;
        }
        
        &:hover {
          background-color: #333;
        }
        
        &.active {
          background-color: #4CAF50;
        }
      }
    }
  }
  
  .admin-section {
    background-color: #1a1a1a;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      
      h2 {
        font-size: 1.5rem;
        color: #fff;
      }
      
      .action-btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        background-color: #4CAF50;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
        
        &:hover {
          background-color: #45a049;
          transform: translateY(-2px);
        }
      }
    }
    
    .search-box {
      position: relative;
      margin-bottom: 1rem;
      
      i {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #888;
      }
      
      input {
        width: 100%;
        padding: 0.75rem 1rem 0.75rem 2.5rem;
        border: 1px solid #333;
        border-radius: 4px;
        background-color: #2d2d2d;
        color: #fff;
        
        &:focus {
          outline: none;
          border-color: #4CAF50;
        }
      }
    }
    
    .filter-group {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      
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
    
    .loading, .no-data {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 2rem;
      color: #888;
      
      i {
        font-size: 1.2rem;
      }
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      
      th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #333;
      }
      
      th {
        color: #888;
        font-weight: 500;
      }
      
      td {
        color: #fff;
      }
      
      .teams {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        
        .vs {
          color: #888;
          font-size: 0.9rem;
        }
      }
      
      .status-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
        
        &.scheduled {
          background-color: #2196F3;
          color: white;
        }
        
        &.live {
          background-color: #f44336;
          color: white;
        }
        
        &.finished {
          background-color: #4CAF50;
          color: white;
        }
        
        &.cancelled {
          background-color: #9e9e9e;
          color: white;
        }
        
        &.active {
          background-color: #4CAF50;
          color: white;
        }
        
        &.suspended {
          background-color: #ff9800;
          color: white;
        }
        
        &.banned {
          background-color: #f44336;
          color: white;
        }
        
        &.pending {
          background-color: #ff9800;
          color: white;
        }
        
        &.completed {
          background-color: #4CAF50;
          color: white;
        }
        
        &.rejected {
          background-color: #f44336;
          color: white;
        }
      }
      
      .type-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
        
        &.deposit {
          background-color: #4CAF50;
          color: white;
        }
        
        &.withdrawal {
          background-color: #f44336;
          color: white;
        }
      }
      
      .user-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        
        .username {
          font-weight: 500;
        }
        
        .role {
          font-size: 0.8rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          display: inline-block;
          
          &.admin {
            background-color: #f44336;
            color: white;
          }
          
          &.user {
            background-color: #2196F3;
            color: white;
          }
        }
      }
      
      .balance {
        font-weight: 500;
      }
      
      .amount {
        font-weight: 500;
        
        &.deposit {
          color: #4CAF50;
        }
        
        &.withdrawal {
          color: #f44336;
        }
      }
      
      .streaming-link {
        a {
          color: #9c27b0;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
      
      .actions {
        display: flex;
        gap: 0.5rem;
        
        .action-btn {
          padding: 0.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          
          &:hover {
            transform: translateY(-2px);
          }
          
          &.start {
            background-color: #4CAF50;
            color: white;
            
            &:hover {
              background-color: #45a049;
            }
          }
          
          &.update {
            background-color: #2196F3;
            color: white;
            
            &:hover {
              background-color: #1976D2;
            }
          }
          
          &.finish {
            background-color: #ff9800;
            color: white;
            
            &:hover {
              background-color: #f57c00;
            }
          }
          
          &.delete {
            background-color: #f44336;
            color: white;
            
            &:hover {
              background-color: #d32f2f;
            }
          }
          
          &.suspend {
            background-color: #ff9800;
            color: white;
            
            &:hover {
              background-color: #f57c00;
            }
          }
          
          &.activate {
            background-color: #4CAF50;
            color: white;
            
            &:hover {
              background-color: #45a049;
            }
          }
          
          &.ban {
            background-color: #f44336;
            color: white;
            
            &:hover {
              background-color: #d32f2f;
            }
          }
          
          &.edit {
            background-color: #2196F3;
            color: white;
            
            &:hover {
              background-color: #1976D2;
            }
          }
          
          &.approve {
            background-color: #4CAF50;
            color: white;
            
            &:hover {
              background-color: #45a049;
            }
          }
          
          &.reject {
            background-color: #f44336;
            color: white;
            
            &:hover {
              background-color: #d32f2f;
            }
          }
          
          &.streaming {
            background-color: #9c27b0;
            color: white;
            
            &:hover {
              background-color: #7b1fa2;
            }
          }
        }
      }
    }
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: #1a1a1a;
    border-radius: 8px;
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #333;
      
      h2 {
        color: #fff;
        margin: 0;
      }
      
      .close-btn {
        background: none;
        border: none;
        color: #888;
        cursor: pointer;
        font-size: 1.2rem;
        
        &:hover {
          color: #fff;
        }
      }
    }
    
    .modal-body {
      padding: 1.5rem;
      
      .form-group {
        margin-bottom: 1.5rem;
        
        label {
          display: block;
          color: #888;
          margin-bottom: 0.5rem;
        }
        
        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #333;
          border-radius: 4px;
          background-color: #2d2d2d;
          color: #fff;
          
          &:focus {
            outline: none;
            border-color: #4CAF50;
          }
        }
      }
      
      .match-info {
        text-align: center;
        margin-bottom: 1.5rem;
        
        h3 {
          font-size: 1.25rem;
          color: #fff;
          margin: 0;
        }
      }
      
      .score-inputs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        
        .cancel-btn {
          padding: 0.75rem 1.5rem;
          border: 1px solid #333;
          border-radius: 4px;
          background-color: transparent;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
          
          &:hover {
            background-color: #333;
          }
        }
        
        .submit-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          background-color: #4CAF50;
          color: white;
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
</style> 
 
 