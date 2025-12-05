"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const usuarioRoutes_1 = __importDefault(require("./routes/usuarioRoutes"));
const filmeRoutes_1 = __importDefault(require("./routes/filmeRoutes"));
const sessaoRoutes_1 = __importDefault(require("./routes/sessaoRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve os arquivos estáticos da pasta 'public'
// Acessível a partir da raiz do servidor, ex: http://localhost:3000/style.css
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// A rota principal agora serve o index.html
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public', 'index.html'));
});
// Movemos a mensagem de boas-vindas para a rota /api
app.get('/api', (req, res) => {
    res.json({
        message: 'Bem-vindo à API do Cinema!',
        endpoints: {
            usuarios: '/api/usuarios',
            login: '/api/login',
            perfil: '/api/usuarios/perfil',
            filmes: '/api/filmes',
            sessoes: '/api/sessoes'
        }
    });
});
// --- ROTAS DA API ---
app.use('/api', usuarioRoutes_1.default);
app.use('/api/filmes', filmeRoutes_1.default);
app.use('/api/sessoes', sessaoRoutes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});
//# sourceMappingURL=index.js.map