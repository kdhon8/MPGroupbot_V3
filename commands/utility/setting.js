const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { ownerId } = require('../../config.json')

const configPath = path.join(__dirname, '..', '..', 'config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('설정')
    .setDescription('봇 기본 설정')
    .setContexts([0])
    .addSubcommand(subcommand =>
        subcommand
            .setName('채널')
            .setDescription('봇의 로그를 기록할 채널을 설정합니다.')
            .addChannelOption(Option => Option.setName('채널').setDescription('봇의 로그를 기록할 채널').setRequired(true))
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('역할')
            .setDescription('그룹 관리 역할을 설정합니다.')
            .addRoleOption(Option => Option.setName('역할').setDescription('그룹 관리자로 지정할 역할').setRequired(true))
    ),


    async execute(interaction) {
        const member = await interaction.guild.members.fetch(interaction.user.id);

        if (!member.permissions.has([PermissionsBitField.Flags.Administrator]) && interaction.user.id != ownerId) {
            const Embed = new EmbedBuilder()
                .setTitle('권한 부족')
                .setColor(0xFF0000)
                .setDescription('해당 명령어를 실행할 권한이 없습니다.')
            
            interaction.reply({ embeds: [Embed] });
            return;
        }
        
        await interaction.deferReply();

        const cmdName = interaction.options.getSubcommand();

        try {
            if (cmdName == "채널") {
                const openJson = fs.readFileSync(configPath, 'utf8');
                const jsonData = JSON.parse(openJson);
                const logChannel = interaction.options.getChannel('채널');
                const logChannelId = logChannel.id
        
                jsonData.logChannelID = logChannelId
                const saveData = JSON.stringify(jsonData);
                fs.writeFileSync(configPath, saveData);

                const Embed = new EmbedBuilder()
                    .setTitle('설정 완료')
                    .setColor(0x00FF00)
                    .setDescription(`로그 채널을 <#${logChannelId}>(으)로 설정했습니다.`)

                await interaction.editReply({ embeds: [Embed] })

            } else if (cmdName == "역할") {
                const openJson = fs.readFileSync(configPath, 'utf8');
                const jsonData = JSON.parse(openJson);
                const role = interaction.options.getRole('역할');
                const roleId = role.id
        
                jsonData.role = roleId;
                const saveData = JSON.stringify(jsonData);
                fs.writeFileSync(configPath, saveData);

                const Embed = new EmbedBuilder()
                    .setTitle('설정 완료')
                    .setColor(0x00FF00)
                    .setDescription(`그룹 관리자 역할을 <@&${roleId}>(으)로 설정했습니다.`)

                await interaction.editReply({ embeds: [Embed] });

            };

        } catch(err) {
            console.error('설정 명령어 실행중 오류');
            console.error(err);

            const Embed = new EmbedBuilder()
                .setTitle('오류')
                .setColor(0xFF0000)
                .setDescription(err.message)

            await interaction.editReply({ embeds: [Embed] })
        };


    },
};