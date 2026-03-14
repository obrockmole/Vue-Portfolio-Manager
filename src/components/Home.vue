<template>
  <div>
    <h1>Project Portfolio</h1>
    <button @click="openModal(null)">Add Project</button>

    <div class="project-cards">
      <div v-for="p in projects" :key="p.id" class="card">
        <h3>{{ p.name }}</h3>
        <p v-if="p.description"><strong>Description:</strong> {{ p.description }}</p>
        <p v-if="p.source_link"><strong>Source:</strong> <a :href="p.source_link" target="_blank">{{ p.source_link }}</a></p>
        <p><strong>Completed:</strong> {{ p.completion_date }}</p>
        <p><strong>Language:</strong> {{ p.language }}</p>
        <p><strong>Category:</strong> {{ p.category }}</p>
        <div class="card-actions">
          <button @click="openModal(p)">Edit</button>
          <button @click="deleteProject(p.id)">Delete</button>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>{{ isEditing ? "Edit Project" : "New Project" }}</h2>
        <form @submit.prevent="saveProject">
          <input type="hidden" v-model="project.id">
          <input type="text" v-model="project.name" placeholder="Project Name" required>
          <textarea v-model="project.description" placeholder="Description"></textarea>
          <input type="text" v-model="project.source_link" placeholder="Source Link">
          <input type="date" v-model="project.completion_date" required>

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
            <option disabled value="">Select a category</option>
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
.project-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 20px;
}

.card {
  background-color: #2c2c2c;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 20px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card h3 {
  margin-top: 0;
  color: #fff;
}

.card p {
  margin: 10px 0;
}

.card a {
  color: #00aaff;
  text-decoration: none;
}

.card a:hover {
  text-decoration: underline;
}

.card-actions {
  margin-top: auto;
  text-align: right;
}
</style>
