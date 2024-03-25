import "dotenv/config";
import { Client } from "discord.js";
import { Intents } from "./utils/intents";
import { loadCommands } from "./handlers/loadCommands";
import { loadEvents } from "./handlers/loadEvents";
import { deployCommands } from "./utils/deploy";

const client = new Client({
  intents: Intents,
});

deployCommands();
loadEvents(client);
loadCommands(client);

client.login(process.env.TOKEN);
