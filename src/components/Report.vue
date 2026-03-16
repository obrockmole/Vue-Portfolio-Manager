<template>
  <div>
    <h1>Reports</h1>
    <div class="filters">
      <Vueform :model="form" @submit="generateReport">
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

        <ButtonElement name="submit" button-label="Generate Report" :submits="true" />

        <StaticElement
            name="divider"
            tag="hr"
            v-if="reportData"
        />
      </Vueform>
    </div>

    <div class="report-cards">
      <div v-for="p in reportData" :key="p.id" class="card">
        <h3>{{ p.name }}</h3>
        <p v-if="p.description"><strong>Description:</strong> {{ p.description }}</p>
        <p v-if="p.source_link"><strong>Source:</strong> <a :href="p.source_link" target="_blank">{{ p.source_link }}</a></p>
        <p><strong>Completed:</strong> {{ p.completion_date }}</p>
        <p><strong>Languages:</strong> {{ p.languages.join(', ') }}</p>
        <p><strong>Categories:</strong> {{ p.categories.join(', ') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        language_ids: [],
        category_ids: [],
        start_date: "",
        end_date: "",
      },
      languages: [],
      categories: [],
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
    generateReport(form$) {
      const params = {
        language_ids: form$.data.language_ids.join(','),
        category_ids: form$.data.category_ids.join(','),
        start_date: form$.data.start_date,
        end_date: form$.data.end_date
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

.report-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 20px;
}
</style>
