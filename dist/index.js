"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var client_1 = require("@prisma/client");
var app = (0, express_1.default)();
var port = process.env.PORT || 3000;
var prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.get('/', function (req, res) {
    res.send('Express + TypeScript Server');
});
// --- User Routes ---
app.get('/users', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.user.findMany()];
            case 1:
                users = _a.sent();
                res.json(users);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(500).json({ error: "An error occurred while fetching users." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/users', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, name_1, newUser, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, email = _a.email, name_1 = _a.name;
                return [4 /*yield*/, prisma.user.create({
                        data: { email: email, name: name_1 },
                    })];
            case 1:
                newUser = _b.sent();
                res.status(201).json(newUser);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                if (error_2.code === 'P2002') {
                    return [2 /*return*/, res.status(409).json({ error: 'A user with this email already exists.' })];
                }
                res.status(500).json({ error: "An error occurred while creating the user." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/users/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma.user.findUnique({ where: { id: Number(id) } })];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(404).json({ error: 'User not found.' })];
                res.json(user);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(500).json({ error: "An error occurred while fetching the user." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.put('/users/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, email, name_2, updatedUser, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                _a = req.body, email = _a.email, name_2 = _a.name;
                return [4 /*yield*/, prisma.user.update({
                        where: { id: Number(id) },
                        data: { email: email, name: name_2 },
                    })];
            case 1:
                updatedUser = _b.sent();
                res.json(updatedUser);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                if (error_4.code === 'P2025')
                    return [2 /*return*/, res.status(404).json({ error: 'User not found.' })];
                res.status(500).json({ error: "An error occurred while updating the user." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.delete('/users/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma.user.delete({ where: { id: Number(id) } })];
            case 1:
                _a.sent();
                res.status(204).send();
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                if (error_5.code === 'P2025')
                    return [2 /*return*/, res.status(404).json({ error: 'User not found.' })];
                res.status(500).json({ error: "An error occurred while deleting the user." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// --- Post Routes ---
app.post('/posts', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, content, authorId, newPost, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, title = _a.title, content = _a.content, authorId = _a.authorId;
                return [4 /*yield*/, prisma.post.create({
                        data: { title: title, content: content, authorId: authorId },
                    })];
            case 1:
                newPost = _b.sent();
                res.status(201).json(newPost);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _b.sent();
                if (error_6.code === 'P2025')
                    return [2 /*return*/, res.status(404).json({ error: 'Author not found.' })];
                res.status(500).json({ error: "An error occurred while creating the post." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/posts', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var posts, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.post.findMany({ include: { author: true } })];
            case 1:
                posts = _a.sent();
                res.json(posts);
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                res.status(500).json({ error: "An error occurred while fetching posts." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/posts/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, post, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma.post.findUnique({
                        where: { id: Number(id) },
                        include: { author: true },
                    })];
            case 1:
                post = _a.sent();
                if (!post)
                    return [2 /*return*/, res.status(404).json({ error: 'Post not found.' })];
                res.json(post);
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                res.status(500).json({ error: "An error occurred while fetching the post." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.put('/posts/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, title, content, updatedPost, error_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                _a = req.body, title = _a.title, content = _a.content;
                return [4 /*yield*/, prisma.post.update({
                        where: { id: Number(id) },
                        data: { title: title, content: content },
                    })];
            case 1:
                updatedPost = _b.sent();
                res.json(updatedPost);
                return [3 /*break*/, 3];
            case 2:
                error_9 = _b.sent();
                if (error_9.code === 'P2025')
                    return [2 /*return*/, res.status(404).json({ error: 'Post not found.' })];
                res.status(500).json({ error: "An error occurred while updating the post." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.delete('/posts/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma.post.delete({ where: { id: Number(id) } })];
            case 1:
                _a.sent();
                res.status(204).send();
                return [3 /*break*/, 3];
            case 2:
                error_10 = _a.sent();
                if (error_10.code === 'P2025')
                    return [2 /*return*/, res.status(404).json({ error: 'Post not found.' })];
                res.status(500).json({ error: "An error occurred while deleting the post." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// --- Category Routes ---
app.post('/categories', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name_3, newCategory, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                name_3 = req.body.name;
                return [4 /*yield*/, prisma.category.create({
                        data: { name: name_3 },
                    })];
            case 1:
                newCategory = _a.sent();
                res.status(201).json(newCategory);
                return [3 /*break*/, 3];
            case 2:
                error_11 = _a.sent();
                if (error_11.code === 'P2002') {
                    return [2 /*return*/, res.status(409).json({ error: 'A category with this name already exists.' })];
                }
                res.status(500).json({ error: "An error occurred while creating the category." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/categories', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categories, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.category.findMany()];
            case 1:
                categories = _a.sent();
                res.json(categories);
                return [3 /*break*/, 3];
            case 2:
                error_12 = _a.sent();
                res.status(500).json({ error: "An error occurred while fetching categories." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.listen(port, function () {
    console.log("[server]: Server is running at http://localhost:".concat(port));
});
//# sourceMappingURL=index.js.map