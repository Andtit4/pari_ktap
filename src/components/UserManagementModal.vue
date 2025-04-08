<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Gestion des utilisateurs</h2>
        <button class="close-btn" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="filters">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input 
              type="text"
              v-model="searchQuery"
              placeholder="Rechercher un utilisateur..."
            >
          </div>

          <div class="filter-group">
            <select v-model="roleFilter">
              <option value="">Tous les rôles</option>
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>

            <select v-model="statusFilter">
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="suspended">Suspendu</option>
              <option value="banned">Banni</option>
            </select>
          </div>
        </div>

        <div class="summary">
          <div class="summary-card">
            <i class="fas fa-users"></i>
            <div class="summary-info">
              <span class="label">Total des utilisateurs</span>
              <span class="value">{{ filteredUsers.length }}</span>
            </div>
          </div>

          <div class="summary-card">
            <i class="fas fa-user-shield"></i>
            <div class="summary-info">
              <span class="label">Administrateurs</span>
              <span class="value">{{ adminCount }}</span>
            </div>
          </div>

          <div class="summary-card">
            <i class="fas fa-user-check"></i>
            <div class="summary-info">
              <span class="label">Utilisateurs actifs</span>
              <span class="value">{{ activeCount }}</span>
            </div>
          </div>

          <div class="summary-card">
            <i class="fas fa-user-slash"></i>
            <div class="summary-info">
              <span class="label">Utilisateurs suspendus/bannis</span>
              <span class="value">{{ suspendedCount }}</span>
            </div>
          </div>
        </div>

        <div class="users-list" v-if="!loading">
          <div v-if="filteredUsers.length === 0" class="empty-state">
            <i class="fas fa-search"></i>
            <p>Aucun utilisateur trouvé</p>
          </div>

          <div v-else class="user-cards">
            <div 
              v-for="user in filteredUsers"
              :key="user._id"
              class="user-card"
              :class="user.status"
            >
              <div class="user-header">
                <div class="user-info">
                  <div class="avatar">
                    <i class="fas fa-user"></i>
                  </div>
                  <div class="details">
                    <span class="username">{{ user.username }}</span>
                    <span class="email">{{ user.email }}</span>
                  </div>
                </div>
                <div class="user-badges">
                  <span class="role" :class="user.role">
                    {{ getRoleLabel(user.role) }}
                  </span>
                  <span class="status" :class="user.status">
                    {{ getStatusLabel(user.status) }}
                  </span>
                </div>
              </div>

              <div class="user-details">
                <div class="detail-row">
                  <span class="label">Date d'inscription</span>
                  <span class="value">{{ formatDate(user.createdAt) }}</span>
                </div>

                <div class="detail-row">
                  <span class="label">Solde</span>
                  <span class="value">{{ formatAmount(user.balance) }} KTAP</span>
                </div>

                <div class="detail-row">
                  <span class="label">Paris totaux</span>
                  <span class="value">{{ user.totalBets }}</span>
                </div>

                <div class="detail-row">
                  <span class="label">Taux de réussite</span>
                  <span class="value">{{ user.winRate }}%</span>
                </div>
              </div>

              <div class="user-actions">
                <button 
                  v-if="user.status === 'active'"
                  class="btn-warning"
                  @click="handleSuspend(user)"
                  :disabled="loading"
                >
                  <i class="fas fa-ban"></i>
                  Suspendre
                </button>

                <button 
                  v-if="user.status === 'suspended'"
                  class="btn-success"
                  @click="handleActivate(user)"
                  :disabled="loading"
                >
                  <i class="fas fa-check"></i>
                  Réactiver
                </button>

                <button 
                  v-if="user.status === 'active'"
                  class="btn-danger"
                  @click="handleBan(user)"
                  :disabled="loading"
                >
                  <i class="fas fa-user-slash"></i>
                  Bannir
                </button>

                <button 
                  class="btn-primary"
                  @click="handleEdit(user)"
                  :disabled="loading"
                >
                  <i class="fas fa-edit"></i>
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="loading-state">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Chargement des utilisateurs...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'UserManagementModal',
  props: {
    users: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'suspend', 'activate', 'ban', 'edit'],
  setup(props, { emit }) {
    const searchQuery = ref('');
    const roleFilter = ref('');
    const statusFilter = ref('');

    const filteredUsers = computed(() => {
      return props.users.filter(user => {
        const matchesSearch = 
          user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.value.toLowerCase());

        const matchesRole = !roleFilter.value || user.role === roleFilter.value;
        const matchesStatus = !statusFilter.value || user.status === statusFilter.value;

        return matchesSearch && matchesRole && matchesStatus;
      });
    });

    const adminCount = computed(() => 
      filteredUsers.value.filter(user => user.role === 'admin').length
    );

    const activeCount = computed(() => 
      filteredUsers.value.filter(user => user.status === 'active').length
    );

    const suspendedCount = computed(() => 
      filteredUsers.value.filter(user => 
        user.status === 'suspended' || user.status === 'banned'
      ).length
    );

    const getRoleLabel = (role) => {
      const labels = {
        user: 'Utilisateur',
        admin: 'Administrateur'
      };
      return labels[role] || role;
    };

    const getStatusLabel = (status) => {
      const labels = {
        active: 'Actif',
        suspended: 'Suspendu',
        banned: 'Banni'
      };
      return labels[status] || status;
    };

    const formatAmount = (amount) => {
      return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    };

    const formatDate = (date) => {
      return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'short',
        timeStyle: 'short'
      }).format(new Date(date));
    };

    const handleSuspend = (user) => {
      emit('suspend', user);
    };

    const handleActivate = (user) => {
      emit('activate', user);
    };

    const handleBan = (user) => {
      emit('ban', user);
    };

    const handleEdit = (user) => {
      emit('edit', user);
    };

    return {
      searchQuery,
      roleFilter,
      statusFilter,
      filteredUsers,
      adminCount,
      activeCount,
      suspendedCount,
      getRoleLabel,
      getStatusLabel,
      formatAmount,
      formatDate,
      handleSuspend,
      handleActivate,
      handleBan,
      handleEdit
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

    .search-box {
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
        transition: all 0.3s ease;

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
        transition: all 0.3s ease;

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
      border-radius: 0.5rem;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;

      i {
        font-size: 1.5rem;
        color: var(--primary);
      }

      .summary-info {
        display: flex;
        flex-direction: column;

        .label {
          color: var(--text-secondary);
          font-size: 0.75rem;
        }

        .value {
          color: var(--text-primary);
          font-size: 1.25rem;
          font-weight: 500;
        }
      }
    }
  }

  .users-list {
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
      }
    }

    .user-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;

      .user-card {
        background: var(--bg-secondary);
        border-radius: 0.5rem;
        padding: 1rem;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        &.suspended {
          border-left: 4px solid var(--warning);
        }

        &.banned {
          border-left: 4px solid var(--danger);
        }

        .user-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;

          .user-info {
            display: flex;
            align-items: center;
            gap: 1rem;

            .avatar {
              width: 3rem;
              height: 3rem;
              border-radius: 50%;
              background: var(--bg-hover);
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--text-secondary);
              font-size: 1.5rem;
            }

            .details {
              display: flex;
              flex-direction: column;
              gap: 0.25rem;

              .username {
                color: var(--text-primary);
                font-weight: 500;
              }

              .email {
                color: var(--text-secondary);
                font-size: 0.875rem;
              }
            }
          }

          .user-badges {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;

            .role,
            .status {
              padding: 0.25rem 0.5rem;
              border-radius: 0.25rem;
              font-size: 0.75rem;
              font-weight: 500;
              text-align: center;
            }

            .role {
              &.admin {
                background: var(--primary-light);
                color: var(--primary);
              }

              &.user {
                background: var(--bg-hover);
                color: var(--text-secondary);
              }
            }

            .status {
              &.active {
                background: var(--success-light);
                color: var(--success);
              }

              &.suspended {
                background: var(--warning-light);
                color: var(--warning);
              }

              &.banned {
                background: var(--danger-light);
                color: var(--danger);
              }
            }
          }
        }

        .user-details {
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;

            .label {
              color: var(--text-secondary);
              font-size: 0.875rem;
            }

            .value {
              color: var(--text-primary);
              font-size: 0.875rem;
              font-weight: 500;
            }
          }
        }

        .user-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
          margin-top: 1rem;

          button {
            padding: 0.5rem;
            border: none;
            border-radius: 0.5rem;
            font-size: 0.875rem;
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
              font-size: 1rem;
            }
          }

          .btn-primary {
            background: var(--primary);
            color: white;

            &:hover:not(:disabled) {
              background: var(--primary-dark);
            }
          }

          .btn-success {
            background: var(--success);
            color: white;

            &:hover:not(:disabled) {
              background: var(--success-dark);
            }
          }

          .btn-warning {
            background: var(--warning);
            color: white;

            &:hover:not(:disabled) {
              background: var(--warning-dark);
            }
          }

          .btn-danger {
            background: var(--danger);
            color: white;

            &:hover:not(:disabled) {
              background: var(--danger-dark);
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
    }
  }
}
</style> 