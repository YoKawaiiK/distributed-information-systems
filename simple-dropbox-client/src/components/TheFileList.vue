<template>
  <div class="filelist">
    <div v-if="getFileList.length > 0">
      <div class="filelist__list_header">
        <div class="list_header__item">Title</div>
        <div class="list_header__item">File size</div>
        <div class="list_header__item">Action</div>
      </div>

      <div class="filelist__list">
        <!-- <table class="iksweb">
          <thead>
            <tr>
              <th>Title</th>
              <th>File size</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="file in getFileList" :key="file.id">
              <td>
                {{ file.name }}
              </td>

              <td v-if="file['.tag'] == 'file'" @click.stop="onOpenFile(file)">
                {{ (file.size / 1000000).toFixed(3) }} Mb
              </td>
              <td
                v-else-if="file['.tag'] == 'folder'"
                @click="onOpenFolder(file)"
              >
                <img
                  class="file__img_icon img_icon"
                  src="@/assets/images/file.png"
                  alt="file"
                />
              </td>
              <td
                class="file__item file__item_button"
                @click.stop="onDeleteFile(file)"
              >
                <span
                  class="file__item file__item_button"
                  @click.stop="onDeleteFile(file)"
                >
                  Delete
                </span>

                <span
                  v-if="file['.tag'] == 'file'"
                  @click="onDownloadFile(file)"
                >
                  Download
                </span>
              </td>
            </tr>
          </tbody>
        </table> -->

        <div class="filelist__list">
          <div v-for="file in getFileList" :key="file.id">
            <div
              v-if="file['.tag'] == 'file'"
              @click="onDownloadFile(file)"
              class="list__file"
            >
              <div class="file__item" @click.stop="onOpenFile(file)">
                {{ file.name }}
              </div>
              <div class="file__item">
                {{ (file.size / 1000000).toFixed(3) }} Mb
              </div>
              <span
                class="file__item file__item_button"
                @click.stop="onDeleteFile(file)"
              >
                Delete
              </span>
            </div>
            <div
              class="list__file"
              v-else-if="file['.tag'] == 'folder'"
              @click.stop="onOpenFolder(file)"
            >
              <div class="file__item">
                {{ file.name }}
              </div>
              <div class="file__item">-</div>
              <span
                class="file__item file__item_button"
                @click.stop="onDeleteFile(file)"
              >
                Delete
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="empty">
      <div>Data store is empty</div>
    </div>
  </div>
</template>

<script>
import {
  DROPBOX,
  GET_FILE_LIST,
  LOAD_FILE_LIST,
  DELETE_FILE,
  SET_PATH_FOLDER,
  OPEN_FILE,
  DOWNLOAD_FILE,
} from "@/store/modules/dropbox/constants";

import { mapGetters, mapActions, mapMutations } from "vuex";

import { CREATE_FILE_VIEW } from "@/router/constants";

export default {
  name: "TheFileList",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(DROPBOX, {
      getFileList: GET_FILE_LIST,
      // getCurrentPath: GET_CURRENT_PATH,
    }),
  },
  methods: {
    ...mapActions(DROPBOX, [
      LOAD_FILE_LIST,
      DELETE_FILE,
      OPEN_FILE,
      DOWNLOAD_FILE,
    ]),
    ...mapMutations(DROPBOX, [SET_PATH_FOLDER]),
    onDeleteFile(file) {
      this[DELETE_FILE](file);
    },
    async onDownloadFile(file) {
      try {
        console.log("onDownloadFile");
        await this[DOWNLOAD_FILE](file);
      } catch (error) {
        console.log(error);
        alert("Error downloading");
      }
    },
    async onOpenFile(file) {
      try {
        console.log("onOpenFile");
        const isDownloaded = await this[OPEN_FILE](file);
        if (isDownloaded) {
          this.$router.push({ name: CREATE_FILE_VIEW });
        } else {
          throw Error;
        }
      } catch (error) {
        alert("Error donloading");
      }
    },
    onOpenFolder(file) {
      console.log("onOpenFolder");
      this[SET_PATH_FOLDER]({ file: file });
      this[LOAD_FILE_LIST]();
    },
  },
  mounted() {
    this[LOAD_FILE_LIST]();
  },
};
</script>

<style lang="scss" scoped>
/* Стили таблицы (IKSWEB) */
table.iksweb {
  text-decoration: none;
  border-collapse: collapse;
  width: 100%;
  text-align: center;
}
table.iksweb th {
  color: $--color-primary;
  font-weight: normal;
  font-size: 1.1rem;
  font-weight: 700;
  // color: #ffffff;
  // background-color: #354251;
}
table.iksweb td {
  font-size: 13px;
  color: #354251;
}

td {
  cursor: default;
  &.file__item_button {
    cursor: pointer;
    transition: 200ms ease-in;
    color: $--color-primary;
    &:hover {
      color: $--color-secondary;
    }
  }
}

table.iksweb td,
table.iksweb th {
  white-space: pre-wrap;
  padding: 10px 5px;
  line-height: 13px;
  vertical-align: middle;
  border: 1px solid #ffffff;
}
table.iksweb tr:hover {
  background-color: #f9fafb;
}
table.iksweb tr:hover td {
  color: #354251;
}

//

.img_icon {
  height: 24px;
}

.filelist {
  width: 100%;
  height: 100%;
  min-width: 300px;
  padding: 20px;

  .empty {
    color: $--color-primary;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    font-size: 1.2rem;
  }

  .filelist__list_header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 20px;
    padding: 10px;
    font-weight: 700;
    .list_header__item {
      color: $--color-primary;
    }
  }

  .filelist__list {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .list__file {
      cursor: pointer;
      display: flex;
      justify-content: space-between;

      // border: 2px solid $--color-primary;
      border-radius: 10px;
      gap: 20px;

      padding: 10px;
      font-weight: 700;

      transition: 200ms ease-in;

      color: $--color-primary;
      &:hover {
        border-color: $--color-hover;
        color: $--color-hover;
      }

      .file__item {
        .file__img_icon {
          height: 24px;
        }

        &.file__item_button {
          transition: 200ms ease-in;

          &:hover {
            color: $--color-secondary;
          }
        }
      }
    }
  }
}
</style>
