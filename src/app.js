const { DISCORD_BOT_TOKEN, PREFIX, YOUTUBE_API_KEY } = process.env
import { Client, GatewayIntentBits, Partials, EmbedBuilder, ActivityType } from "discord.js"
import { escapeMarkdown } from '@discordjs/formatters'
import { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice'
import Youtube from 'simple-youtube-api'
import ytdl from "ytdl-core";

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

client.on("ready", () => {
  console.log(`✅ ${client.user.tag} has logged in`)
  console.log(client.guilds.cache.size);
  client.user.setActivity(`${PREFIX}help for list commands`, { type: ActivityType.Custom })
});

const youtube = new Youtube(YOUTUBE_API_KEY)
const queue = new Map();


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
  if (message.author.bot) return
  if (!message.content.startsWith(PREFIX)) return

  const [CMD_NAME, ...args] = message.content
    .trim()
    .substring(PREFIX.length)
    .split(/\s+/)
  
  const [target, ...messages] = args
  const channelName = message.guild.name;
  const memberName = message.member;
  const mentionedUser = message.mentions.users.first();

  switch (CMD_NAME.toLocaleLowerCase()) {
    case "hi":
      message.reply(
        `Hi ${memberName}, you can check other command by typing ***;help***`
      );
      break;
    
    case 'play':
      const voiceChannel = message.member.voice.channel
      if (!voiceChannel) return message.channel.send(`Join the voice channel first to command ${PREFIX}play`)
      const permission = voiceChannel.permissionsFor(message.client.user)
      if (!permission.has('Connect')) return message.channel.send('Set permission to join channel first')
      if (!permission.has('Speak')) return message.channel.send('Set permission to able Speak first')
      const url = target

      try {
        const video = await youtube.getVideo(url)
        return handleVideo(video, message, voiceChannel)
      } catch (error) {
        console.error(error)
      }
      break

    case 'disconnect': {
      const voiceChannel = message.member.voice.channel
      if (!voiceChannel) return message.channel.send('There is no one in voice channel')
      return getVoiceConnection(message.guildId).destroy()
    }

    case "toss":
      const randomNumber = Math.floor(Math.random() * 10) + 1;
      message.reply(`Your Number is: ${randomNumber}`);
      break;

    case "warn":
      const user = target
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
      return message.reply(
        `Hey ${memberName}, you call a unknown command`
      );
  }
})

const handleVideo = async (video, msg, voiceChannel, playlist = false) => {
  const serverQueue = queue.get(msg.guild.id)
  const song = {
    id: video.id,
    title: escapeMarkdown(video.title),
    url: `https://www.youtube.com/watch?v=${video.id}`
  }
  if (!serverQueue) {
    const queueConstruct = {
      textChannel: msg.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 100,
      playing: true,
      loop: false
    }
    queue.set(msg.guild.id, queueConstruct)
    queueConstruct.songs.push(song)

    const connection = joinVoiceChannel({
      channelId: msg.member.voice.channel.id,
      guildId: msg.guild.id,
      adapterCreator: msg.guild.voiceAdapterCreator
    })
    queueConstruct.connection = connection
    play(msg.guild, queueConstruct.songs[0])

  } else {
    serverQueue.songs.push(song)
    if (playlist) return
    else return msg.channel.send(`🔊 **\`${song.title}\`** Added to the queue!`)
  }
  return
}

const play = (guild, song) => {
  const serverQueue = queue.get(guild.id)

  if (!song) {
    serverQueue.voiceChannel.leave()
    return queue.delete(guild.id)
  }

  const player = createAudioPlayer()
  serverQueue.connection.subscribe(player)
  const resource = createAudioResource(ytdl(song.url))
  player.play(resource)
  player.on(AudioPlayerStatus.Idle, () => {
    serverQueue.connection.destroy()
  })

  // const dispatcher = serverQueue.connection.play(ytdl(song.url))
  //   .on('finish', () => {
  //     const shiffed = serverQueue.songs.shift()
  //     if (serverQueue.loop === true) {
  //       serverQueue.songs.push(shiffed)
  //     }
  //     play(guild, serverQueue.songs[0])
  //   })
  //   .on('error', (error) => console.error(error))
  
  // dispatcher.setVolume(serverQueue.volume / 100)

  serverQueue.textChannel.send(`🎶 Playing: **\`${song.title}\`**`)
}

//* Bot Welcome *//
client.on("guildMemberAdd", (member) => {
  const channelId = "749657502114906146";
  const serverName = member.guild.name;
  const message = `Hi <@${member.id}> welcome to ${serverName} server`;
  const channel = member.guild.channels.cache.get(channelId);
  channel.send(message);
});
