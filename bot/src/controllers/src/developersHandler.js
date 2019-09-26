import { firebase } from "../../utils";

export const developersHandler = async (ctx) => {
  let messageText = await firebase
    .database()
    .ref("developersText")
    .once("value");

  messageText = messageText.val();

  if (!messageText) {
    messageText = "<b>Channel of the project:</b> @iutimetable\n\n";
    messageText += "<b>Android Developer:</b>\n";
    messageText += "Kholmatov Siyavushkhon\n";
    messageText += "Group: ICE-17-1\n";
    messageText += "@KholmatovS\n";
    messageText += "s.kholmatov@student.inha.uz\n\n";
    messageText += "<b>Back-End Developer:</b>\n";
    messageText += "Davronbekov Otabek\n";
    messageText += "Group: ICE-17-1\n";
    messageText += "@Davronbekov\n";
    messageText += "o.davronbekov@student.inha.uz\n\n";
    messageText += "<b>Full JS Stack Developer:</b>\n";
    messageText += "Rakhimov Javokhir\n";
    messageText += "Group: CIE-18-14\n";
    messageText += "@Rakhimov_J\n";
    messageText += "j.rakhimov@student.inha.uz\n\n";
    messageText += '<b>Try out the</b> <a href="https://iutimetable.netlify.com">web version</a> <b>of our application</b>';
  }

  ctx.replyWithHTML(messageText);
};
