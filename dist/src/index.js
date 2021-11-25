"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
exports.__esModule = true;
var fastify_1 = __importDefault(require("fastify"));
var http_1 = require("http");
var database_1 = require("./database");
var config_json_1 = require("./config.json");
var schemas_1 = require("../schemas");
var bson_1 = require("bson");
var PORT = process.env.PORT || 8000;
var fastify = (0, fastify_1["default"])();
fastify.get("/", function (_, reply) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, reply.send(http_1.STATUS_CODES)];
    });
}); });
fastify.post("/register", { schema: schemas_1.RegisterSchema }, function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, collection, client, findRes, docToSave, insertedId, error_1, err;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                return [4 /*yield*/, (0, database_1.getCollection)(config_json_1.usersCollection)];
            case 1:
                _a = _b.sent(), collection = _a.collection, client = _a.client;
                return [4 /*yield*/, collection.findOne({
                        username: request.body.username
                    })];
            case 2:
                findRes = _b.sent();
                if (findRes) {
                    return [2 /*return*/, reply
                            .status(409)
                            .send({ message: "Username already taken, please choose another" })];
                }
                docToSave = __assign(__assign({}, request.body), { linksCreated: 0, createdAt: Date.now(), lastActive: Date.now() });
                return [4 /*yield*/, collection.insertOne(docToSave)];
            case 3:
                insertedId = (_b.sent()).insertedId;
                return [4 /*yield*/, client.close()];
            case 4:
                _b.sent();
                delete docToSave.password;
                return [2 /*return*/, reply.send(__assign(__assign({}, docToSave), { _id: insertedId }))];
            case 5:
                error_1 = _b.sent();
                err = error_1;
                return [2 /*return*/, reply.status(500).send({ message: err.message })];
            case 6: return [2 /*return*/];
        }
    });
}); });
fastify.post("/create", { schema: schemas_1.CreateSchema }, function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, users, usersClient, author, _b, collection, client, findRes, docToSave, insertedId, error_2, err;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 11, , 12]);
                return [4 /*yield*/, (0, database_1.getCollection)(config_json_1.usersCollection)];
            case 1:
                _a = _d.sent(), users = _a.collection, usersClient = _a.client;
                return [4 /*yield*/, users.findOne({
                        username: request.body.username,
                        password: request.body.password
                    })];
            case 2:
                author = _d.sent();
                if (!!author) return [3 /*break*/, 4];
                return [4 /*yield*/, usersClient.close()];
            case 3:
                _d.sent();
                return [2 /*return*/, reply
                        .status(401)
                        .send({ message: "Invalid username or password" })];
            case 4: return [4 /*yield*/, (0, database_1.getCollection)(config_json_1.linksCollection)];
            case 5:
                _b = _d.sent(), collection = _b.collection, client = _b.client;
                return [4 /*yield*/, collection.findOne({
                        url: request.body.url,
                        createdBy: request.body.username
                    })];
            case 6:
                findRes = _d.sent();
                if (findRes) {
                    return [2 /*return*/, reply.status(409).send({
                            message: "A link already exists with same url at #".concat(findRes.count)
                        })];
                }
                docToSave = {
                    url: request.body.url,
                    info: request.body.info,
                    count: author.linksCreated + 1,
                    createdAt: Date.now(),
                    createdBy: request.body.username,
                    expireAt: new Date((_c = request.body.expireAt) !== null && _c !== void 0 ? _c : Date.now() + 1000 * 60 * 60 * 24 * config_json_1.expireInDays).valueOf()
                };
                return [4 /*yield*/, collection.insertOne(docToSave)];
            case 7:
                insertedId = (_d.sent()).insertedId;
                return [4 /*yield*/, users.updateOne({ _id: author._id }, { $inc: { linksCreated: 1 }, $set: { lastActive: Date.now() } })];
            case 8:
                _d.sent();
                return [4 /*yield*/, client.close()];
            case 9:
                _d.sent();
                return [4 /*yield*/, usersClient.close()];
            case 10:
                _d.sent();
                return [2 /*return*/, reply.send(__assign(__assign({}, docToSave), { _id: insertedId }))];
            case 11:
                error_2 = _d.sent();
                err = error_2;
                return [2 /*return*/, reply.status(500).send({ message: err.message })];
            case 12: return [2 /*return*/];
        }
    });
}); });
fastify.get("/:username", { schema: schemas_1.LinksSchema }, function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var username, _a, users, usersClient, findRes, _b, collection, client, cursor, links_1, error_3, err;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 7, , 8]);
                username = request.params.username;
                return [4 /*yield*/, (0, database_1.getCollection)(config_json_1.usersCollection)];
            case 1:
                _a = _c.sent(), users = _a.collection, usersClient = _a.client;
                return [4 /*yield*/, users.findOne({ username: username })];
            case 2:
                findRes = _c.sent();
                return [4 /*yield*/, usersClient.close()];
            case 3:
                _c.sent();
                if (!findRes) {
                    return [2 /*return*/, reply.status(404).send({ message: "User not found!" })];
                }
                return [4 /*yield*/, (0, database_1.getCollection)(config_json_1.linksCollection)];
            case 4:
                _b = _c.sent(), collection = _b.collection, client = _b.client;
                cursor = collection.find({ createdBy: username });
                links_1 = [];
                return [4 /*yield*/, cursor.forEach(function (link) {
                        links_1.push(link);
                    })];
            case 5:
                _c.sent();
                return [4 /*yield*/, client.close()];
            case 6:
                _c.sent();
                return [2 /*return*/, links_1];
            case 7:
                error_3 = _c.sent();
                err = error_3;
                return [2 /*return*/, reply.status(500).send({ message: err.message })];
            case 8: return [2 /*return*/];
        }
    });
}); });
fastify.get("/:username/:count", { schema: schemas_1.LinkSchema }, function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var username, _a, users, usersClient, findRes, _b, collection, client, link, error_4, err;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 7, , 8]);
                username = request.params.username;
                return [4 /*yield*/, (0, database_1.getCollection)(config_json_1.usersCollection)];
            case 1:
                _a = _c.sent(), users = _a.collection, usersClient = _a.client;
                return [4 /*yield*/, users.findOne({ username: username })];
            case 2:
                findRes = _c.sent();
                return [4 /*yield*/, usersClient.close()];
            case 3:
                _c.sent();
                if (!findRes) {
                    return [2 /*return*/, reply.status(404).send({ message: "User not found!" })];
                }
                return [4 /*yield*/, (0, database_1.getCollection)(config_json_1.linksCollection)];
            case 4:
                _b = _c.sent(), collection = _b.collection, client = _b.client;
                return [4 /*yield*/, collection.findOne({
                        createdBy: username,
                        count: request.params.count
                    })];
            case 5:
                link = _c.sent();
                return [4 /*yield*/, client.close()];
            case 6:
                _c.sent();
                if (!link) {
                    return [2 /*return*/, reply.status(404).send({ message: "Link not found!" })];
                }
                return [2 /*return*/, request.query.follow ? reply.redirect(301, link.url) : link];
            case 7:
                error_4 = _c.sent();
                err = error_4;
                return [2 /*return*/, reply.status(500).send({ message: err.message })];
            case 8: return [2 /*return*/];
        }
    });
}); });
fastify["delete"]("/:id", { schema: schemas_1.DeleteSchema }, function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, _a, collection, client, link, _b, users, usersClient, author, deletedCount, error_5, err;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 11, , 12]);
                _id = new bson_1.ObjectId(request.params.id);
                return [4 /*yield*/, (0, database_1.getCollection)(config_json_1.linksCollection)];
            case 1:
                _a = _c.sent(), collection = _a.collection, client = _a.client;
                return [4 /*yield*/, collection.findOne({ _id: _id })];
            case 2:
                link = _c.sent();
                if (!link) {
                    return [2 /*return*/, reply.status(404).send({ message: "Link not found!" })];
                }
                return [4 /*yield*/, (0, database_1.getCollection)(config_json_1.usersCollection)];
            case 3:
                _b = _c.sent(), users = _b.collection, usersClient = _b.client;
                return [4 /*yield*/, users.findOne({
                        username: link.createdBy,
                        password: request.body.password
                    })];
            case 4:
                author = _c.sent();
                if (!!author) return [3 /*break*/, 6];
                return [4 /*yield*/, usersClient.close()];
            case 5:
                _c.sent();
                return [2 /*return*/, reply.status(401).send({ message: "Incorrect password!" })];
            case 6: return [4 /*yield*/, users.updateOne({ _id: author._id }, { $set: { lastActive: Date.now() } })];
            case 7:
                _c.sent();
                return [4 /*yield*/, usersClient.close()];
            case 8:
                _c.sent();
                return [4 /*yield*/, collection.deleteOne({ _id: _id })];
            case 9:
                deletedCount = (_c.sent()).deletedCount;
                return [4 /*yield*/, client.close()];
            case 10:
                _c.sent();
                return [2 /*return*/, reply.send(!!deletedCount)];
            case 11:
                error_5 = _c.sent();
                err = error_5;
                return [2 /*return*/, reply.status(500).send({ message: err.message })];
            case 12: return [2 /*return*/];
        }
    });
}); });
fastify.listen(PORT, function (err, address) {
    if (err)
        throw err;
    console.info("Server started at ".concat(address));
});
