<template>
  <div class="the_simple_editor">
    <section class="the_simple_editor__panel">
      <div class="panel__item">
        <input
          v-model="currentFile.fileName"
          class="item__text"
          type="text"
          :disabled="this.currentFile.isEdit == true"
        />
      </div>
      <div class="panel__item">
        <span class="item__button" @click="onCreateFile">Save to file</span>
      </div>
    </section>
    <textarea
      v-model="currentFile.content"
      rows="10"
      class="the_simple_editor__editor"
    ></textarea>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import {
  DROPBOX,
  UPLOAD_FILE,
  SET_CURRENT_FILE,
  GET_CURRENT_FILE,
  OVERRIDE_FILE,
} from "@/store/modules/dropbox/constants";

// import { mapGetters, mapActions, mapMutations } from "vuex";

// import { HOME_VIEW } from "@/router/constants";
import { makeTextFile } from "@/utils/index";

export default {
  name: "TheSimpleEditor",
  data() {
    return {
      currentFile: null,
    };
  },
  computed: {
    ...mapGetters(DROPBOX, { getCurrentFile: GET_CURRENT_FILE }),
  },
  methods: {
    ...mapActions(DROPBOX, [UPLOAD_FILE, OVERRIDE_FILE]),
    ...mapMutations(DROPBOX, [SET_CURRENT_FILE]),
    async onCreateFile() {
      try {
        console.log("onCreateFile");

        if (this.currentFile.isEdit == true) {
          const file = makeTextFile(
            this.currentFile.content ?? "",
            this.currentFile.fileName
          );

          await this[OVERRIDE_FILE](file);
        } else {
          const file = makeTextFile(
            this.currentFile.content ?? "",
            this.currentFile.fileName
          );

          await this[UPLOAD_FILE](file);
        }
        this[SET_CURRENT_FILE]();
        this.$router.back();
      } catch (error) {
        console.log(error);
        alert("File with this name already exists.");
      }
    },
  },
  created() {
    this.currentFile = this[GET_CURRENT_FILE];
  },
};
</script>

<style lang="scss" scoped>
.the_simple_editor {
  width: 100%;
  display: flex;
  flex-direction: column;

  gap: 20px;

  .the_simple_editor__panel {
    display: flex;
    align-items: center;
    // justify-content: baseline;
    gap: 20px;

    .panel__item {
      // height: 40px;

      .item__text {
        padding: 5px 10px;
        height: 40px;
        // box-sizing: border-box;
        color: $--color-primary;
        border: 2px solid $--color-primary;
        border-radius: 5px;

        font-weight: 700;

        outline: none;
      }

      .item__button {
        padding: 5px 10px;
        height: 40px;
        cursor: pointer;
        color: $--color-primary;
        border: 2px solid $--color-primary;
        border-radius: 5px;

        // font-weight: 700;

        &:hover {
          color: $--color-hover;
          border-color: $--color-hover;
        }
        &:active {
          color: $--color-primary;
          border-color: $--color-primary;
        }
      }
    }
  }

  .the_simple_editor__editor {
    // min-width: 700px;
    width: 100%;
    height: 100%;
    padding: 12px 20px;
    box-sizing: border-box;
    border: 2px solid #ccc;
    border-radius: 4px;
    background-color: #f8f8f8;
    font-size: 16px;
    resize: none;
    // resize: vertical;
  }
}
</style>
