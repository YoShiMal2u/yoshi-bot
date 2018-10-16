const MusicCommand = require("../../lib/structures/MusicCommand");
const snekfetch = require("snekfetch");

module.exports = class extends MusicCommand {

    constructor(...args) {
        super(...args, {
            requireMusic: true,
            upvoteOnly: true,
            cooldown: 8,
            aliases: ["dumpplaylist", "savesongs", "save"],
            requiredPermissions: ["USE_EXTERNAL_EMOJIS"],
            description: language => language.get("COMMAND_DUMP_DESCRIPTION"),
            extendedHelp: "No extended help available."
        });
    }

    async run(msg) {
        const { music } = msg.guild;
        const { queue } = music;
        if (!music.playing) return msg.sendMessage(`${this.client.emotes.cross} ***There's currently no music playing!***`);

        const raw = { info: "This file was created by PenguBot.com", songs: [] };
        for (const song of queue) {
            raw.songs.push(song.url);
        }

        const paste = await this.upload(raw);
        return msg.sendMessage(`${this.client.emotes.check} **Raw dump of current queue has been created:** ${paste}\n**Tip:** Save this URL to use with the \`play\` command to instantly load a queue.`);
    }

    async upload(data) {
        const req = await snekfetch.post("https://paste.pengubot.com/documents").send(data);
        return `https://paste.pengubot.com/${req.body.key}`;
    }

};
