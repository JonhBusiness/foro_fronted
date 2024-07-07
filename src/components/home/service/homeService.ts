import axios from "axios";
import authHeader from "../../auth/service/auth-header";

// const API_URL = "http://localhost:8080/";
// const API_URL = "http://hp5.nexcord.com:10226/";
const API_URL = "/api/";

class HomeService {
    async getInitBoard() {
        return await axios.get(API_URL + "cursos");
    }

    async getTopicsBoard(id: number) {
        return await axios.get(API_URL + `curso/${id}/topics`, { headers: authHeader() });
    }
    async getRepliesBoard(id: number) {
        return await axios.get(API_URL + `topicos/${id}/respuestas`, { headers: authHeader() });
    }
    async createCourses(nombre: string, descripcion: string) {
        return await axios.post(API_URL + `curso/crear`, { nombre, descripcion }, { headers: authHeader() });
    }
    async createReplies(id: number, mensaje: string) {
        return await axios.post(API_URL + `respuestas/${id}/crear`, { mensaje }, { headers: authHeader() });
    }
    async createTopics(id: number, titulo: string, mensaje: string) {
        return await axios.post(API_URL + `topicos/${id}/crear`, { titulo, mensaje }, { headers: authHeader() });
    }
}

export default new HomeService();
