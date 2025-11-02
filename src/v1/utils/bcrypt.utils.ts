import bcrypt from "bcryptjs";

async function hashValue(value: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(value, salt);
}

async function compareHashedValue(
  value: string,
  hashedValue: string
): Promise<boolean> {
  return bcrypt.compare(value, hashedValue);
}

export { hashValue, compareHashedValue };
