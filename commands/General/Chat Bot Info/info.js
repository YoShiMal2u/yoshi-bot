const Command = require("../../../lib/structures/KlasaCommand");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ["details", "what"],
            guarded: true,
            requiredPermissions: ["EMBED_LINKS"],
            description: language => language.get("COMMAND_INFO_DESCRIPTION")
        });
    }

    async run(msg) {
        const embed = new MessageEmbed()
            .setDescription(msg.language.get("COMMAND_INFO"))
            .setAuthor("PenguBot - Information", this.client.user.displayAvatarURL(), "https://www.pengubot.com")
            .setColor("RANDOM");
        return msg.sendEmbed(embed);
    }

};
