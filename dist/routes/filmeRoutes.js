"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FilmeController_1 = require("../controllers/FilmeController");
const filmeRoutes = (0, express_1.Router)();
filmeRoutes.post('/', FilmeController_1.criarFilme);
filmeRoutes.get('/', FilmeController_1.obterFilmes);
filmeRoutes.get('/:id', FilmeController_1.obterFilmePorId);
filmeRoutes.put('/:id', FilmeController_1.atualizarFilme);
filmeRoutes.delete('/:id', FilmeController_1.deletarFilme);
exports.default = filmeRoutes;
//# sourceMappingURL=filmeRoutes.js.map