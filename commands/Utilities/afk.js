const Command = require("../../lib/structures/KlasaCommand");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            runIn: ["text", "dm"],
            cooldown: 5,
            permissionLevel: 0,
            requiredPermissions: ["USE_EXTERNAL_EMOJIS"],
            description: language => language.get("COMMAND_AFK_DESCRIPTION"),
            usage: "[reason:string]",
            extendedHelp: "No extended help available."
        });
    }

    async run(msg, [reason]) {
        reason = reason || "No Reason";

        const afk = await msg.author.settings.get("afk");
        if (!afk.afk) {
            await msg.author.settings.update("afk.afk", true).then(() => {
                msg.author.settings.update("afk.reason", reason, { action: "add" });
                msg.sendMessage(`${this.client.emotes.check} ***${msg.language.get("MESSAGE_AFK_TRUE")}***`);
            });
        } else {
            await msg.author.settings.update("afk.afk", false).then(() => {
                msg.author.settings.update("afk.reason", null);
                msg.sendMessage(`${this.client.emotes.cross} ***${msg.language.get("MESSAGE_AFK_FALSE")}***`);
            });
        }
    }

};
