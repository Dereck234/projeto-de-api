"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsuarioController_1 = require("../controllers/UsuarioController");
// CORREÇÃO FINAL: Corrigindo o caminho e o nome do arquivo do middleware.
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Rotas públicas
router.post('/usuarios', UsuarioController_1.criarUsuario);
router.post('/login', UsuarioController_1.loginUsuario);
// Rota protegida
router.get('/usuarios/perfil', auth_1.authMiddleware, UsuarioController_1.obterPerfilUsuario);
exports.default = router;
//# sourceMappingURL=usuarioRoutes.js.map