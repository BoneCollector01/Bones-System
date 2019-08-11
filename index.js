const botconfig = require("./botconfig.json")
const Discord = require("discord.js")
const superagent = require("superagent");
const fetch = require('node-fetch');
const prefix = botconfig.prefix;
const bot = new Discord.Client({disableEveryone: true});
require('dotenv/config');
const http = require('http');
const port = process.env.PORT || 3000;
http.createServer().listen(port);

bot.on("ready", async () => {
    bot.generateInvite(["ADMINISTRATOR"]).then(link => {
        console.log(`${bot.user.username} is online!`)
    }).catch(err => {
        console.log(err.stack);
    });
    await bot.generateInvite(["ADMINISTRATOR"]);
//    bot.user.setActivity(`${prefix}help`);
});

function keepSafe($msg){ //serial safe
    let embed = new Discord.RichEmbed()
        .setAuthor("Keep your serial safe.")
        .setDescription("Do not show anyone your serial. \n Your serial is used when running the script. \n If you share your serial it will be blacklisted and you wont get another one unless you buy it. \n There is no excuses for this, do not let anyone see your serial.")
        .setColor("#FF0000")
    $msg.channel.send(embed);
}

function serverHelp1($msg){ //activate
    let embed = new Discord.RichEmbed()
        .setAuthor("Need to activate a serial, or change your ROBLOX user id?")
        .setDescription("Message the bot and say " + prefix + "help \n The bot will give you a list of commands on how to activate your serial. \n Make sure you follow the commands exactly how they are.")
        .setColor("#FF0000")
    $msg.channel.send(embed);
}

function serverHelp2($msg){ //server commands
    let embed = new Discord.RichEmbed()
        .setAuthor("Commands!")
        .setDescription("All the commands are listed below. These only work in the server.")
        .setColor("#32CD32")
        .addField("Nothing at the moment.","Still working on server stuff for the bot.")
        .addField("Prefix","The prefix to use commands is " + prefix + " use it before any command for the command to work.")
    $msg.channel.send(embed);
}

function dmHelp($msg){ //mdm commands
    let embed = new Discord.RichEmbed()
        .setAuthor("DM Commands!")
        .setDescription("All the commands are listed below, these only work in a DM with this bot.")
        .setColor("#FF0000")
        .addField("Activate your serial.", "Follow the instructions below, if you do not type it in correct try again.")
        .addField("Activate a serial.", "```serial xxxx_xxxx_xxxx```")
        .addField("How to know when your serial has been activated?", "You will get the buyer role in the server, and you will be pinged.")
        .addField("Your serial wont activate?", "Message Bone Collector.")
    $msg.channel.send(embed);
    return;
}

bot.on("message", async message => {
    let args = message.content.split(" ");
    if (message.channel.name === "serials-added"){
        if (args[0] === "changeRole" && message.author.bot) {
            let user = message.guild.member(message.mentions.users.first()) || message.guild.memebers.get(args[2]);
            let channel = message.client.channels.find(channel => channel.name === "serial-added");
            let role = message.guild.roles.find(role => role.name === "Buyer");
            await(user.addRole(role));
            setTimeout(function(){
                channel.send("<@" + user.id + "> your serial has been activated! You can now use the script, if you run into any issues post them in #script-hub-issue.");
            },1250);
            return;
        }
    }
    if (message.author.bot) return;
    try {
        if (message.channel.type === "dm") {

            if (args[0] === `${prefix}help`){
        //        keepSafe(message);
        //        dmHelp(message);
                return;
            } else if (args[0] === "id"){
                message.author.send("Your ID: " + message.author.id);
            } else {
                message.author.send("Invalid Command: " + message.content);
                message.author.send("Use " + prefix + "help for a list of commands you're only able to use in DMs.");
                return;
            }

        } else {
        //    console.log("[" + message.channel.name + "] " +message.author.username + ": " + message.content)
            if (!args[0].startsWith(prefix)) return;
            if (args[0] === `${prefix}help`) {
                /*
                keepSafe(message);
                serverHelp1(message);
                serverHelp2(message);
                return;
                */
            } else if (args[0] === `${prefix}clear`) {

    //            if (message.memeber.hasPermission("MANAGE_MESSAGES")){
    //                if(!args[1]) return message.reply("You didn't define the second argument.").then(msg=>{msg.delete(5000)}).catch("error");
    //                message.channel.bulkDelete(args[1]);
    //                message.reply(" deleted " + args[1] + " messages.").then(msg=>{msg.delete(5000)}).catch("error");
    //                return;
    //            }

            }
        }
    } catch(e) {
        console.log(e)
    }
});

bot.on('error', err => {
    console.log(err);
});

bot.login(process.env.TOKEN);
