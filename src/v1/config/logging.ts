import chalk from "chalk";

/**
 * Custom logger utility with colored console output
 */
export default class Logging {
  private static formatTimestamp(): string {
    return new Date().toISOString();
  }

  private static formatMessage(arg: unknown): string {
    if (typeof arg === "string") {
      return arg;
    }

    if (arg instanceof Error) {
      return `${arg.message}\n${arg.stack || ""}`;
    }

    try {
      return JSON.stringify(arg, null, 2);
    } catch {
      return String(arg);
    }
  }

  public static log = (arg: unknown): void => {
    this.info(arg);
  };

  public static info = (arg: unknown): void => {
    const timestamp = chalk.blue(`[${this.formatTimestamp()}] [INFO]`);
    const message = typeof arg === "string" ? chalk.blueBright(arg) : arg;
    console.log(timestamp, message);
  };

  public static warn = (arg: unknown): void => {
    const timestamp = chalk.yellow(`[${this.formatTimestamp()}] [WARN]`);
    const message = typeof arg === "string" ? chalk.yellowBright(arg) : arg;
    console.warn(timestamp, message);
  };

  public static error = (arg: unknown): void => {
    const timestamp = chalk.red(`[${this.formatTimestamp()}] [ERROR]`);
    const message =
      typeof arg === "string" ? chalk.redBright(arg) : this.formatMessage(arg);
    console.error(timestamp, message);
  };

  public static success = (arg: unknown): void => {
    const timestamp = chalk.green(`[${this.formatTimestamp()}] [SUCCESS]`);
    const message = typeof arg === "string" ? chalk.greenBright(arg) : arg;
    console.log(timestamp, message);
  };

  public static debug = (arg: unknown): void => {
    if (process.env.NODE_ENV === "development") {
      const timestamp = chalk.magenta(`[${this.formatTimestamp()}] [DEBUG]`);
      const message = typeof arg === "string" ? chalk.magentaBright(arg) : arg;
      console.log(timestamp, message);
    }
  };
}
