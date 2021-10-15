<template>
  <v-container  style="padding-top: 6vh">
    <v-row>
      <v-card width="100%" height="7.5vh">
        <v-row>
          <v-col cols="6">
             <v-row>
                <v-icon @click="rollback()" class="ml-5 mt-6" style="height:3.5vh">mdi-arrow-up</v-icon>
                <p v-if="parentsDirs.length > 5" class="pt-7" style="font-size:18px">...</p>
                <v-icon v-if="parentsDirs.length > 5">mdi-chevron-right</v-icon>
                <v-breadcrumbs :items="breadcrumbs" class="pl-2 mt-2 ml-1" style="max-width: 50vw">
                  <template v-slot:divider>
                    <v-icon>mdi-chevron-right</v-icon>
                  </template>
                  <v-breadcrumbs-item
                      slot="item"
                      slot-scope="{ item }"
                      exact
                      @click="loadPrevFolder(item.id)"
                      class="pa-0"
                      style="font-size:16px">
                    {{ shortName(item.name) }}
                  </v-breadcrumbs-item>
                </v-breadcrumbs>
             </v-row>
          </v-col>
          <v-col cols="2" class="pa-0 pt-5 pl-3">
            <v-card-title class="pa-0">
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
          <v-col cols="4" class="mt-2">
            <v-btn
              color="blue-grey"
              class="white--text pa-0 mr-2"
              width="45%"
              @click.stop="createFolderDialog = true"
            >
              New folder
              <v-icon right dark> mdi-cloud-upload </v-icon>
            </v-btn>
            <CreateFolder
              v-if="createFolderDialog"
              :dialog.sync="createFolderDialog"
              :users="users"
              @update="loadPage()"
            />
            <v-btn
              color="blue-grey"
              class="white--text pa-0"
              width="45%"
              @click.stop="uploadFilesDialog = true"
            >
              Upload Files
              <v-icon right dark> mdi-cloud-upload </v-icon>
            </v-btn>
            <UploadFiles
              v-if="uploadFilesDialog"
              :dialog.sync="uploadFilesDialog"
              :users="users"
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
            <tr>
              <td>
                <v-icon v-if="!item.isFile">mdi mdi-folder-outline</v-icon>
                <v-icon v-else>mdi mdi-file-outline</v-icon>
              </td>
              <td @click="rowClicked(item)">{{ item.name }}</td>
              <td style="text-align:center">{{ getSize(item.size) }}</td>
              <td style="text-align:center; white-space: pre-wrap">{{ getDate(item.dateUploaded) }}</td>
              <td style="text-align:center">{{ item.creatorUsername }}</td>
              <td class="pa-0">
                <v-icon v-if="!item.isPublic"
                        :disabled="item.creator !== getUserId"
                        @click="changeAccessPressed(item)">
                  mdi mdi-lock
                </v-icon>
                <v-icon v-else-if="item.creator === getUserId"
                        @click="changeAccessPressed(item)">
                  mdi mdi-lock-open
                </v-icon>
              </td>
              <td class="pa-0">
                <v-icon v-if="item.isFile" @click="download(item)">mdi mdi-download</v-icon>
              </td>
              <td class="pa-0">
                <v-icon v-if="!item.creator || item.creator === getUserId"
                        @click="deletePressed(item)">
                  mdi mdi-delete
                </v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>
          <DeleteDialog
              v-if="deleteDialog"
              :id="pressedItem.id"
              :name="pressedItem.name"
              :dialog.sync="deleteDialog"
              @update="loadPage()"
          />
          <ChangeAccessToItem
            v-if="changeAccessDialog"
            :id="pressedItem.id"
            :isOriginPublic="!!pressedItem.isPublic"
            :users="users"
            :dialog.sync="changeAccessDialog"
            @update="loadPage()"
          />
      </v-card>
    </v-row>
  </v-container>
