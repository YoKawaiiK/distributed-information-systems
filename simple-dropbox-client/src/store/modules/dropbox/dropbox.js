/* eslint-disable no-unused-vars */
import DropboxService from "@/services/dropbox_service.js";

import { blobWriteToFile, blobWriteToText } from "@/utils/index.js";
import { CurrentFile } from "../../../models/current_file";

import {
  GET_FILE_LIST,
  REMOVE_FILE,
  ADD_FILE,
  ADD_FILE_LIST,
  UPLOAD_FILE,
  LOAD_FILE_LIST,
  DELETE_FILE,
  SET_PATH_FOLDER,
  GET_CURRENT_PATH,
  OPEN_FILE,
  SET_CURRENT_FILE,
  GET_CURRENT_FILE,
  DOWNLOAD_FILE,
  OVERRIDE_FILE,
} from "./constants";

export default {
  namespaced: true,
  state: {
    currentFile: new CurrentFile(),
    // currentFolder: null,
    currentFolder: [],
    fileList: null,
  },
  getters: {
    [GET_FILE_LIST](state) {
      return state.fileList ?? [];
    },
    // [GET_CURRENT_PATH](state) {
    //   return state.currentFolder == null ? "" : state.currentFolder;
    // },
    [GET_CURRENT_PATH](state) {
      return state.currentFolder == [] ? "" : state.currentFolder.join("/");
    },
    [GET_CURRENT_FILE](state) {
      return state.currentFile;
    },
  },
  mutations: {
    [REMOVE_FILE](state, file) {
      const removeIndex = state.fileList.findIndex(
        (item) => item.id == file.id
      );

      if (removeIndex > -1) {
        state.fileList.splice(removeIndex, 1);
      }
    },
    [ADD_FILE](state, newFile) {
      if (state.fileList === null) state.fileList = [];

      state.fileList.push(newFile);
    },
    // [SET_PATH_FOLDER](state, path) {
    //   state.currentFolder = path.path_lower ?? "";
    // },
    [SET_PATH_FOLDER](state, { file, back }) {
      // console.log(data.file);
      if (back) {
        state.currentFolder.pop();
      } else {
        state.currentFolder.push(file.path_lower);
      }
    },

    [ADD_FILE_LIST](state, newFileList) {
      state.fileList = newFileList;
    },
    [SET_CURRENT_FILE](state, file = new CurrentFile()) {
      state.currentFile = file;
    },
  },
  actions: {
    async [UPLOAD_FILE]({ commit, getters }, file) {
      console.log("UPLOAD_FILE");

      let path = getters[GET_CURRENT_PATH] + "/" + file.name;

      const uploadedFileResult = await DropboxService.uploadFile(file, path);
      console.log("uploadedFileResult: ", uploadedFileResult);
      const uploadedFile = await DropboxService.filesGetMetadata(
        uploadedFileResult.path_lower
      );
      console.log("uploadedFile: ", uploadedFile);

      await commit(ADD_FILE, uploadedFile);
    },
    async [LOAD_FILE_LIST]({ commit, getters }) {
      let fileList = await DropboxService.loadFileList(
        getters[GET_CURRENT_PATH]
      );

      commit(ADD_FILE_LIST, fileList);
    },
    async [DELETE_FILE]({ commit }, file) {
      let deletedResult = await DropboxService.deleteFile(file);

      if (deletedResult.status === 200) {
        commit(REMOVE_FILE, file);
      }
    },
    async [DOWNLOAD_FILE]({ commit }, fileMeta) {
      const file = await DropboxService.downloadFile(fileMeta.path_lower);

      const blob = file.fileBlob;

      await blobWriteToFile(blob, file.name);
    },
    async [OVERRIDE_FILE]({ commit, getters }, updatedFile) {
      console.log("OVERRIDE_FILE");

      let path = getters[GET_CURRENT_PATH] + "/" + updatedFile.name;

      const uploadedFile = await DropboxService.uploadFile(
        updatedFile,
        path,
        "overwrite"
      );
      await commit(ADD_FILE, uploadedFile);
    },
    async [OPEN_FILE]({ commit }, fileMeta) {
      const file = await DropboxService.downloadFile(fileMeta.path_lower);

      const content = await blobWriteToText(file.fileBlob);

      const downloadedFileObject = new CurrentFile(
        true,
        file.name.replace(".txt", ""),
        content,
        fileMeta.path_lower
      );

      commit(SET_CURRENT_FILE, downloadedFileObject);
      return true;
    },
  },
};
