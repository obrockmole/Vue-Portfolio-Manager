import { createApp } from "vue"
import App from "./App.vue"
import axios from "axios"
import router from "./router"
import Vueform from "@vueform/vueform"
import vueformConfig from "./../vueform.config"

const app = createApp(App)
app.use(Vueform, vueformConfig);
app.use(router)
app.config.globalProperties.$axios = axios.create({
    baseURL: "http://localhost:3000/api/",
});
app.mount("#app")
