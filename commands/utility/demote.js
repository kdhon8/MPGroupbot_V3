const { SlashCommandBuilder, EmbedBuilder, Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const noblox = require('noblox.js')
const { groupId, role, logChannelID, token, ownerId } = require('../../config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('강등')
		.setDescription('유저의 그룹 랭크를 1단계 강등합니다.')
		.setContexts([0])
		.addStringOption(option =>
			option
				.setName('닉네임')
				.setDescription('강등할 유저의 닉네임을 입력하세요')
				.setRequired(true)),

				async execute(interaction) {
					try{
						await interaction.deferReply();
						const logChannel = client.channels.cache.get(logChannelID);
						const member = await interaction.guild.members.fetch(interaction.user.id);
		
						if (!member.roles.cache.has(role) && interaction.user.id != ownerId) {
							const Embed = new EmbedBuilder()
								.setTitle('권한 부족')
								.setColor(0xFF0000)
								.setDescription(`그룹관리자 역할 (<@&${role}>)이 필요합니다.`)
							
							interaction.editReply({ embeds: [Embed] });
							return;
						}
		
						const name = interaction.options.getString('닉네임');
						const userId = await noblox.getIdFromUsername(name);
		
						if (!userId) {
							const Embed = new EmbedBuilder()
								.setTitle('오류')
								.setColor(0xFF0000)
								.setDescription(`해당 유저는 Roblox에 존재하지 않습니다.`)
							
							interaction.editReply({ embeds: [Embed] });
							return;
						}

						const isMember = await noblox.getRankInGroup(groupId, userId)
						
						if (isMember == 0) {
							const Embed = new EmbedBuilder()
								.setTitle('오류')
								.setColor(0xFF0000)
								.setDescription(`해당 유저는 그룹의 맴버가 아닙니다.`)
							
							interaction.editReply({ embeds: [Embed] });
							return;
						}

						const bRank = await noblox.getRankNameInGroup(groupId, userId);
		
						const rName = await noblox.getUsernameFromId(userId);
		
						await noblox.demote(groupId, userId);
						const aRank = await noblox.getRankNameInGroup(groupId, userId);

						const log = new EmbedBuilder()
							.setTitle('강등 기록')
							.addFields(
								{ name: '명령어 사용자', value: `<@${interaction.user.id}>`},
								{ name: '대상', value: rName },
								{ name: '이전 랭크', value: bRank },
								{ name: '이후 랭크', value: aRank }
							)
							.setFooter({text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
		
						logChannel.send({ embeds: [log] });
		
						const Embed = new EmbedBuilder()
							.setTitle('완료')
							.setColor(0x00FF00)
							.setDescription('성공적으로 유저를 강등했습니다.')
							.addFields(
								{ name: '이전 랭크', value: bRank },
								{ name: '이후 랭크', value: aRank }
							)
		
						interaction.editReply({ embeds: [Embed] });
		
					} catch(err) {
		
						const Embed = new EmbedBuilder()
							.setTitle("오류")
							.setColor(0xFF0000)
							.setDescription(err.message)
					
						interaction.editReply({ embeds : [Embed] })
						console.error(err);
		
					}
		
					
					},
	};

client.login(token);