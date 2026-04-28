<template>
  <Vueform :endpoint="false" @submit="submitForm" :data="project" validate-on="submit">
    <TextElement
        name="name"
        label="Project Name"
        :columns="{
          label: 3,
        }"
        :rules="[
          'required',
        ]"
        :default="project.name || ''"
    />
    <TextareaElement
        name="description"
        label="Description"
        :default="project.description || ''"
    />
    <TextElement
        name="source_link"
        label="Source"
        input-type="url"
        :rules="[source]"
        placeholder="http(s)://example.com"
        :floating="false"
        :columns="{
          label: 3,
        }"
        :default="project.source_link || ''"
    />
    <DateElement
        name="completion_date"
        label="Completion Date"
        display-format="DD/MM/YYYY"
        value-format="YYYY-MM-DD"
        :columns="{
          label: 4,
        }"
        :default="project.completion_date || ''"
    />
    <TagsElement
        name="language_ids"
        label="Languages"
        input-type="search"
        autocomplete="off"
        :strict="false"
        :create="true"
        :closeOnSelect="false"
        :object="true"
        :rules="[
          'required',
        ]"
        :items="languages"
        value-prop="id"
        label-prop="name"
        @tag="v => addNewLanguage(v)"
        :default="projectLanguages"
    />
    <TagsElement
        name="category_ids"
        label="Categories"
        input-type="search"
        autocomplete="off"
        :strict="false"
        :create="true"
        :closeOnSelect="false"
        :object="true"
        :rules="[
          'required',
        ]"
        :items="categories"
        value-prop="id"
        label-prop="name"
        @tag="v => addNewCategory(v)"
        :default="projectCategories"
    />
    <ButtonElement
        name="cancel"
        button-label="Cancel"
        @click="$emit('cancel')"
        :columns="{
          container: 6,
        }"
        :full="true"
    />
    <ButtonElement
        name="submit"
        :button-label="isEditing ? 'Update' : 'Add Project'"
        :submits="true"
        :columns="{
          container: 6,
        }"
        :full="true"
    />
  </Vueform>
</template>

<script>
import { Vueform, useVueform, Validator } from "@vueform/vueform"

const source = class extends Validator {
  get msg() {
    return "The source link must be a valid URL.";
  }

  check(value) {
    if (value === "" || value === null) return true;
    const pattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*\/?$/;
    return pattern.test(value);
  }
}

export default {
  mixins: [Vueform],
  emits: ["cancel", "submit", "add-language", "add-category"],
  setup: useVueform,
  props: {
    project: {
      type: Object,
      required: true
    },
    languages: {
      type: Array,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
    isEditing: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    projectLanguages() {
      if (!this.project || !this.project.language_ids) {
        return [];
      }

      return this.project.language_ids.map(langId => this.languages.find(l => l.id === langId)).filter(Boolean);
    },
    projectCategories() {
      if (!this.project || !this.project.category_ids) {
        return [];
      }
      
      return this.project.category_ids.map(catId => this.categories.find(c => c.id === catId)).filter(Boolean);
    }
  },
  methods: {
    submitForm(form$) {
      const data = { ...form$.data };
      this.$emit("submit", data)
    },

    addNewLanguage(name) {
      this.$emit("add-language", name)
    },

    addNewCategory(name) {
      this.$emit("add-category", name)
    }
  },
  data() {
    return {
      source
    }
  }
};
</script>