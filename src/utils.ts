import { platform } from "os";

export const getUserDataPath = () =>
  process.env.APPDATA ||
  (process.platform == "darwin"
    ? `${process.env.HOME}/Library/Preferences`
    : `${process.env.HOME}/.local/share")`);

export const getApplicationInstallLocation = () => {
  const { platform } = process;
  /*  if (platform === "darwin") {
    return `${process.env.HOME}/Applications`;
  } */
  return `${process.env.HOME}/Applications`;
};
