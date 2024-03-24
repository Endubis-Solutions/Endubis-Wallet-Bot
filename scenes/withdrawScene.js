const { Scenes, Composer, Markup } = require("telegraf");
const { replyMenuHTML } = require("../utils/btnMenuHelpers");
const { getADAtoETBRate, getADAtoKESRate } = require("../utils/currencyExchange");

const step1 = async (ctx) => {
  await replyMenuHTML(
    ctx,
    "Please select an option from the choices below",
    Markup.inlineKeyboard([
      [Markup.button.callback("🆃 Withdraw to Telebirr (Ethiopia)", "withdraw-telebirr")],
      [Markup.button.callback("ⓜ Withdraw to MPESA", "withdraw-mpesa")],
      [Markup.button.callback("↻ Pending Withdrawals", "pending-withdrawals")],
      [Markup.button.callback("✅ Complete Withdrawals", "complete-withdrawals")],
    ])
  );
  return ctx.wizard.next();
};

const step2 = new Composer();
step2.action("withdraw-telebirr", async (ctx) => {
  ctx.session.withdrawMethod = "telebirr";
  await replyMenuHTML(
    ctx,
    `Please enter the amount (in ETB or in ada) you want to withdraw.\n` +
      `<i>Examples of valid amounts: <b>50 ada</b>, <b>200 ETB</b> or <b>1000 birr</b></i>\n `
  );
  return ctx.wizard.next();
});

step2.action("withdraw-mpesa", async (ctx) => {
  ctx.session.withdrawMethod = "mpesa";
  await replyMenuHTML(
    ctx,
    `Please enter the amount (in KES or in ada) you want to withdraw.\n` +
      `<i>Examples of valid amounts: <b>50 ada</b>, <b>20000 KSH</b> or <b>10000 kes</b></i>\n `
  );
  return ctx.wizard.next();
});

const step3 = new Composer();
step3.hears(/^(\d+|\d*\.\d+)\s*(birr|ada|etb|kes|ksh)$/i, async (ctx) => {
  const amount = ctx.match[1];
  const currency = ctx.match[2].toLowerCase();
  switch (ctx.session.withdrawMethod) {
    case "mpesa":
      await replyMenuHTML(
        ctx,
        `<b>Withdrawal Summary</b>\n\n` +
          `<i>Amount to Withdraw from wallet (in ada): </i><b>${
            currency === "ada"
              ? amount
              : Math.ceil((amount / (await getADAtoKESRate())) * 100) / 100
          }</b>\n` +
          `<i>Receivable (in KES): </i><b>${
            currency === "ada"
              ? Math.ceil(amount * (await getADAtoKESRate()))
              : amount
          }</b>`,
        {
          ...Markup.inlineKeyboard([
            //TODO: Withdrawal to frontend
            [Markup.button.callback("Continue", "input-phone")],
          ]),
          menuText: "Cancel",
        }
      );
      //TODO: SEND WITHDRAWL REQUESTS TO DB/NOTIFY ADMIN
      break;
    default:
      await replyMenuHTML(
        ctx,
        `<b>Withdrawal Summary</b>\n\n` +
          `<i>Amount to Withdraw from wallet (in ada): </i><b>${
            currency === "ada"
              ? amount
              : Math.ceil((amount / (await getADAtoETBRate())) * 100) / 100
          }</b>\n` +
          `<i>Receivable (in ETB): </i><b>${
            currency === "ada"
              ? Math.ceil(amount * (await getADAtoETBRate()))
              : amount
          }</b>`,
        {
          ...Markup.inlineKeyboard([
            //TODO: Withdrawal to frontend
            [Markup.button.callback("Continue", "input-phone")],
          ]),
          menuText: "Cancel",
        }
      );
      //TODO: SEND WITHDRAWL REQUESTS TO DB/NOTIFY ADMIN

      break;
  }
  //TODO: Calculate and add ada fees
  return ctx.wizard.next();
});

step3.on("text", async (ctx) => {
  await replyMenuHTML(
    ctx,
    `Invalid entry. Please try again.\n` +
      `<i>Examples of valid amounts: <b>50 ada</b>, <b>200 ETB</b> or <b>1000 birr</b></i>`
  );
});

const step4 = new Composer();
step4.action("input-phone", async (ctx) => {
  ctx.session.withdrawMethod = "mpesa";
  
  await replyMenuHTML(
    ctx,
    `Please input phone number to withdraw to`
  );
  return ctx.wizard.next();
});

const step5 = new Composer();
step5.on("text", async (ctx) => {
  console.log(ctx.message?.text);

  // await replyMenuHTML(
  //   ctx,
  //   `Your withdrawl has been received and is processing...\n` + 
  //   `We will update you when the withdrawl is complete\n\n` +
  //     `<i>TXN-ID: ${Math.random().toString(16).slice(2)}\n</i>`
  // );
  await replyMenuHTML(ctx, `🚧 This feature is currently under development 🚧`);

  return ctx.wizard.next();
});

const withdrawScene = new Scenes.WizardScene(
  "withdrawScene",
  step1,
  step2,
  step3,
  step4,
  step5
);

module.exports = { withdrawScene };
