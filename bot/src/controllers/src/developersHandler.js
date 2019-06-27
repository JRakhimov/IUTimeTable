import { firebase } from "../../utils";

export const developersHandler = async (ctx) => {
  let messageText = await firebase
    .database()
    .ref("developersText")
    .once("value");

  messageText = messageText.val();

  if (!messageText) {
    messageText = "<b>Android Developer:</b>\n";
    messageText += "Kholmatov Siyavushkhon\n";
    messageText += "Group: CSE-17-7\n";
    messageText += "@KholmatovS\n";
    messageText += "s.kholmatov@student.inha.uz\n\n";
    messageText += "<b>Back-End Developer:</b>\n";
    messageText += "Davronbekov Otabek\n";
    messageText += "Group: CSE-17-5\n";
    messageText += "@Davronbekov\n";
    messageText += "o.davronbekov@student.inha.uz\n\n";
    messageText += "<b>TelegramBot Developer:</b>\n";
    messageText += "Rakhimov Javokhir\n";
    messageText += "Group: CIE-18-20\n";
    messageText += "@Rakhimov_J\n";
    messageText += "j.rakhimov@student.inha.uz\n\n";
    messageText += "<b>Helpers:</b>\n";
    messageText += "Mamadulloev Khamidullo\n";
    messageText += "Group: ICE-17-1\n";
    messageText += "@MartianB\n";
    messageText += "k.mamadulloev@student.inha.uz\n\n";
    messageText += "Rakhimov Ilkhom\n";
    messageText += "Group: CSE-16-4\n";
    messageText += "@ilkhom98\n";
    messageText += "i.rakhimov2@student.inha.uz";
  }

  ctx.replyWithHTML(messageText);
};
