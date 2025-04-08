import { createStore } from 'vuex';
import auth from './modules/auth';
import matches from './modules/matches';
import bets from './modules/bets';
import admin from './modules/admin';

export default createStore({
  modules: {
    auth,
    matches,
    bets,
    admin
  }
}); 