import { createStore } from "vuex";

import dropbox from "./modules/dropbox/dropbox";

export default createStore({
  modules: { dropbox },
});
