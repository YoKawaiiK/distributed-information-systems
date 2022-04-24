<template>
  <div class="wrapper__dropzone">
    <div class="dropzone__panel">
      <div class="panel__item">
        <span class="item" v-if="getCurrentPath != ''" @click="onBackFolder">
          Back
        </span>
        <span class="item item_create_file" @click="onCreateFile">
          Create file
        </span>

        <label for="pickFile" class="item item_file">
          <input @change="onPickFiles" type="file" id="pickFile" />
          Pick file
        </label>
      </div>
    </div>
    <div
      @dragenter.prevent="toggleActive"
      @dragleave.prevent="toggleActive"
      @dragover.prevent
      @drop.prevent="onDrop"
      :class="{
        'active-dropzone': active,
        'file-selected': isFileSelected,
      }"
      class="dropzone"
    >
      <the-file-list></the-file-list>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import TheFileList from "@/components/TheFileList.vue";

import {
  DROPBOX,
  UPLOAD_FILE,
  SET_PATH_FOLDER,
  GET_CURRENT_PATH,
  LOAD_FILE_LIST,
  SET_CURRENT_FILE,
} from "@/store/modules/dropbox/constants";

import { CREATE_FILE_VIEW } from "@/router/constants";

export default {
  name: "TheDropZone",

  data() {
    return {
      active: false,
      dropzoneFile: null,
    };
  },
  components: {
    TheFileList,
  },
  computed: {
    ...mapGetters(DROPBOX, {
      getCurrentPath: GET_CURRENT_PATH,
    }),
    isFileSelected() {
      return this.dropzoneFile != null;
    },
    fileName() {
      return (
        this.dropzoneFile.name.substr(0, 10) +
        (this.dropzoneFile.name.length > 9 ? "..." : "")
      );
    },
  },
  methods: {
    ...mapActions(DROPBOX, [UPLOAD_FILE, LOAD_FILE_LIST]),
    ...mapMutations(DROPBOX, [SET_PATH_FOLDER, SET_CURRENT_FILE]),

    onClearDropZone() {
      this.dropzoneFile = null;

      this.active = false;
    },

    async onDrop(e) {
      try {
        this.dropzoneFile = e.dataTransfer.files[0];

        this.active = false;
        await this[UPLOAD_FILE](this.dropzoneFile);
        this.onClearDropZone();
      } catch (error) {
        alert("Error loading file to dropbox cloud.");
      }
    },
    onPickFiles(e) {
      this.dropzoneFile = e.target.files[0];

      this[UPLOAD_FILE](this.dropzoneFile);
      this.active = false;
      this.dropzoneFile = null;
    },
    toggleActive() {
      this.active = !this.active;
    },
    async onBackFolder() {
      console.log("onBackFolder");
      this[SET_PATH_FOLDER]({ back: true });
      await this[LOAD_FILE_LIST]();
    },
    onCreateFile() {
      console.log("onCreateFile");
      this[SET_CURRENT_FILE]();
      this.$router.push({ name: CREATE_FILE_VIEW });
      // this[SET_PATH_FOLDER](file);
    },
  },
};
</script>

<style lang="scss" scoped>
.dropzone__panel {
  width: 100%;
  // background-color: $--color-bg;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 10px;

  .panel__item {
    display: flex;
    gap: 40px;
    .item {
      cursor: pointer;
      color: $--color-primary;
      font-weight: 700;

      &:hover {
        color: $--color-hover;
      }
      &:active {
        color: $--color-primary;
      }

      &.item_file {
        input {
          overflow: hidden;
          width: 0;
        }
      }
    }
  }
}

.wrapper__dropzone {
  width: 100%;
  display: flex;
  flex-direction: column;

  align-items: center;
  height: 100%;
}

.dropzone {
  width: 100%;

  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 16px;
  border: 4px dashed #b67fe2;
  background-color: #fff;
  transition: 0.3s ease all;
  color: gray;
  font-weight: 600;
  label {
    cursor: pointer;
    padding: 8px 12px;
    color: #fff;
    font-weight: 700;
    background-color: #b67fe2;
    transition: 0.3s ease all;
  }
  input {
    display: none;
  }
}

.active-dropzone {
  color: #fff;
  border-color: #fff;
  background-color: #b67fe2;
  label {
    background-color: #fff;
    color: #b67fe2;
  }
}

.file-selected {
  border-color: #60a582;

  label {
    background-color: #fff;
    border: 4px solid;
    border-color: #60a582;
    color: #60a582;
  }

  .dropzone__file {
    display: flex;
    align-items: center;
    > :not(:first-child) {
      margin-left: 20px;
    }

    .file__img_icon {
      height: 50px;
    }

    .file__button_delete {
      cursor: pointer;
      font-weight: 700;
      padding: 8px 12px;
      background-color: #fff;
      border: 4px solid #d87cc8;
      color: #d87cc8;
    }
  }
}
</style>
