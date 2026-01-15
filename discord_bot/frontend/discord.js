import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  const oldCh = oldState.channelId;
  const newCh = newState.channelId;

  if (newState.member?.user?.bot) return;

  const guildId = newState.guild.id;
  const userId = newState.id;
  const now = new Date().toISOString();

  // 입장
  if (!oldCh && newCh) {
    await postJoin({ guildId, userId, channelId: newCh, joinedAt: now });
    return;
  }

  // 퇴장
  if (oldCh && !newCh) {
    await postLeave({ guildId, userId, channelId: oldCh, leftAt: now });
    return;
  }

  // 이동(기존 세션 종료 + 새 세션 시작)
  if (oldCh && newCh && oldCh !== newCh) {
    await postLeave({ guildId, userId, channelId: oldCh, leftAt: now });
    await postJoin({ guildId, userId, channelId: newCh, joinedAt: now });
  }
});
