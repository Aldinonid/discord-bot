const { DISCORD_BOT_TOKEN, PREFIX } = process.env
import { Client, GatewayIntentBits, Partials, EmbedBuilder } from "discord.js"

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel],
});

client.login(DISCORD_BOT_TOKEN);

client.on("ready", () => console.log(`✅ ${client.user.tag} has logged in`));

//* Bot Reaction *//
client.on("messageReactionAdd", async (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  const channel = reaction.message.channel;
  const role = (roleId) => reaction.message.guild.roles.cache.get(roleId);
  const message = (id) =>
    `Congratulation <@${user.id}>, you has been promoted to be ${role(id)}`;

  if (reaction.message.id === "750023744440762501") {
    switch (name) {
      case "🍎":
        member.roles.add("749693536269762800");
        channel.send(message("749693536269762800"));
        break;
      case "🍌":
        member.roles.add("749693607816069253");
        channel.send(message("749693607816069253"));
        break;
      case "🥭":
        member.roles.add("749693658009305194");
        channel.send(message("749693658009305194"));
        break;
      case "🍑":
        member.roles.add("749693638228836511");
        channel.send(message("749693638228836511"));
        break;
    }
  }
});

//* Bot Reaction Remove *//
client.on("messageReactionRemove", async (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  const channel = reaction.message.channel;
  const role = (roleId) => reaction.message.guild.roles.cache.get(roleId);
  const message = (id) =>
    `Unfornately <@${user.id}>, your role has been depromoted from ${role(id)}`;

  if (reaction.message.id === "750023744440762501") {
    switch (name) {
      case "🍎":
        member.roles.remove("749693536269762800");
        channel.send(message("749693536269762800"));
        break;
      case "🍌":
        member.roles.remove("749693607816069253");
        channel.send(message("749693607816069253"));
        break;
      case "🥭":
        member.roles.remove("749693658009305194");
        channel.send(message("749693658009305194"));
        break;
      case "🍑":
        member.roles.remove("749693638228836511");
        channel.send(message("749693638228836511"));
        break;
    }
  }
});

//* Bot Command *//

const kickCMD = `${PREFIX}kick <mention the user>`;
const tossCMD = `${PREFIX}toss`;
const warnCMD = `${PREFIX}warn <mention the user>`;
const hiCMD = `${PREFIX}hi`;
const roastCMD = `${PREFIX}roast <mention the user>`

const helpMessage = `
Command list that you can use:

- \`${tossCMD}\` to start the rolldice
- \`${kickCMD}\` to kick user
- \`${hiCMD}\` to say hello
- \`${warnCMD}\` to warning an user
- \`${roastCMD}\` to roasting an user
`;
client.on('messageCreate', async (message) => {
  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content
      .toLowerCase()
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/)
    
    const channelName = message.guild.name;
    const memberName = message.member;
    const mentionedUser = message.mentions.users.first();

    switch (CMD_NAME) {
      case "hi":
        message.reply(
          `Hi ${memberName}, you can check other command by typing ***;help***`
        );
        break;

      case "toss":
        const randomNumber = Math.floor(Math.random() * 10) + 1;
        message.reply(`Your Number is: ${randomNumber}`);
        break;

      case "warn":
        const [user, ...messages] = args;

        if (!user || !user.includes("@")) {
          return message.channel.send(
            `Hey ${memberName}, please mention that user need to warn`
          );
        }
        message.channel.send(`Hey ${user}, ${messages.join(" ")}`);
        break;

      case "kick":
        if (!message.member.hasPermission("KICK_MEMBERS")) 
          return message.reply("You roles cannot kick someone in this channel");

        if (!mentionedUser)
          return message.reply("You didn't mention the user to kick!");

        try {
          const member = await message.guild.members.fetch(mentionedUser);
          await member.kick();
          return message.channel.send(
            `Yay, ${member} has been kicked from this channel`
          );
        } catch (error) {
          console.error(error)
          message.channel.send(
            "User was not found or I don't have permission to kick the mentioned user"
          );
        }
        break;

      case "ban":
        if (!message.member.hasPermission("BAN_MEMBERS")) 
          return message.reply("You roles cannot ban someone in this channel");

        if (!mentionedUser)
          return message.reply("You didn't mention the user to ban!");

        try {
          const member = await message.guild.members.fetch(mentionedUser);
          await member.ban();
          return message.channel.send(
            `Bye bye ${member}, you has has been banned from ${channelName} server`
          );
        } catch (error) {
          console.error(error)
          message.channel.send(
            "User was not found or I don't have permission to ban the mentioned user"
          );
        }
        break

      case 'roast':
        if (!mentionedUser)
          return message.reply('Mention orangnya cok, gimana mau roast tapi orgnya tak ada')

        try {
          const member = await message.guild.members.fetch(mentionedUser);
          const embed = new EmbedBuilder()
          .setTitle("Anjay bot commands")
          .setColor(0xff0000)
          .setDescription(
            `Jalan jalan ke pantai
            karena macet lewat jalan tol
            hei ${member} yang lagi makan petai
            muka kau kayak k*nt*l`
          );
          return message.channel.send({ embeds: [embed] });
        } catch (error) {
          console.error(error)
          message.channel.send('Something went wrong, I can feel it')
        }
        break

      case "help":
        const embed = new EmbedBuilder()
          .setTitle("Anjay bot commands")
          .setColor(0xff0000)
          .setDescription(helpMessage);
        message.channel.send({ embeds: [embed] });
        break;
      default:
        return message.channel.send(
          `Hey ${memberName}, you call a unknown command`
        );
    }
  }
})

//* Bot Welcome *//
client.on("guildMemberAdd", (member) => {
  const channelId = "749657502114906146";
  const serverName = member.guild.name;
  const message = `Hi <@${member.id}> welcome to ${serverName} server`;
  const channel = member.guild.channels.cache.get(channelId);
  channel.send(message);
});
