"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SessaoController_1 = require("../controllers/SessaoController");
const sessaoRoutes = (0, express_1.Router)();
sessaoRoutes.get('/', SessaoController_1.obterSessoes);
sessaoRoutes.get('/filme/:filmeId', SessaoController_1.obterSessoesPorFilme);
exports.default = sessaoRoutes;
//# sourceMappingURL=sessaoRoutes.js.map