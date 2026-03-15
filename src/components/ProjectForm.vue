<template>
  <Vueform @submit="submitForm" :data="project">
    <TextElement
        name="name"
        label="Project Name"
        :columns="{
          label: 3,
        }"
        :rules="[
          'required',
        ]"
    />
    <TextareaElement
        name="description"
        label="Description"
    />
    <TextElement
        name="source_link"
        label="Source"
        input-type="url"
        :rules="[
          'nullable',
          'required',
          'url',
        ]"
        placeholder="http(s)://example.com"
        :floating="false"
        :columns="{
          label: 3,
        }"
    />
    <DateElement
        name="completion_date"
        label="Completion Date"
        display-format="DD/MM/YYYY"
        :rules="[
          'required',
        ]"
        :columns="{
          label: 4,
        }"
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
import { Vueform, useVueform } from "@vueform/vueform"

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
  }
};
</script>