const Command = require("../../lib/structures/KlasaCommand");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            cooldown: 8,
            requiredPermissions: ["ATTACH_FILES", "USE_EXTERNAL_EMOJIS", "EMBED_LINKS"],
            description: language => language.get("COMMAND_APPROVED_DESCRIPTION"),
            extendedHelp: "No extended help available.",
            usage: "[ApproveWho:username]"
        });
    }

    async run(msg, [ApproveWho = msg.author]) {
        const image = await this.client.idiotic.approved(ApproveWho.displayAvatarURL({ format: "png", size: 512 }))
            .catch(() => null);
        if (!image) return msg.reply(msg.language.get("ER_TRY_AGAIN"));
        return msg.channel.sendFile(image);
    }

};
