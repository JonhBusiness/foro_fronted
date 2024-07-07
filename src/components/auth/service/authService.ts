import store from "@/store";
import axios from "axios";

// const API_URL = "http://localhost:8080/auth/";
// const API_URL = "http://hp5.nexcord.com:10226/auth/";
const API_URL = "/api/auth/";

class AuthService {
    async login(username: string, password: string) {
        const response = await axios.post(API_URL + "login", { username, password });
        return response.data;
    }

    logout() {
        store.dispatch("logout");
    }

    async register(username: string, email: string, password: string) {
        return await axios.post(API_URL + "register", { username, email, password });
    }
}

export default new AuthService();
