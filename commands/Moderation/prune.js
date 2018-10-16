const Command = require("../../lib/structures/KlasaCommand");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            runIn: ["text"],
            cooldown: 10,
            aliases: ["clean", "purge"],
            permissionLevel: 4,
            requiredPermissions: ["MANAGE_MESSAGES", "USE_EXTERNAL_EMOJIS"],
            description: language => language.get("COMMAND_PRUNE_DESCRIPTION"),
            usage: "[limit:integer] [link|links|invite|invites|bots|pengu|me|upload|uploads|user:user]",
            usageDelim: " ",
            extendedHelp: "No extended help available."
        });
    }

    async run(msg, [limit = 10, filter = null]) {
        await msg.delete();
        let messages = await msg.channel.messages.fetch({ limit: 100 });

        if (filter) {
            const user = typeof filter !== "string" ? filter : null;
            const type = typeof filter === "string" ? filter : "user";
            messages = messages.filter(this.getFilter(msg, type, user));
        }

        messages = messages.array().slice(0, limit);
        await msg.channel.bulkDelete(messages, true).catch(() => msg.reply("I tried my best but some messages were older than 14 days so I couldn't delete them!"));
        const m = await msg.sendMessage(`${this.client.emotes.check} ***${messages.length} ${msg.language.get("MESSAGE_PRUNE_DELETED")}***`);
        m.delete({ timeout: 5000 });
    }

    getFilter(msg, filter, user) {
        switch (filter) {
            case "link" || "links": return mes => /https?:\/\/[^ /.]+\.[^ /.]+/.test(mes.content);
            case "invite" || "invites": return mes => /(https?:\/\/)?(www\.)?(discord\.(gg|li|me|io)|discordapp\.com\/invite)\/.+/.test(mes.content);
            case "bots": return mes => mes.author.bot;
            case "pengu": return mes => mes.author.id === this.client.user.id;
            case "me": return mes => mes.author.id === msg.author.id;
            case "upload" || "uploads": return mes => mes.attachments.size > 0;
            case "user": return mes => mes.author.id === user.id;
            default: return () => true;
        }
    }

};
