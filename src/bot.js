require("dotenv").config();
const { DISCORD_BOT_TOKEN, PREFIX } = process.env;
const { Client, MessageEmbed } = require("discord.js");

const client = new Client({
  partials: ["MESSAGE", "REACTION"],
});
client.login(DISCORD_BOT_TOKEN);

client.on("ready", () => {
  console.log(`${client.user.tag} has logged in`);
});

/**
 ** Bot Reaction
 */
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

/**
 ** Bot Reaction Remove
 */
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

/**
 ** Bot Command
 */
const kickCMD = "`;kick <mention the user>`";
const tossCMD = "`;toss`";
const warnCMD = "`;warn <mention the user>`";
const hiCMD = "`;hi`";

const helpMessage = `
Command list that you can use:

${tossCMD} to start the rolldice,
${kickCMD} to kick user,
${hiCMD} to say hello,
${warnCMD} to warning an user 
`;

client.on("message", async (message) => {
  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content
      .toLowerCase()
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);

    const channelName = message.guild.name;
    const memberName = message.member;
    const mentionedUser = message.mentions.users.first();
    const member = message.guild.member(mentionedUser);

    switch (CMD_NAME) {
      case "hi":
        message.channel.send(
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
        if (!message.member.hasPermission("KICK_MEMBERS")) {
          return message.reply("You roles cannot kick someone in this channel");
        }

        if (!mentionedUser)
          return message.reply("You didn't mention the user to kick!");

        if (member) {
          try {
            await member.kick();
            return message.channel.send(
              `Yay, ${member} has been kicked from this channel`
            );
          } catch (error) {
            console.log(error);
            return message.channel.send(
              "User was not found or I don't have permission to kick the mentioned user"
            );
          }
        }
        break;

      case "ban":
        if (!message.member.hasPermission("BAN_MEMBERS")) {
          return message.reply("You roles cannot ban someone in this channel");
        }

        if (!mentionedUser)
          return message.reply("You didn't mention the user to ban!");

        if (member) {
          try {
            await member.ban();
            return message.channel.send(
              `Yay, ${member} has been banned from this channel`
            );
          } catch (error) {
            console.log(error);
            return message.channel.send(
              "User was not found or I don't have permission to ban the mentioned user"
            );
          }
        }
        break;

      case "help":
        const embed = new MessageEmbed()
          .setTitle("Anjay bot commands")
          .setColor(0xff0000)
          .setDescription(helpMessage);
        message.channel.send(embed);
        break;
      default:
        return message.channel.send(
          `Hey ${memberName}, you call a unknown command`
        );
    }
  }
});

/**
 ** Bot Welcome
 */
client.on("guildMemberAdd", (member) => {
  const channelId = "749657502114906146";
  const serverName = member.guild.name;
  const message = `Hi <@${member.id}> welcome to ${serverName} server`;
  const channel = member.guild.channels.cache.get(channelId);
  channel.send(message);
});
