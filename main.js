const { Client, Collection } = require('discord.js');
const client = (global.client = new Client({ fetchAllMembers: true }));
const { readdirSync } = require('fs');
require('./src/configs/settings.js')(client);
require('./src/handlers/functions.js')(client);
const { Token } = client.settings;

client.commands = new Collection();
client.cooldowns = new Collection();

require('./src/handlers/mongoHandler.js');
require('./src/handlers/eventHandler.js');

readdirSync('./src/commands').filter(async dir => {
  const commandFiles = readdirSync(`./src/commands/${dir}/`).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./src/commands/${dir}/${file}`);
    await client.commands.set(command.name, command);
    // console.log(`Komutlar - ${command.name} Yüklendi`);
  }
});

client.login(Token).then(() => console.log('Bot başarılı bir şekilde bağlandı')).catch(() => {
  console.log('Bot bağlantısında bir problem yaşandı');
  process.exit();
});