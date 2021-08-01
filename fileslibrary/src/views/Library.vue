<template>
  <v-container style="padding-top: 6vh">
    <v-row>
      <v-card width="100%" height="8vh">
        <v-row>
          <v-col cols="7" class="ma-0 pt-2 pl-10 mr-10">
            <v-card-title>
              <v-text-field
                v-model="search"
                dense
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
          </v-col>
          <v-col cols="2">
            <v-btn
              color="blue-grey"
              class="ma-2 white--text"
              width="100%"
              @click.stop="createFolderDialog = true"
            >
              new folder
              <v-icon right dark> mdi-cloud-upload </v-icon>
            </v-btn>
            <CreateFolder
              v-if="createFolderDialog"
              :dialog.sync="createFolderDialog"
            />
          </v-col>
          <v-col cols="2">
            <v-btn
              color="blue-grey"
              class="ma-2 white--text"
              width="100%"
              @click.stop="uploadFilesDialog = true"
            >
              Upload Files
              <v-icon right dark> mdi-cloud-upload </v-icon>
            </v-btn>
            <UploadFiles
              v-if="uploadFilesDialog"
              :dialog.sync="uploadFilesDialog"
            />
          </v-col>
        </v-row>
      </v-card>
    </v-row>
    <v-row class="pt-5">
      <v-card width="100%">
        <v-data-table
          height="75vh"
          :headers="headers"
          :items="items"
          :search="search"
          :items-per-page="999"
          hide-default-footer
          dense
        ></v-data-table>
      </v-card>
    </v-row>
  </v-container>
</template>
<script>
import { mapMutations } from "vuex";
import consts from "../consts";
import UploadFiles from "../components/UploadFiles.vue";
import CreateFolder from "../components/CreateFolder.vue";
import { getFilesByPath } from "../API/itemsAPI.js"

export default {
  name: "Library",
  components: { UploadFiles, CreateFolder },
  data() {
    return {
      uploadFilesDialog: false,
      createFolderDialog: false,
      headers: [
        { align: "start", sortable: false, value: "icon" },
        { text: "is public", sortable: false, value: "is_public" },
        { text: "name", filterable: true, value: "name" },
        { sortable: false, value: "info" },
      ],
      items: [],
      search: "",
    };
  },
  async mounted() {
    this.items = await getFilesByPath(this.libraryDirPath);
    console.log(this.items);
    this.setCurrentPageName(consts.PagesConst.PagesNames.LIBRARY_PAGE);
  },
  computed: {
    ...mapState(['libraryDirPath']),
  },
  methods: {
    ...mapMutations(["setCurrentPageName"]),
  },
};
</script>