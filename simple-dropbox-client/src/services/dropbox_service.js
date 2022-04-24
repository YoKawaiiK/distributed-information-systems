import { Dropbox } from "dropbox";

export default class DropboxService {
  static _dropbox = new Dropbox({
    accessToken: process.env.VUE_APP_ACCESS_TOKEN,
  });

  static test() {
    this._dropbox
      .filesListFolder({ path: "" })
      .then(function (response) {
        console.log(response.result.entries);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  static async uploadFile(file, path = "/", mode = "add") {
    console.log(file);
    try {
      const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;
      if (file.size < UPLOAD_FILE_SIZE_LIMIT) {
        // File is smaller than 150 Mb - use filesUpload API
        let result = await this._dropbox.filesUpload({
          // path: "/" + path + file.name,
          path: path,
          // mode: "overwrite",
          mode: mode,
          contents: file,
        });
        // console.log("result, less 150 mb", result.result);
        return result.result;
      } else {
        // File is bigger than 150 Mb - use filesUploadSession* API
        const maxBlob = 8 * 1000 * 1000; // 8Mb - Dropbox JavaScript API suggested max file / chunk size
        var workItems = [];
        var offset = 0;
        while (offset < file.size) {
          let chunkSize = Math.min(maxBlob, file.size - offset);
          workItems.push(file.slice(offset, offset + chunkSize));
          offset += chunkSize;
        }

        workItems.reduce((acc, blob, idx, items) => {
          if (idx == 0) {
            // Starting multipart upload of file
            let uploadResult = acc.then(async function () {
              let uploadPartResult =
                await this._dropbox.filesUploadSessionStart({
                  close: false,
                  contents: blob,
                });
              return uploadPartResult.session_id;
            });

            return uploadResult;
          } else if (idx < items.length - 1) {
            // Append part to the upload session
            return acc.then(async function (sessionId) {
              var cursor = { session_id: sessionId, offset: idx * maxBlob };

              await this._dropbox.filesUploadSessionAppendV2({
                cursor: cursor,
                close: false,
                contents: blob,
              });
              return sessionId;
            });
          } else {
            // Last chunk of data, close session
            let uploadResult = acc.then(async function (sessionId) {
              var cursor = {
                session_id: sessionId,
                offset: file.size - blob.size,
              };
              var commit = {
                path: "/" + file.name,
                mode: "add",
                autorename: true,
                mute: false,
              };
              let sessionFinish = await this._dropbox.filesUploadSessionFinish({
                cursor: cursor,
                commit: commit,
                contents: blob,
              });

              return sessionFinish;
            });

            return uploadResult;
          }
        });
      }
      return false;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async loadFileList(path) {
    try {
      let result = await this._dropbox.filesListFolder({ path: path });
      return result.result.entries;
    } catch (error) {
      return null;
    }
  }

  static async filesGetMetadata(path) {
    try {
      let result = await this._dropbox.filesGetMetadata({ path: path });
      return result.result;
    } catch (error) {
      console.error("filesGetMetadata: ", error);
      return null;
    }
  }

  static async deleteFile(file) {
    try {
      let result = await this._dropbox.filesDeleteV2({ path: file.path_lower });
      return result;
    } catch (error) {
      console.error("deleteFile error", error);
      return error;
    }
  }

  static async downloadFile(path) {
    try {
      const file = await this._dropbox.filesDownload({ path: path });
      return file.result;
    } catch (error) {
      console.error("static async downloadFile: ", error);
      throw error;
    }
  }
}
