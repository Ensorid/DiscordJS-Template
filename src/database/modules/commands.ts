import { db } from '../index';

export async function getDisabledCommands(guildId: string): Promise<string[]> {
  return (await db().get<string[]>(`disabledCommands:${guildId}`)) ?? [];
}

export async function disableCommand(guildId: string, commandName: string): Promise<void> {
  const disabled = await getDisabledCommands(guildId);
  if (!disabled.includes(commandName)) {
    disabled.push(commandName);
    await db().set(`disabledCommands:${guildId}`, disabled);
  }
}

export async function enableCommand(guildId: string, commandName: string): Promise<void> {
  const disabled = await getDisabledCommands(guildId);
  const filtered = disabled.filter(cmd => cmd !== commandName);
  await db().set(`disabledCommands:${guildId}`, filtered);
}

export async function isCommandDisabled(guildId: string, commandName: string): Promise<boolean> {
  const disabled = await getDisabledCommands(guildId);
  return disabled.includes(commandName);
}
