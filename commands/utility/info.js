const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const noblox = require('noblox.js')
const { groupId, ROKAGroupID } = require('../../config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('정보')
		.setDescription('유저의 로블록스 계정 정보를 보여줍니다')
		.addStringOption(option =>
			option
				.setName('닉네임')
				.setDescription('정보를 조회할 유저의 닉네임을 입력하세요')
				.setRequired(true)),

		async execute(interaction) {
			const name = interaction.options.getString('닉네임')
			try {
				const userId = await noblox.getIdFromUsername(name);
				if (!userId) {
					const errEmbed = new EmbedBuilder()
						.setColor(0xdb4455)
						.setTitle("오류")
						.setDescription('해당 유저는 Roblox에 존재하지 않습니다.')
					
					interaction.reply({ embeds : [errEmbed] })
					return;
				}
				const rokaRank = await noblox.getRankNameInGroup(ROKAGroupID, userId);
				const Rname = await noblox.getUsernameFromId(userId);

				const userInfo = await noblox.getPlayerInfo(userId);
				const mpRank = await noblox.getRankNameInGroup(groupId, userId);
				const accountCreationDate = new Date(userInfo.joinDate);
				const currentDate = new Date();
				const daysSinceCreation = Math.floor((currentDate - accountCreationDate) / (1000 * 60 * 60 * 24) + 1);
				const formattedAccountCreationDate = accountCreationDate.toLocaleDateString();
				const avatarData = await noblox.getPlayerThumbnail(userId, "720x720", "png", true, "Headshot");
				const thumbnailUrl = avatarData.map(item => item.imageUrl)[0];
				const replyEmbed = new EmbedBuilder()

					.setColor(0x0072ce)
					.setTitle(`${Rname} (${userId}) 의 정보`)
					.setURL(`https://www.roblox.com/users/${userId}/profile`)
					.setThumbnail(thumbnailUrl)
					.addFields(
						{ name: '계급', value: rokaRank },
						{ name: '그룹 랭크', value: mpRank },
						{ name: '계정 생성일', value: `${formattedAccountCreationDate} (${daysSinceCreation}일 지남)`}
					)
				interaction.reply({ embeds : [replyEmbed] })
			  
			  } catch (error) {
				
					const errEmbed = new EmbedBuilder()
						.setColor(0xdb4455)
						.setTitle("오류")
						.setDescription(error.message)
					
					interaction.reply({ embeds : [errEmbed] })
					console.error(error);
			  }
		
		},
};