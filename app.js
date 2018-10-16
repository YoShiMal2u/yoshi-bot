const PenguClient = require("./lib/structures/PenguClient");
const config = require("./config.json");
const Raven = require("raven");

Raven.config(config.keys.sentry, { captureUnhandledRejections: true }).install();

Raven.context(() => {
    new PenguClient({
        prefix: "p!",
        commandEditing: true,
        disableEveryone: true,
        regexPrefix: /^((?:Hey |Ok )?Pengu(?:,|!| ))/i,
        ownerID: "136549806079344640",
        typing: true,
        disabledEvents: [
            "GUILD_SYNC",
            "CHANNEL_PINS_UPDATE",
            "USER_NOTE_UPDATE",
            "RELATIONSHIP_ADD",
            "RELATIONSHIP_REMOVE",
            "USER_SETTINGS_UPDATE",
            "VOICE_STATE_UPDATE",
            "VOICE_SERVER_UPDATE",
            "TYPING_START",
            "PRESENCE_UPDATE"
        ],
        pieceDefaults: {
            commands: { deletable: true, quotedStringSupport: true, bucket: 2 },
            rawEvents: { enabled: true }
        },
        providers: {
            default: "rethinkdb",
            rethinkdb: { db: "pengubot", servers: [{ host: config.database.host, port: config.database.port }] }
        },
        console: { useColor: true },
        production: config.main.production,
        presence: { activity: { name: "❤ p!donate For Exclusive Patron Bot Access ➖ p!help", type: "PLAYING" } },
        prefixCaseInsensitive: true,
        noPrefixDM: true,
        aliasFunctions: { returnRun: true, enabled: true, prefix: "funcs" },
        dashboardHooks: { apiPrefix: "/" },
        clientSecret: config.dashboard.secret,
        clientID: config.dashboard.id,
        messageSweepInterval: 60,
        messageCacheLifetime: 120,
        commandMessageLifetime: 120
    }).login(config.main.token);
});

process.on("uncaughtException", err => {
    console.error(`uncaughtException:\n${err.stack}`);
    Raven.captureException(err);
});
