const bot = require("../botSession");
const logger = require("../utils/loggerSession");

const deleteMessage = async (res) => {
  try {
    await bot.telegram.deleteMessage(res.chat.id, res.message_id);
  } catch (error) {
    logger.Error("Error deleting\n", "deleteMessageHandler", null, error);
  }
};

const deletePastMessagesHandler = async (ctx, next) => {
  if (ctx.updateType === "inline_query") {
    return next();
  }
  try {
    const toDelete = ctx.session?.messageIdsToDelete || [];
    if (ctx.callbackQuery) {
      const message_id = ctx.callbackQuery.message.message_id;
      !toDelete.includes(message_id) && toDelete.push(message_id);
    }
    if (ctx.message) {
      const message_id = ctx.message.message_id;
      !toDelete.includes(message_id) && toDelete.push(message_id);
    }
    if (Array.isArray(toDelete)) {
      for (let [key, messageId] of Object.entries(toDelete)) {
        try {
          await ctx.deleteMessage(messageId);
        } catch (e) {
          logger.Error("Error deleting\n", "deletePastMessageHandler", null, e);
        }
        toDelete.splice(key, 1);
      }
      if (ctx.session) {
        ctx.session.messageIdsToDelete = toDelete;
      }
    }
    if (next) {
      return next();
    }
    return;
  } catch (e) {
    logger.Error("Error deleting\n", "deletePastMessageHandler", null, e);
    if (next) {
      return next();
    }
  }
};

module.exports = {
  deleteMessage,
  deletePastMessagesHandler,
};
