import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

const KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex");

if (KEY.length !== 32) {
  throw new Error("ENCRYPTION_KEY deve possuir 32 bytes (64 caracteres em hexadecimal).");
}

export default class CryptoUtils {
  
  static encrypt(text){
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    const encrypted = Buffer.concat([
      cipher.update(text, "utf8"),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();
    return [
      iv.toString("hex"),
      authTag.toString("hex"),
      encrypted.toString("hex"),
    ].join(":");
  }

  static decrypt(payload){
    const [ivHex, authTagHex, encryptedHex] = payload.split(":");
    if (!ivHex || !authTagHex || !encryptedHex) {
      throw new Error("Payload inválido.");
    }
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);
    return decrypted.toString("utf8");
  }

}