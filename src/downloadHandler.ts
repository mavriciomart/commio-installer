import fs from "fs";
import path from "path";
import axios from "axios";

interface DownloadFileCallbacks {
  onDownloadInitialize?: ({ totalLength }: { totalLength: number }) => void;
  onDownloadTick?: (progress: number) => void;
}

export const downloadFile = async (
  fileName: string,
  fileUrl: string,
  savePath: string,
  callbacks?: DownloadFileCallbacks
) => {
  let onDownloadInitialize: DownloadFileCallbacks["onDownloadInitialize"];
  let onDownloadTick: DownloadFileCallbacks["onDownloadTick"];

  if (callbacks) {
    onDownloadInitialize = callbacks.onDownloadInitialize;
    onDownloadTick = callbacks.onDownloadTick;
  }

  if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath);
  }

  const writer = fs.createWriteStream(path.resolve(savePath, fileName));

  const response = await axios({
    url: fileUrl,
    method: "GET",
    responseType: "stream",
  });

  const totalLength = response.headers["content-length"];
  response.data.pipe(writer);

  if (onDownloadInitialize) {
    onDownloadInitialize({ totalLength });
  }

  response.data.on("data", (chunk: { length: number }) => {
    if (onDownloadTick) {
      onDownloadTick(chunk.length);
    }
  });

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};
