import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import router from "./router";
import "./assets/scss/style.scss";
import store from './store';

// Gestion du titre de la page
router.beforeEach((to) => {
  if (to.meta && typeof to.meta.title === "string") {
    document.title = to.meta.title;
  } else {
    document.title = "Oddx - Plateforme de paris sportifs";
  }
  window.scrollTo(0, 0);
});

// Gestion des erreurs de navigation
router.onError((error) => {
  console.error('Erreur de navigation:', error);
});

const app = createApp(App);

app.use(router);
app.use(store);

app.mount("#app");
