const Command = require("../../lib/structures/KlasaCommand");
const { get } = require("snekfetch");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            cooldown: 8,
            aliases: ["trumpjoke", "trumpinsult"],
            requiredPermissions: ["ATTACH_IMAGES", "EMBED_LINKS"],
            description: language => language.get("COMMAND_TRUMP_DESCRIPTION"),
            extendedHelp: "No extended help available.",
            usage: "[user:username]"
        });
    }

    async run(msg, [user = msg.author]) {
        const { body } = await get(`https://api.whatdoestrumpthink.com/api/v1/quotes/personalized?q=${encodeURI(user.username)}`).catch(() => msg.sendMessage(`${this.client.emotes.cross} ***${msg.language.get("ER_CATS_DOGS")}***`));
        if (!body.message) throw msg.language.get("ER_TRY_AGAIN");
        const embed = new MessageEmbed()
            .setDescription(`**Get Trumped**\n\n${body.message}`)
            .setThumbnail("https://i.imgur.com/lGJbGy6.png")
            .setColor("RANDOM");
        return msg.sendMessage({ embed: embed });
    }

};
