<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Gestion des matchs</h2>
        <button class="close-btn" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="filters">
          <div class="search-bar">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="Rechercher un match..."
            >
          </div>

          <div class="filter-group">
            <select v-model="statusFilter">
              <option value="all">Tous les statuts</option>
              <option value="scheduled">Programmés</option>
              <option value="live">En direct</option>
              <option value="finished">Terminés</option>
              <option value="cancelled">Annulés</option>
            </select>

            <select v-model="sportFilter">
              <option value="all">Tous les sports</option>
              <option value="football">Football</option>
              <option value="basketball">Basketball</option>
              <option value="tennis">Tennis</option>
            </select>
          </div>
        </div>

        <div class="summary">
          <div class="summary-card">
            <h3>Total</h3>
            <p>{{ filteredMatches.length }}</p>
          </div>
          <div class="summary-card">
            <h3>En direct</h3>
            <p>{{ liveMatchesCount }}</p>
          </div>
          <div class="summary-card">
            <h3>Programmés</h3>
            <p>{{ scheduledMatchesCount }}</p>
          </div>
          <div class="summary-card">
            <h3>Terminés</h3>
            <p>{{ finishedMatchesCount }}</p>
          </div>
        </div>

        <div class="matches-list" v-if="!loading">
          <div v-if="filteredMatches.length === 0" class="empty-state">
            <i class="fas fa-futbol"></i>
            <p>Aucun match trouvé</p>
          </div>

          <div v-else class="matches-grid">
            <div 
              v-for="match in filteredMatches" 
              :key="match._id"
              class="match-card"
              :class="match.status"
            >
              <div class="match-header">
                <span class="sport">{{ match.sport }}</span>
                <span class="status" :class="match.status">
                  {{ getStatusLabel(match.status) }}
                </span>
              </div>

              <div class="teams">
                <div class="team">
                  <span class="name">{{ match.team1 }}</span>
                  <span class="score" v-if="match.status !== 'scheduled'">
                    {{ match.score1 }}
                  </span>
                </div>
                <div class="vs">VS</div>
                <div class="team">
                  <span class="name">{{ match.team2 }}</span>
                  <span class="score" v-if="match.status !== 'scheduled'">
                    {{ match.score2 }}
                  </span>
                </div>
              </div>

              <div class="match-info">
                <div class="info-item">
                  <i class="far fa-calendar"></i>
                  <span>{{ formatDate(match.date) }}</span>
                </div>
                <div class="info-item">
                  <i class="far fa-clock"></i>
                  <span>{{ formatTime(match.date) }}</span>
                </div>
                <div class="info-item">
                  <i class="fas fa-chart-line"></i>
                  <span>{{ match.totalBets }} paris</span>
                </div>
              </div>

              <div class="match-actions">
                <button 
                  class="btn-edit"
                  @click="editMatch(match)"
                  :disabled="match.status === 'finished'"
                >
                  <i class="fas fa-edit"></i>
                  Modifier
                </button>
                <button 
                  class="btn-delete"
                  @click="deleteMatch(match)"
                  :disabled="match.status === 'live'"
                >
                  <i class="fas fa-trash"></i>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="loading-state">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Chargement des matchs...</p>
        </div>

        <div class="actions">
          <button class="btn-primary" @click="createMatch">
            <i class="fas fa-plus"></i>
            Nouveau match
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default {
  name: 'MatchManagementModal',
  props: {
    matches: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'create', 'edit', 'delete'],
  setup(props, { emit }) {
    const searchQuery = ref('');
    const statusFilter = ref('all');
    const sportFilter = ref('all');

    const filteredMatches = computed(() => {
      return props.matches.filter(match => {
        const matchesSearch = 
          match.team1.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          match.team2.toLowerCase().includes(searchQuery.value.toLowerCase());
        
        const matchesStatus = 
          statusFilter.value === 'all' || 
          match.status === statusFilter.value;
        
        const matchesSport = 
          sportFilter.value === 'all' || 
          match.sport === sportFilter.value;

        return matchesSearch && matchesStatus && matchesSport;
      });
    });

    const liveMatchesCount = computed(() => 
      props.matches.filter(m => m.status === 'live').length
    );

    const scheduledMatchesCount = computed(() => 
      props.matches.filter(m => m.status === 'scheduled').length
    );

    const finishedMatchesCount = computed(() => 
      props.matches.filter(m => m.status === 'finished').length
    );

    const getStatusLabel = (status) => {
      const labels = {
        scheduled: 'Programmé',
        live: 'En direct',
        finished: 'Terminé',
        cancelled: 'Annulé'
      };
      return labels[status] || status;
    };

    const formatDate = (date) => {
      return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
    };

    const formatTime = (date) => {
      return format(new Date(date), 'HH:mm', { locale: fr });
    };

    const createMatch = () => {
      emit('create');
    };

    const editMatch = (match) => {
      emit('edit', match);
    };

    const deleteMatch = (match) => {
      emit('delete', match);
    };

    return {
      searchQuery,
      statusFilter,
      sportFilter,
      filteredMatches,
      liveMatchesCount,
      scheduledMatchesCount,
      finishedMatchesCount,
      getStatusLabel,
      formatDate,
      formatTime,
      createMatch,
      editMatch,
      deleteMatch
    };
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-primary);
  border-radius: 1rem;
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);

  h2 {
    font-size: 1.5rem;
    color: var(--text-primary);
    margin: 0;
  }

  .close-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.3s ease;

    &:hover {
      background: var(--bg-hover);
      color: var(--text-primary);
    }
  }
}

