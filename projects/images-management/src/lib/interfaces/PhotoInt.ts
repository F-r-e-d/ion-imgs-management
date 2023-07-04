import { StatResult } from "@capacitor/filesystem";

export interface PhotoInt {
  filepath: string;
  webviewPath: string;
  fileName: string;
  fileInfo: StatResult
}
