import Contact from "../models/Contact";
import logger from "../utils/logger";

const fixExistingLidContacts = async () => {
  try {
    logger.info("🔧 Iniciando correção de contatos LID existentes...");

    // Buscar contatos que têm remoteJid com @lid mas lid é null
    const contactsToFix = await Contact.findAll({
      where: {
        remoteJid: {
          [require('sequelize').Op.like]: '%@lid%'
        },
        lid: null
      }
    });

    logger.info(`📊 Encontrados ${contactsToFix.length} contatos LID para corrigir`);

    for (const contact of contactsToFix) {
      try {
        // Extrair o LID do remoteJid
        const lidMatch = contact.remoteJid.match(/^(\d+)@lid/);
        if (lidMatch) {
          const lid = `${lidMatch[1]}@lid`;
          
          // Atualizar o contato com o LID correto
          await contact.update({ lid });
          
          logger.info(`✅ Contato ${contact.id} atualizado: lid=${lid}, remoteJid=${contact.remoteJid}`);
        } else {
          logger.warn(`⚠️ Não foi possível extrair LID do contato ${contact.id}: ${contact.remoteJid}`);
        }
      } catch (error) {
        logger.error(`❌ Erro ao atualizar contato ${contact.id}:`, error);
      }
    }

    logger.info("🎉 Correção de contatos LID concluída!");
  } catch (error) {
    logger.error("❌ Erro na correção de contatos LID:", error);
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  fixExistingLidContacts()
    .then(() => {
      logger.info("✅ Script executado com sucesso");
      process.exit(0);
    })
    .catch((error) => {
      logger.error("❌ Erro na execução do script:", error);
      process.exit(1);
    });
}

export default fixExistingLidContacts;
