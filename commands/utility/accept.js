const { SlashCommandBuilder, EmbedBuilder, Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const noblox = require('noblox.js')
const { groupId, role, logChannelID, token, ownerId } = require('../../config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('그룹승인')
		.setDescription('유저의 그룹가입 요청을 수락합니다')
		.setContexts([0])
		.addStringOption(option =>
			option
				.setName('닉네임')
				.setDescription('그룹요청을 수락할 유저의 닉네임을 입력하세요')
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

				const isRequest = await noblox.getJoinRequest(groupId, userId);

				if (!isRequest) {
					const Embed = new EmbedBuilder()
						.setTitle('오류')
						.setColor(0xFF0000)
						.setDescription(`그룹 요청이 존재하지 않습니다.`)
					
					interaction.editReply({ embeds: [Embed] });
					return;
				}

				const rName = await noblox.getUsernameFromId(userId);

				await noblox.handleJoinRequest(groupId,userId,true);
				
				const log = new EmbedBuilder()
					.setTitle('그룹승인 기록')
					.addFields(
						{ name: '명령어 사용자', value: `<@${interaction.user.id}>`},
						{ name: '대상', value: rName }
					)
					.setFooter({text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})

				logChannel.send({ embeds: [log] });

				const Embed = new EmbedBuilder()
					.setTitle('완료')
					.setColor(0x00FF00)
					.setDescription('성공적으로 그룹 요청을 수락했습니다.')

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

client.login(token)