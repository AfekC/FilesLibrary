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
          :items="sortedItems"
          :search="search"
          :items-per-page="999"
          hide-default-footer
          dense
        >
          <template #item="{ item }">
            <tr>
              <td>
                <v-icon v-if="!item.isFile">mdi mdi-folder-outline</v-icon>
              </td>
              <td>{{ item.name }}</td>
              <td>{{ item.size }}</td>
              <td>{{ item.dateUploaded }}</td>
              <td class="pa-0">
                <v-icon v-if="!item.isPublic">mdi mdi-lock</v-icon>
              </td>
              <td class="pa-0"><v-icon>mdi mdi-information-outline</v-icon></td>
              <td class="pa-0"><v-icon>mdi mdi-delete</v-icon></td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </v-row>
  </v-container>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import consts from "../consts";
import UploadFiles from "../components/UploadFiles.vue";
import CreateFolder from "../components/CreateFolder.vue";
import itemsAPI from "../API/itemsAPI.js";

export default {
  name: "Library",
  components: { UploadFiles, CreateFolder },
  data() {
    return {
      uploadFilesDialog: false,
      createFolderDialog: false,
      headers: [
        { align: "start", sortable: false, value: "type", width: "8%" },
        { text: "name", filterable: true, value: "name", width: "80%" },
        { text: "size", sortable: false, value: "size", width: "5%" },
        { text: "date modified", value: "date", width: "5%" },
        { sortable: false, value: "isPublic", width: "2%" },
        { sortable: false, value: "trash", width: "2%" },
      ],
      items: [],
      search: "",
    };
  },
  async mounted() {
    this.items = await itemsAPI.getFilesByPath(
      this.currDirId === -1 ? null : this.currDirId
    );
    console.log(this.items);
    this.setCurrentPageName(consts.PagesConst.PagesNames.LIBRARY_PAGE);
  },
  computed: {
    ...mapState(["libraryDirPath", "currDirId"]),
    sortedItems() {
      return this.items.slice(0).sort((value) => {
        return value ? -1 : 1;
      });
    },
  },
  methods: {
    ...mapMutations(["setCurrentPageName"]),
  },
};
</script>