require("dotenv").config();
const { DISCORD_BOT_TOKEN } = process.env;
const { Client } = require("discord.js");

const client = new Client({
  partials: ["MESSAGE", "REACTION"],
});

client.login(DISCORD_BOT_TOKEN);
client.on("ready", async () => {
  console.log(`${client.user.tag} has logged in`);
});

client.on("messageReactionAdd", async (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if (reaction.message.id === "749693035285315605") {
    switch (name) {
      case ":flag_id:":
        member.roles.add("749693536269762800");
        break;
      case ":flag_jp:":
        member.roles.add("749693607816069253");
        break;
      case ":flag_sg":
        member.roles.add("749693658009305194");
        break;
      case ":flag_my":
        member.roles.add("749693638228836511");
        break;
    }
  }
});
