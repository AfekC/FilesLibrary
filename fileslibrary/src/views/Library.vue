<template>
  <v-container style="padding-top: 6vh">
    <v-row>
      <v-card width="100%" height="8vh">
        <v-row>
          <v-col cols="8" class="ma-0 pt-2 pl-10 mr-10">
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
          <v-col cols="3">
            <v-btn
              color="blue-grey"
              class="ma-2 white--text"
              width="100%"
              @click.stop="uploadFilesDialog = true"
            >
              Upload Files To Folder
              <v-icon right dark> mdi-cloud-upload </v-icon>
            </v-btn>
            <UploadFiles
              v-if="uploadFilesDialog"
              :dialog.sync="uploadFilesDialog"
              @upload="uploadFiles"
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
          :items="directories"
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
import { mapMutations, mapGetters } from "vuex";
import consts from "../consts";
import UploadFiles from "../components/UploadFiles.vue";

export default {
  name: "Library",
  components: { UploadFiles },
  data() {
    return {
      uploadFilesDialog: false,
      headers: [
        { align: "start", sortable: false, value: "icon" },
        { text: "is public", sortable: false, value: "is_public" },
        { text: "name", filterable: true, value: "name" },
        { sortable: false, value: "info" },
      ],
      directories: [],
      search: "",
    };
  },
  mounted() {
    this.setCurrentPageName(consts.PagesConst.PagesNames.LIBRARY_PAGE);
  },
  computed: {
    ...mapGetters(["isSignIn"]),
  },
  methods: {
    ...mapMutations(["setCurrentPageName"]),
  },
};
</script>