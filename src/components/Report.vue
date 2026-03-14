<template>
  <div>
    <h2>Reports</h2>
    <div class="filters">
      <select v-model="selectedLanguage">
        <option value="">All Languages</option>
        <option v-for="lang in languages" :key="lang.id" :value="lang.id">{{ lang.name }}</option>
      </select>
      <select v-model="selectedCategory">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
      <input type="date" v-model="startDate" placeholder="Start Date">
      <input type="date" v-model="endDate" placeholder="End Date">
      <button @click="generateReport">Generate Report</button>
    </div>
    <div v-if="reportData">
      <h3>Report Results</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Source Link</th>
            <th>Completion Date</th>
            <th>Language</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in reportData" :key="project.id">
            <td>{{ project.name }}</td>
            <td>{{ project.description }}</td>
            <td><a :href="project.source_link" target="_blank">{{ project.source_link }}</a></td>
            <td>{{ project.completion_date }}</td>
            <td>{{ project.language }}</td>
            <td>{{ project.category }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      languages: [],
      categories: [],
      selectedLanguage: "",
      selectedCategory: "",
      startDate: "",
      endDate: "",
      reportData: null
    };
  },
  created() {
    this.fetchLanguages();
    this.fetchCategories();
  },
  methods: {
    fetchLanguages() {
      this.$axios.get("/languages").then(response => {
        this.languages = response.data.data;
      });
    },
    fetchCategories() {
      this.$axios.get("/categories").then(response => {
        this.categories = response.data.data;
      });
    },
    generateReport() {
      const params = {
        language_id: this.selectedLanguage,
        category_id: this.selectedCategory,
        start_date: this.startDate,
        end_date: this.endDate
      };
      this.$axios.get("/reports", { params }).then(response => {
        this.reportData = response.data.data;
      });
    }
  }
};
</script>

<style scoped>
.filters {
  margin-bottom: 20px;
}
.filters select, .filters input {
  margin-right: 10px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f2f2f2;
}
</style>
