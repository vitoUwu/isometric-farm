let _instance: Logger;

export class Logger {
  public _debug = false;
  constructor() {
    if (_instance) {
      throw new Error("Logger is already instantiated");
    }

    this._debug = localStorage.getItem("debug") === "true";
  }

  static getInstance() {
    if (!_instance) {
      _instance = new Logger();
    }
    return _instance;
  }

  log(...messages: any[]) {
    if (this._debug) {
      console.log(
        "%c[LOG]",
        "background-color: blue; color: white; padding: 2px;font-weight: bold",
        ...messages,
      );
    }
  }

  error(...messages: any[]) {
    console.error(
      "%c[ERROR]",
      "background-color: red; color: white; padding: 2px;font-weight: bold",
      ...messages,
    );
    console.trace();
  }

  warn(...messages: any[]) {
    console.warn(
      "%c[WARN]",
      "background-color: orange; color: white; padding: 2px;font-weight: bold",
      ...messages,
    );
  }

  info(...messages: any[]) {
    if (this._debug) {
      console.info(
        "%c[INFO]",
        "background-color: green; color: white; padding: 2px;font-weight: bold",
        ...messages,
      );
    }
  }

  debug(...messages: any[]) {
    if (this._debug) {
      console.debug(
        "%c[DEBUG]",
        "background-color: purple; color: white; padding: 2px;font-weight: bold",
        ...messages,
      );
    }
  }

  time(label: string) {
    if (this._debug) {
      console.time(label);
    }
  }

  timeEnd(label: string) {
    if (this._debug) {
      console.timeEnd(label);
    }
  }
}

export default Logger.getInstance();
