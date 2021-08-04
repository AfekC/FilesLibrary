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
              @update="loadPage()"
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
              @update="loadPage()"
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
          :loading="isLoading"
          hide-default-footer
          dense
        >
          <template #item="{ item }">
            <tr @click="rowClicked(item)">
              <td>
                <v-icon v-if="!item.isFile">mdi mdi-folder-outline</v-icon>
                <v-icon v-else>mdi mdi-file-outline</v-icon>
              </td>
              <td>{{ item.name }}</td>
              <td style="text-align:center">{{ getSize(item.size) }}</td>
              <td style="text-align:center; white-space: pre-wrap">{{ getDate(item.dateUploaded) }}</td>
              <td style="text-align:center">{{ item.creatorUsername }}</td>
              <td class="pa-0">
                <v-icon v-if="!item.isPublic">mdi mdi-lock</v-icon>
              </td>
              <td class="pa-0"><v-icon>mdi mdi-delete</v-icon></td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </v-row>
  </v-container>
</template>
<script>
import {mapActions, mapMutations, mapState} from "vuex";
import consts from "../consts";
import UploadFiles from "../components/UploadFiles.vue";
import CreateFolder from "../components/CreateFolder.vue";
import itemsAPI from "../API/itemsAPI.js";

export default {
  name: "Library",
  components: { UploadFiles, CreateFolder },
  data() {
    return {
      isLoading: true,
      uploadFilesDialog: false,
      createFolderDialog: false,
      fileToCreator: {},
      headers: [
        { align: "start", sortable: false, value: "type", width: "5%" },
        { text: "name", filterable: true, value: "name", width: "40%" },
        { align: "center", text: "size", sortable: false, value: "size", width: "13%" },
        { align: "center", sortable: false, text: "date modified", value: "date", width: "15%" },
        { align: "center", sortable: false, text: "last editor", value: "creator", width: "15%" },
        { align: "center", sortable: false, value: "isPublic", width: "4%" },
        { align: "center", sortable: false, value: "trash", width: "3%" },
      ],
      items: [],
      search: "",
    };
  },
  async mounted() {
    await this.loadPage();
    this.setCurrentPageName(consts.PagesConst.PagesNames.LIBRARY_PAGE);
  },
  computed: {
    ...mapState(['libraryDirPath', 'currDirId']),
    sortedItems() {
      return this.items.slice(0).sort((value) => {
        return value.isFile ? 1 : -1;
      });
    },
  },
  methods: {
    ...mapMutations(['setCurrentPageName']),
    ...mapActions(['enterFolder']),
    async loadPage() {
      this.isLoading = true;
      this.items = await itemsAPI.getFilesByCurrentFolderId(
          this.currDirId === -1 ? null : this.currDirId
      );
      this.isLoading = false;
    },
    getDate(dateUploaded) {
      const date = new Date(dateUploaded);
      return `${this.addZero(date.getHours())}:${this.addZero(date.getMinutes())}:${this.addZero(date.getSeconds())}    ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    },
    addZero(n) {
      return n < 10 ? '0' + n : n;
    },
    getSize(size) {
      if (!size) {
        return;
      }
      let s = size;
      const d = ['KB', 'MB', 'GB'];
      let index = 0;
      while (s > 1024) {
        index++;
        s = (s / 1024);
      }
      return Math.ceil(s) + d[index];
    },
    rowClicked(item) {
      if (!item.isFile) {
        this.enterFolder(item);
        setTimeout(this.loadPage, 250);
      }
    }
  },
};
</script>