/* eslint-disable camelcase */
export default () => {
  let DECODED_PRIVATE_KEY = process.env.PRIVATE_KEY;

  if (process.env.IS_NOW === "true") {
    DECODED_PRIVATE_KEY = Buffer.from(process.env.PRIVATE_KEY, "base64").toString();

    DECODED_PRIVATE_KEY = DECODED_PRIVATE_KEY.split("\\n");
    DECODED_PRIVATE_KEY.pop();
    DECODED_PRIVATE_KEY = DECODED_PRIVATE_KEY.join("\n");
  }

  const serviceAccount = {
    type: "service_account",
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: DECODED_PRIVATE_KEY,
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.CLIENT_CERT_URL
  };

  return serviceAccount;
};
