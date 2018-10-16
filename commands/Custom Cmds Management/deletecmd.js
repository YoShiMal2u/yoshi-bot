const Command = require("../../lib/structures/KlasaCommand");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            runIn: ["text"],
            cooldown: 10,
            aliases: ["delcmd", "removecmd"],
            permissionLevel: 6,
            requiredPermissions: ["USE_EXTERNAL_EMOJIS"],
            description: language => language.get("COMMAND_DEL_CMD_DESCRIPTION"),
            usage: "<name:string>",
            extendedHelp: "No extended help available."
        });
    }

    async run(msg, [name]) {
        const cmd = msg.guild.settings.customcmds.cmds.find(c => c.name === name);
        if (!cmd) return msg.reply(`${this.client.emotes.cross} ***\`${name}\` ${msg.language.get("MESSAGE_CMD_NOTFOUND")}***`);
        await msg.guild.settings.update("customcmds.cmds", cmd, { action: `remove` });
        return msg.sendMessage(`${this.client.emotes.check} ***\`${name}\` ${msg.language.get("MESSAGE_CMD_REMOVED")} ${msg.author.tag}!***`);
    }

};
