import { level, log } from "./utilities/logger";
import "dotenv/config";

const { ShardingManager } = require('discord.js');

const manager = new ShardingManager('./dist/bot.js', { token: process.env.TOKEN });

manager.on('shardCreate', (shard: { id: any; }) => log(`Launched shard ${shard.id}`, level.DEBUG));

manager.spawn();