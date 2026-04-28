<template>
  <div>
    <h1>Project Portfolio</h1>
    <button @click="openForm(null)">Add Project</button>

    <div class="filters">
      <Vueform :model="filterForm" @change="fetchProjects">
        <TagsElement
            name="language_ids"
            label="Languages"
            :items="languages"
            value-prop="id"
            label-prop="name"
            placeholder="Select languages"
            :columns="{
              container: 3,
            }"
        />
        <TagsElement
            name="category_ids"
            label="Categories"
            :items="categories"
            value-prop="id"
            label-prop="name"
            placeholder="Select categories"
            :columns="{
              container: 3,
            }"
        />
        <DateElement
            name="start_date"
            label="Start Date"
            placeholder="Start Date"
            display-format="DD/MM/YYYY"
            :columns="{
              container: 3,
            }"
        />
        <DateElement
            name="end_date"
            label="End Date"
            placeholder="End Date"
            display-format="DD/MM/YYYY"
            :columns="{
              container: 3,
            }"
        />
      </Vueform>
    </div>

    <div class="project-cards">
      <div v-for="p in projects" :key="p.id" class="card">
        <h3>{{ p.name }}</h3>
        <p v-if="p.description"><strong>Description:</strong> {{ p.description }}</p>
        <p v-if="p.source_link"><strong>Source:</strong> <a :href="p.source_link" target="_blank">{{ p.source_link }}</a></p>
        <p><strong>Completed:</strong> {{ p.completion_date }}</p>
        <p><strong>Languages:</strong> {{ p.languages.join(', ') }}</p>
        <p><strong>Categories:</strong> {{ p.categories.join(', ') }}</p>
        <div class="card-actions">
          <button @click="openForm(p)">Edit</button>
          <button @click="deleteProject(p.id)">Delete</button>
        </div>
      </div>
    </div>

    <div v-if="showForm" class="form-overlay">
      <div class="form-content">
        <h2>{{ isEditing ? "Edit Project" : "New Project" }}</h2>
        <ProjectForm
          :project="project"
          :languages="languages"
          :categories="categories"
          :is-editing="isEditing"
          @cancel="closeForm"
          @submit="saveProject"
          @add-language="addNewLanguage"
          @add-category="addNewCategory"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ProjectForm from "@/app/components/ProjectForm.vue";

export default {
    components: {
    ProjectForm
  },
  data() {
    return {
      projects: [],
      languages: [],
      categories: [],
      filterForm: {
        language_ids: [],
        category_ids: [],
        start_date: "",
        end_date: "",
      },
      project: {
        id: null,
        name: "",
        description: "",
        source_link: "",
        completion_date: "",
        language_ids: [],
        category_ids: []
      },
      isEditing: false,
      showForm: false,
      newLanguages: [],
      newCategories: []
    };
  },
  created() {
    this.fetchProjects();
    this.fetchLanguages();
    this.fetchCategories();
  },
  methods: {
    fetchProjects(formData) {
      let params = {};
      if (formData && !formData.isTrusted && !formData.target) {
        params = {
          language_ids: (formData.language_ids || []).join(','),
          category_ids: (formData.category_ids || []).join(','),
          start_date: formData.start_date || "",
          end_date: formData.end_date || ""
        };
      } else {
        params = {
          language_ids: this.filterForm.language_ids.join(','),
          category_ids: this.filterForm.category_ids.join(','),
          start_date: this.filterForm.start_date,
          end_date: this.filterForm.end_date
        };
      }
      this.$axios.get("reports", { params }).then(response => {
        this.projects = response.data.data;
      });
    },

    fetchLanguages() {
      return this.$axios.get("languages").then(response => {
        this.languages = response.data.data;
      });
    },

    fetchCategories() {
      return this.$axios.get("categories").then(response => {
        this.categories = response.data.data;
      });
    },

    openForm(project) {
      if (project) {
        this.isEditing = true;
        this.project = {
          ...project,
          language_ids: this.languages.filter(l => project.languages.includes(l.name)).map(l => l.id),
          category_ids: this.categories.filter(c => project.categories.includes(c.name)).map(c => c.id)
        };
      } else {
        this.resetForm();
      }
      this.showForm = true;
    },

    closeForm() {
      this.showForm = false;
      this.resetForm();
      this.fetchProjects();
    },

    addNewLanguage(newLanguageName) {
      this.$axios.post("languages", { name: newLanguageName }).then(response => {
        this.fetchLanguages().then(() => {
          this.newLanguages.push({
            id: response.data.data.id,
            name: newLanguageName
          });
        });
      });
    },

    addNewCategory(newCategoryName) {
      this.$axios.post("categories", { name: newCategoryName }).then(response => {
        this.fetchCategories().then(() => {
          this.newCategories.push({
            id: response.data.data.id,
            name: newCategoryName
          });
        });
      });
    },

    saveProject(projectData) {
      const language_ids = projectData.language_ids.map(lang => {
        const newLang = this.newLanguages.find(l => l.name === lang.name);
        return newLang ? newLang.id: lang.id;
      });

      const category_ids = projectData.category_ids.map(cat => {
        const newCat = this.newCategories.find(c => c.name === cat.name);
        return newCat ? newCat.id : cat.id;
      });

      const data = {
        ...projectData,
        language_ids,
        category_ids,
      };

      const action = this.isEditing
        ? this.$axios.put(`projects/${this.project.id}`, data)
        : this.$axios.post("projects", data);

      action.then(() => {
        this.fetchProjects();
        this.closeForm();
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
        language_ids: [],
        category_ids: []
      };
      this.newLanguages = [];
      this.newCategories = [];
    }
  }
};
</script>

<style scoped>
.filters {
  margin: 20px 0;
}
.project-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 20px;
}

.card-actions {
  margin-top: auto;
  text-align: right;
}
</style>
