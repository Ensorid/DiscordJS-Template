# Discord Bot Template 🤖

Welcome to my Discord Bot template project! This bot is built using TypeScript and Node.js, following the recommendations from the [Discord.js Guide](https://discordjs.guide). 

## 🚀 About The Project

This project is written for fun only. I don't consider myself a developer. 🎉

## 📦 Features

- Basic command and events handling
- Cooldown support
- High customisation
- Log system

## 🛠️ Technologies Used

- **TypeScript**
- **Node.js**
- **Discord.js**

## 📋 Getting Started

To get a local copy up and running, follow these simple steps:

1. **Clone the repo**
   ```bash
   git clone https://github.com/Ensorid/DiscordJS-Template.git
   ```

2. **Install packages using PNPM**
   ```bash
    cd DiscordJS-Template
    pnpm i
   ```

3. **Set up your environment variables**
    Copy the `.env.example` to `.env` file in the root directory then add your Discord bot token and ClientId:
    ```
    TOKEN=YOUR_TOKEN
    CLIENTID=YOUR_CLIENT_ID
    ```

4. **Run for developement**
   ```bash
   pnpm run dev
   ```

5. **Build and run for production**
   ```bash
   pnpm run build # Build the code to /dist folder
   pnpm run start # Start the bot from /dist folder
   ```

## 🐋 Docker

For production, you can use Docker by following these steps :

1. **Build your bot**
   ```bash
   pnpm run build
   ```

2. **Build your Docker image**
   ```bash
   docker build -t <your_bot_name> .
   ```

3. **Run your bot**
   ```bash
   docker run --env-file .env <your_bot_name>
   ```

> [!IMPORTANT]\
> Don't forget to replace .env with your actual environment path.


## 📖 Usage

Once the bot is running, you can interact with it in your Discord server. Use the commands defined in the bot to see what it can do!

## 🤝 Contributing

I welcome any contributions, suggestions, or feedback! You can submit any issues, or submit a pull request from the appropriate sections.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.