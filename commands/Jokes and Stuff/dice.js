const Command = require("../../lib/structures/KlasaCommand");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            cooldown: 8,
            aliases: ["die", "roll"],
            description: language => language.get("COMMAND_DICE_DESCRIPTION"),
            extendedHelp: "No extended help available.",
            usage: "[sides:integer]"
        });
    }

    async run(msg, [sides = 6]) {
        const num = Math.floor(Math.random() * sides) + 1;
        return msg.reply(`I rolled you a 🎲 of **${sides}** side(s) and got **${num}** as the outcome.`);
    }

};
