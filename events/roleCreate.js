const { Event } = require("klasa");

module.exports = class extends Event {

    async run(role) {
        this.client.emit("customLogs", role.guild, "roleCreate", { role: role, name: "roles" });
    }

};