</template>
<script>
import {mapState, mapGetters, mapMutations, mapActions} from "vuex";
import consts from "../consts";
import UploadFiles from "../components/library/UploadFiles.vue";
import CreateFolder from "../components/library/CreateFolder.vue";
import DeleteDialog from "../components/library/DeleteDialog.vue";
import itemsAPI from "../API/itemsAPI.js";
import usersAPI from "../API/usersAPI.js";
import Swal from "sweetalert2";
import ChangeAccessToItem from "../components/library/ChangeAccessToItem";

export default {
  name: "Library",
  components: { UploadFiles, CreateFolder, DeleteDialog, ChangeAccessToItem },
  data() {
    return {
      isLoading: true,
      uploadFilesDialog: false,
      createFolderDialog: false,
      deleteDialog: false,
      changeAccessDialog: false,
      fileToCreator: {},
      headers: [
        { align: "start", sortable: false, value: "type", width: "5%" },
        { text: "name", filterable: true, value: "name", width: "40%" },
        { align: "center", text: "size", sortable: false, value: "size", width: "13%" },
        { align: "center", sortable: true, text: "date modified", value: "dateUploaded", width: "15%" },
        { align: "center", sortable: true, text: "creator", value: "creatorUsername", width: "15%" },
        { align: "center", sortable: false, value: "isPublic", width: "4%" },
        { align: "center", sortable: false, value: "download", width: "3%" },
        { align: "center", sortable: false, value: "trash", width: "3%" },
      ],
      items: [],
      search: "",
      users: [],
      pressedItem: {},
    };
  },
  async mounted() {
    await this.loadPage();
    this.users = (await usersAPI.getUsers()).filter(user => user.id !== this.getUserId);
    this.setCurrentPageName(consts.PagesConst.PagesNames.LIBRARY_PAGE);
  },
  computed: {
    ...mapState(['parentsDirs']),
    ...mapGetters(['getCurrentDirectoryId', 'getUserId']),
    sortedItems() {
      return this.items.slice(0).sort((value) => {
        return value.isFile ? 1 : -1;
      });
    },
    breadcrumbs() {
      const l = this.parentsDirs.length;
      return l > 4 ? this.parentsDirs.slice(l-4, l) : this.parentsDirs;
    },
    shortName() {
      return (name) => {
        if (name.length >= 10) {
          return name.slice(0, 8) + '...';
        }
        return name;
      }
    },
  },
  methods: {
    ...mapMutations(['setCurrentPageName', 'addToParentsDirsIds', 'rollBackParentDirsIds']),
    ...mapActions(['rollDirToId']),
    async loadPage() {
      this.isLoading = true;
      try {
        this.items = await itemsAPI.getFilesByCurrentFolderId(
            this.getCurrentDirectoryId === -1 ? null : this.getCurrentDirectoryId
        );
        this.isLoading = false;
      } catch (e) {
        this.$router.push('/')
      }
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
      const d = ['B', 'KB', 'MB', 'GB'];
      let index = 0;
      while (s > 1024) {
        index++;
        s = (s / 1024);
      }
      return Math.ceil(s*10)/10 + d[index];
    },
    rowClicked(item) {
      if (!item.isFile) {
        this.addToParentsDirsIds(item);
        setTimeout(this.loadPage, 100);
      }
    },
    rollback() {
      this.rollBackParentDirsIds();
      setTimeout(this.loadPage, 100);
    },
    loadPrevFolder(id) {
      this.rollDirToId(id);
      setTimeout(this.loadPage, 100);
    },
    download(item) {
      if (!itemsAPI.downloadItem(item)) {
        Swal.fire("Error", "error downloading item", "error");
      }
    },
    deletePressed(item) {
      this.pressedItem = item;
      this.deleteDialog = true;
    },
    changeAccessPressed(item) {
      this.pressedItem = item;
      this.changeAccessDialog = true;
    },
  },
};
</script>