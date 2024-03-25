## 🤖 DiscordJS Template : Written in TypeScript

> This project aims to facilitate the creation of Discord bot using the DiscordJS framework.
> ⚠️ I don't consider myself a developer! But I'll be there to improve the code!

## ✨ Features

- Log system
- Commands & Events handlers
- Example ping command
- Cooldown command

## 🚧 TO:DO

- Cooldown command
- Docker
- ESlint
- Database
- Redis
- AutoMod

## 🔥 Get Started

Go to the [Discord Developer Portal](https://discord.com/developers/applications) and create a new Discord bot. ![Discord bot creation](https://raw.githubusercontent.com/Ensorid/ensorid.github.io/main/assets/img/New%20Discord%20Application.png)

Move to "Bot" section and click on reset token.
![Discord Reset Token](https://raw.githubusercontent.com/Ensorid/ensorid.github.io/main/assets/img/Reset%20Discord%20Bot%20Token.png)

Copy your Bot TOKEN in a safe text file. ![Discord Reset Token Success](https://raw.githubusercontent.com/Ensorid/ensorid.github.io/main/assets/img/Reset%20Discord%20Token%20Success.png)

Download the latest version of [NodeJS](https://nodejs.org) for your OS.

Install typescript on your system with this command:

```bash
npm install -g typescript
```

Clone the reposiroty

```bash
git clone https://github.com/Ensorid/DiscordJS-Template.git && cd DiscordJS-Template
```

Duplicate the .env.example file as .env and fill all fields with your own values.

> [!WARNING]\
> TOKEN is your bot's token,
> GUILD_ID is the id of your developement server,
> CLIENT_ID is the bot's ID.

After you can execute this command to install all dependencies:

```bash
npm install
```

> [!NOTE]\
> When developing make sure to set publicBot to false in the config.json file.

To test your bot, you can use this command :

```bash
npm run dev
```

If you want to export your code in JavaScript, use this command:

```bash
npm run build
```

And this command to run it after building:

```bash
npm start
```

## ❗ Bug Report

> [!IMPORTANT]\
> If you encountered any bug, please send an [issue](https://github.com/ensorid/discordjs-template/issues)!