.modal-body {
  padding: 1.5rem;

  .filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;

    .search-bar {
      flex: 1;
      position: relative;

      i {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-secondary);
      }

      input {
        width: 100%;
        padding: 0.75rem 1rem 0.75rem 2.5rem;
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        background: var(--bg-secondary);
        color: var(--text-primary);
        font-size: 0.875rem;

        &:focus {
          outline: none;
          border-color: var(--primary);
        }
      }
    }

    .filter-group {
      display: flex;
      gap: 1rem;

      select {
        padding: 0.75rem 1rem;
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        background: var(--bg-secondary);
        color: var(--text-primary);
        font-size: 0.875rem;
        cursor: pointer;

        &:focus {
          outline: none;
          border-color: var(--primary);
        }
      }
    }
  }

  .summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;

    .summary-card {
      background: var(--bg-secondary);
      padding: 1rem;
      border-radius: 0.5rem;
      text-align: center;

      h3 {
        color: var(--text-secondary);
        font-size: 0.875rem;
        margin: 0 0 0.5rem 0;
      }

      p {
        color: var(--text-primary);
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0;
      }
    }
  }

  .matches-list {
    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-secondary);

      i {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      p {
        font-size: 1rem;
        margin: 0;
      }
    }

    .matches-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;

      .match-card {
        background: var(--bg-secondary);
        border-radius: 0.5rem;
        padding: 1rem;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .match-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;

          .sport {
            color: var(--text-secondary);
            font-size: 0.75rem;
            text-transform: uppercase;
          }

          .status {
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            font-weight: 500;

            &.scheduled {
              background: var(--warning-light);
              color: var(--warning);
            }

            &.live {
              background: var(--success-light);
              color: var(--success);
            }

            &.finished {
              background: var(--info-light);
              color: var(--info);
            }

            &.cancelled {
              background: var(--danger-light);
              color: var(--danger);
            }
          }
        }

        .teams {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;

          .team {
            flex: 1;
            text-align: center;

            .name {
              display: block;
              color: var(--text-primary);
              font-weight: 500;
              margin-bottom: 0.25rem;
            }

            .score {
              color: var(--text-secondary);
              font-size: 0.875rem;
            }
          }

          .vs {
            color: var(--text-secondary);
            font-size: 0.875rem;
          }
        }

        .match-info {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1rem;

          .info-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--text-secondary);
            font-size: 0.75rem;

            i {
              font-size: 0.875rem;
            }
          }
        }

        .match-actions {
          display: flex;
          gap: 0.5rem;

          button {
            flex: 1;
            padding: 0.5rem;
            border: none;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;

            &:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }

            i {
              font-size: 0.875rem;
            }
          }

          .btn-edit {
            background: var(--primary-light);
            color: var(--primary);

            &:hover:not(:disabled) {
              background: var(--primary);
              color: white;
            }
          }

          .btn-delete {
            background: var(--danger-light);
            color: var(--danger);

            &:hover:not(:disabled) {
              background: var(--danger);
              color: white;
            }
          }
        }
      }
    }
  }

  .loading-state {
    text-align: center;
    padding: 3rem;
    color: var(--text-secondary);

    i {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1rem;
      margin: 0;
    }
  }

  .actions {
    margin-top: 1.5rem;
    display: flex;
    justify-content: flex-end;

    .btn-primary {
      padding: 0.75rem 1.5rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      &:hover {
        background: var(--primary-dark);
      }

      i {
        font-size: 1rem;
      }
    }
  }
}
</style> 