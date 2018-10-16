const { Monitor } = require("klasa");
const { Canvas } = require("canvas-constructor");
const fs = require("fs-nextra");
const { get } = require("snekfetch");

const timeout = new Set();

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            ignoreBots: true,
            ignoreSelf: true,
            ignoreOthers: false
        });
    }

    async run(msg) {
        if (!msg.guild) return;
        if (timeout.has(`${msg.author.id}-${msg.guild.id}`)) return;

        if (this.client.user.id !== "303181184718995457") {
            const mainBot = await msg.guild.members.fetch("303181184718995457").catch(() => null);
            if (mainBot) return;
        }

        await msg.member.settings.sync(true);
        if (!msg.member.settings) return;

        const randomXP = this.client.funcs.randomNumber(1, 5);
        const oldLvl = msg.member.settings.level;
        const newXP = msg.member.settings.xp + randomXP;
        const newLvl = Math.floor(0.2 * Math.sqrt(newXP));
        await msg.member.settings.update([["xp", newXP], ["level", newLvl]]);

        timeout.add(`${msg.author.id}-${msg.guild.id}`);
        setTimeout(() => timeout.delete(`${msg.author.id}-${msg.guild.id}`), 45000);

        // Generate Level Up Images on Level Up
        if (oldLvl !== newLvl) {
            if (msg.guild.settings.levelup) {
                if (msg.guild.settings.leveltype !== "user") return;
                if (!msg.channel.postable) return;
                const bgName = msg.author.settings.profilebg;
                const bgImg = await fs.readFile(`${process.cwd()}/assets/profiles/bg/${bgName}.png`);
                const avatar = await get(msg.author.displayAvatarURL({ format: "png", size: 128 })).then(res => res.body).catch(e => {
                    Error.captureStackTrace(e);
                    return e;
                });
                const img = await new Canvas(100, 100)
                    .addImage(bgImg, 0, 0, 530, 530)
                    .addImage(avatar, 22, 22, 57, 57)
                    .toBufferAsync();
                msg.sendMessage(`🆙 | **${msg.author.tag}** has leveled up to **Level ${newLvl}** in **${msg.guild.name}**`, { files: [{ attachment: img, name: `${msg.author.id}.png` }] });
            }
            if (msg.guild.settings.levelroles.enabled) {
                const { roles } = msg.guild.settings.levelroles;
                if (roles.length === 0) return;
                const levelRole = roles.find(r => r.lvl === newLvl);
                if (!levelRole) return;
                const role = msg.guild.roles.find(r => r.id === levelRole);
                if (!role) return;
                const myRole = msg.guild.me.roles.find(r => r.managed);
                if (role.position > myRole.positon) return;
                if (msg.member.roles.has(role)) return;
                await msg.member.roles.add(role, "Level Based Role").catch(() => null);
            }
        }
    }

};
