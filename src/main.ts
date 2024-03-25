import "dotenv/config";
import { Client } from "discord.js";
import { Intents } from "./utils/getIntents";
import { loadCommands } from "./utils/loadCommands";
import { loadEvents } from "./utils/loadEvents";
import { deployCommands } from "./utils/deployCommands";

const client = new Client({
  intents: Intents,
});

deployCommands();
loadEvents(client);
loadCommands(client);

client.login(process.env.TOKEN);
