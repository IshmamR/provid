/* eslint-disable no-console */
const logger = (
  log: any,
  type?: "info" | "warn" | "error" | "important" | "success"
) => {
  switch (type) {
    case "info":
      console.log(`\x1b[1m ${log} \x1b[0m`);
      break;

    case "warn":
      console.log(`\x1b[33m\x1b[1m ${log} \x1b[0m`);
      break;

    case "error":
      console.log(`\x1b[31m\x1b[1m ${log} \x1b[0m`);
      break;

    case "important":
      console.log(`\x1b[46m\x1b[31m\x1b[1m ${log} \x1b[0m `);
      break;

    case "success":
      console.log(`\x1b[32m\x1b[1m ${log} \x1b[0m`);
      break;

    default:
      console.log(log);
      break;
  }
  return;
};

export default logger;
