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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
Object.defineProperty(exports, "__esModule", { value: true });
var mpl_bubblegum_1 = require("@metaplex-foundation/mpl-bubblegum");
var utils_1 = require("./utils");
var web3_js_1 = require("@solana/web3.js");
var spl_account_compression_1 = require("@solana/spl-account-compression");
var raydium_sdk_1 = require("@raydium-io/raydium-sdk");
function createTree() {
    return __awaiter(this, void 0, void 0, function () {
        var keypair, connection, merkleTree, _a, treeAuthority, _bump, depthSizePair, space, createAccountIx, _b, _c, createTreeIx, sx;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    keypair = (0, utils_1.loadWalletKey)("9awGHn1T8A4ko2R1Q3NpCQKLmb8jUDPyTSszsZF4VBef");
                    connection = new web3_js_1.Connection("https://api.devnet.solana.com ");
                    merkleTree = (0, utils_1.loadWalletKey)("TRERRpwR59za9tqDM7KGoSmPvaYz4DnhmRbk5DDJRUZ.json");
                    _a = web3_js_1.PublicKey.findProgramAddressSync([merkleTree.publicKey.toBuffer()], mpl_bubblegum_1.PROGRAM_ID), treeAuthority = _a[0], _bump = _a[1];
                    depthSizePair = {
                        maxDepth: 14,
                        maxBufferSize: 256
                    };
                    space = (0, spl_account_compression_1.getConcurrentMerkleTreeAccountSize)(depthSizePair.maxDepth, depthSizePair.maxBufferSize);
                    _c = (_b = web3_js_1.SystemProgram).createAccount;
                    _d = {
                        newAccountPubkey: merkleTree.publicKey,
                        fromPubkey: keypair.publicKey,
                        space: space
                    };
                    return [4 /*yield*/, connection.getMinimumBalanceForRentExemption(space)];
                case 1: return [4 /*yield*/, _c.apply(_b, [(_d.lamports = _e.sent(),
                            _d.programId = spl_account_compression_1.SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
                            _d)])];
                case 2:
                    createAccountIx = _e.sent();
                    return [4 /*yield*/, (0, mpl_bubblegum_1.createCreateTreeInstruction)({
                            merkleTree: merkleTree.publicKey,
                            treeAuthority: treeAuthority,
                            payer: keypair.publicKey,
                            treeCreator: keypair.publicKey,
                            compressionProgram: spl_account_compression_1.SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
                            logWrapper: spl_account_compression_1.SPL_NOOP_PROGRAM_ID,
                            systemProgram: raydium_sdk_1.SYSTEM_PROGRAM_ID
                        }, {
                            maxDepth: depthSizePair.maxDepth,
                            maxBufferSize: depthSizePair.maxBufferSize,
                            public: false
                        })];
                case 3:
                    createTreeIx = _e.sent();
                    return [4 /*yield*/, (0, utils_1.sendVersionedTx)(connection, [createAccountIx, createTreeIx], keypair.publicKey, [keypair, merkleTree])];
                case 4:
                    sx = _e.sent();
                    console.log(sx);
                    return [2 /*return*/];
            }
        });
    });
}
