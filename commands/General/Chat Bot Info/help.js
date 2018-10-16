const { Command, util: { isFunction } } = require("klasa");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ["commands"],
            guarded: true,
            description: language => language.get("COMMAND_HELP_DESCRIPTION"),
            usage: "(Command:cmd)"
        });

        this.createCustomResolver("cmd", (arg, possible, msg) => {
            if (!arg || arg === "") return undefined;
            return this.client.arguments.get("cmd").run(arg, possible, msg);
        });
    }

    async run(msg, [cmd]) {
        const method = this.client.user.bot ? "author" : "channel";
        if (cmd) {
            const info = [
                `= ${cmd.name} = `,
                isFunction(cmd.description) ? cmd.description(msg.language) : cmd.description,
                msg.language.get("COMMAND_HELP_USAGE", cmd.usage.fullUsage(msg)),
                msg.language.get("COMMAND_HELP_EXTENDED"),
                isFunction(cmd.extendedHelp) ? cmd.extendedHelp(msg.language) : cmd.extendedHelp
            ].join("\n");
            return msg.sendMessage(info, { code: "asciidoc" });
        }
        const help = await this.buildHelp(msg);
        const categories = Object.keys(help);
        const helpMessage = [];
        helpMessage.push("**📘 __PenguBot Help Command__**\n");
        for (let cat = 0; cat < categories.length; cat++) {
            helpMessage.push(`**${categories[cat]} Commands**:`, "```asciidoc");
            const subCategories = Object.keys(help[categories[cat]]);
            for (let subCat = 0; subCat < subCategories.length; subCat++) helpMessage.push(`= ${subCategories[subCat]} =`, `${help[categories[cat]][subCategories[subCat]].join("\n")}\n`);
            helpMessage.push("```", "\u200b");
        }

        return msg[method].send(helpMessage, { split: { char: "\u200b" } })
            .then(() => { if (msg.channel.type !== "dm" && this.client.user.bot) msg.sendMessage(msg.language.get("COMMAND_HELP_DM")); })
            .catch(() => { if (msg.channel.type !== "dm" && this.client.user.bot) msg.sendMessage(msg.language.get("COMMAND_HELP_NODM")); });
    }

    async buildHelp(msg) {
        const help = {};

        const commandNames = [...this.client.commands.keys()];
        const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

        await Promise.all(this.client.commands.map(command =>
            this.client.inhibitors.run(msg, command, true)
                .then(() => {
                    if (!help.hasOwnProperty(command.category)) help[command.category] = {};
                    if (!help[command.category].hasOwnProperty(command.subCategory)) help[command.category][command.subCategory] = [];
                    const description = isFunction(command.description) ? command.description(msg.language) : command.description;
                    help[command.category][command.subCategory].push(`${msg.guildSettings.prefix}${command.name.padEnd(longest)} :: ${description}`);
                })
                .catch(() => {
                    // noop
                })
        ));

        return help;
    }

};
