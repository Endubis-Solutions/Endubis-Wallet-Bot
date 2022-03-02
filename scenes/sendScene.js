const { Scenes, Composer, Markup } = require("telegraf");
const {
  mainMenuButton,
  replyMenuHTML,
  replyMenu,
} = require("../utils/btnMenuHelpers");
const { getWalletById } = require("../utils/loadAccount");

const step1 = async (ctx) => {
  const wallet = await getWalletById(ctx.session.loggedInWalletId);
  if (wallet.state.status !== "ready") {
    await ctx.deleteMessage();
    await ctx.reply(
      `Your wallet is syncing.
Please Wait for it to finish before trying to send...
        
Progress: ${wallet.state.progress.quantity} ${wallet.state.progress.unit}`,
      Markup.inlineKeyboard([
        [Markup.button.callback("Refresh", "send")],
        [mainMenuButton()],
      ])
    );
    return;
  }
  ctx.reply(
    "Please choose an option from the choices below",
    Markup.inlineKeyboard([
      [Markup.button.callback("Send to a Cardano address", "send-addr")],
      [Markup.button.callback("Send to a Telegram user", "send-tg-user")],
      [
        Markup.button.callback(
          "IN CONSTRUCTION: Send using a QR Code",
          "send-qr-code"
        ),
      ],
      [mainMenuButton()],
    ])
  );
  return ctx.wizard.next();
};

/* 
  Step 2
  - Ask for address
*/

const step2 = new Composer();
step2.action("send-addr", Scenes.Stage.enter("sendToAddressScene"));
step2.action("send-tg-user", Scenes.Stage.enter("sendToTelegramScene"));

const sendScene = new Scenes.WizardScene("sendScene", step1, step2);

module.exports = { sendScene };
