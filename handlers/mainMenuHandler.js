const { Markup } = require("telegraf");
const { getSessionKey } = require("../firestoreInit");
const { replyText, replyHTML } = require("../utils/btnMenuHelpers");
const { clientBaseUrl } = require("../utils/urls");

const mainMenuHandler = async (ctx, next) => {
  if (ctx.startPayload) {
    return next();
  }
  const createLink = `${clientBaseUrl}/create?sessionKey=${getSessionKey(ctx)}`;
  const restoreLink = `${clientBaseUrl}/restore?sessionKey=${getSessionKey(
    ctx
  )}`;

  //If in a scene, leave it.
  // ctx.scene?.leave();
  //Manually leaving scenes because it might be called before the stage middleware
  ctx.session.__scenes = {};

  if (ctx.message?.text === "/start") {
    await replyText(ctx, "Welcome to the Endubis Wallet Bot 🛅", {
      ...Markup.keyboard([["🏠 Main Menu"]]).resize(),
      keepMessages: true,
    });
  }
  if (ctx.session.loggedInXpub) {
    if (ctx.message?.text === "/start") {
      await replyText(ctx, "👋 Welcome back to your wallet");
    }
    return replyHTML(
      ctx,
      `Please choose an option, <b><a href="tg://user?id=${ctx.session.userInfo?.id}">${ctx.session.userInfo?.first_name}</a></b>`,
      Markup.inlineKeyboard([
        [Markup.button.callback(" 👁️‍🗨️ View Balance", "wallet-balance")],
        [
          Markup.button.callback("📩 Receive", "receive"),
          Markup.button.callback("💸 Send", "send"),
        ],
        [Markup.button.callback("💳 Buy", "deposit")],
        [Markup.button.callback("🏧 Withdrawals", "withdraw")],
        [Markup.button.callback("📒 Transaction History", "view-transactions")],
        [Markup.button.callback(" ⚙️ Manage Account", "manage-account")],
        [Markup.button.callback("🚪 Logout", "log-out")],
      ])
    );
  } else {
    return replyHTML(
      ctx,
      `Please <b>CREATE</b> or <b>RESTORE</b> a wallet to get started`,
      Markup.inlineKeyboard([
        [Markup.button.url("🆕 Secure Create", createLink)],
        [Markup.button.url("🗝 Secure Restore", restoreLink)],
      ])
    );
  }
};

module.exports = { mainMenuHandler };
