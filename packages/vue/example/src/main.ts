import { createApp } from "vue";
import { createLoyalOps } from "@loyalops/vue";
import "./styles.css";
import App from "./App.vue";
import { TENANT_PUBLIC_KEY, USER_TOKEN, API_BASE_URL } from "./config";

const app = createApp(App);

app.use(createLoyalOps({
    tenantPublicKey: TENANT_PUBLIC_KEY,
    userToken: USER_TOKEN,
    baseUrl: API_BASE_URL,
}));

app.mount("#app");
