<template>
  <div id="app">
    <h1>Project Portfolio</h1>
    <button @click="openModal(null)">Add Project</button>

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Source Link</th>
          <th>Completion Date</th>
          <th>Language</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in projects" :key="p.id">
          <td>{{ p.name }}</td>
          <td>{{ p.description }}</td>
          <td><a :href="p.source_link" target="_blank">{{ p.source_link }}</a></td>
          <td>{{ p.completion_date }}</td>
          <td>{{ p.language }}</td>
          <td>{{ p.category }}</td>
          <td>
            <button @click="openModal(p)">Edit</button>
            <button @click="deleteProject(p.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>{{ isEditing ? "Edit Project" : "New Project" }}</h2>
        <form @submit.prevent="saveProject">
          <input type="hidden" v-model="project.id">
          <input type="text" v-model="project.name" placeholder="Project Name" required>
          <textarea v-model="project.description" placeholder="Description"></textarea>
          <input type="text" v-model="project.source_link" placeholder="Source Link">
          <input type="date" v-model="project.completion_date">

          <select v-model="project.language_id" required>
            <option disabled value="">Select a language</option>
            <option v-for="language in languages" :key="language.id" :value="language.id">
              {{ language.name }}
            </option>
          </select>
          <div class="new-item-form">
            <input type="text" v-model="newLanguage" placeholder="New Language Name">
            <button type="button" @click="addNewLanguage">Save Language</button>
          </div>

          <select v-model="project.category_id" required>
            <option disabled value="">Please select a category</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
           <div class="new-item-form">
            <input type="text" v-model="newCategory" placeholder="New Category Name">
            <button type="button" @click="addNewCategory">Save Category</button>
          </div>

          <button type="submit">{{ isEditing ? "Update" : "Add Project" }}</button>
          <button type="button" @click="closeModal">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projects: [],
      languages: [],
      categories: [],
      project: {
        id: null,
        name: "",
        description: "",
        source_link: "",
        completion_date: "",
        language_id: "",
        category_id: ""
      },
      isEditing: false,
      showModal: false,
      newLanguage: "",
      newCategory: ""
    };
  },
  created() {
    this.fetchProjects();
    this.fetchLanguages();
    this.fetchCategories();
  },
  methods: {
    fetchProjects() {
      this.$axios.get("projects").then(response => {
        this.projects = response.data.data;
      });
    },
    fetchLanguages() {
      this.$axios.get("languages").then(response => {
        this.languages = response.data.data;
      });
    },
    fetchCategories() {
      this.$axios.get("categories").then(response => {
        this.categories = response.data.data;
      });
    },
    openModal(project) {
      if (project) {
        this.isEditing = true;
        this.project = { ...project, language_id: this.languages.find(l => l.name === project.language)?.id, category_id: this.categories.find(c => c.name === project.category)?.id };
      } else {
        this.resetForm();
      }
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.resetForm();
    },
    saveProject() {
      const action = this.isEditing
        ? this.$axios.put(`projects/${this.project.id}`, this.project)
        : this.$axios.post("projects", this.project);

      action.then(() => {
        this.fetchProjects();
        this.closeModal();
      });
    },
    deleteProject(id) {
      this.$axios.delete(`projects/${id}`).then(() => {
        this.fetchProjects();
      });
    },
    resetForm() {
      this.isEditing = false;
      this.project = {
        id: null,
        name: "",
        description: "",
        source_link: "",
        completion_date: "",
        language_id: "",
        category_id: ""
      };
    },
    addNewLanguage() {
      this.$axios.post("languages", { name: this.newLanguage }).then(response => {
        this.fetchLanguages().then(() => {
            this.project.language_id = response.data.data.id;
            this.newLanguage = "";
        });
      });
    },
    addNewCategory() {
      this.$axios.post("categories", { name: this.newCategory }).then(response => {
        this.fetchCategories().then(() => {
            this.project.category_id = response.data.data.id;
            this.newCategory = "";
        });
      });
    }
  }
};
</script>

<style>
body {
  background-color: #1a1a1a;
  color: #e0e0e0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}
table {
  width: 80%;
  margin: 20px auto;
  border-collapse: collapse;
  background-color: #2c2c2c;
}
th, td {
  border: 1px solid #444;
  padding: 12px;
}
th {
  background-color: #333;
  color: #fff;
}
button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
}
button:hover {
  background-color: #0056b3;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background-color: #2c2c2c;
  padding: 20px;
  border-radius: 10px;
  width: 500px;
}
.modal-content h2 {
  color: #fff;
}
.modal-content form {
  display: flex;
  flex-direction: column;
}
.modal-content input, .modal-content textarea, .modal-content select {
  background-color: #333;
  color: #e0e0e0;
  border: 1px solid #555;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}
.new-item-form {
  display: flex;
  margin-bottom: 10px;
}
.new-item-form input {
  flex-grow: 1;
  margin-right: 10px;
  margin-bottom: 0;
}
</style>
