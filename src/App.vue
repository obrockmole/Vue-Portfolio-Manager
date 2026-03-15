<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/reports">Reports</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App"
}
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
.form-overlay {
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
.form-content {
  background-color: #2c2c2c;
  padding: 20px;
  border-radius: 10px;
  width: 500px;
}
.form-content h2 {
  color: #fff;
}
.form-content form {
  display: flex;
  flex-direction: column;
}
.form-content input, .form-content textarea, .form-content select {
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
nav {
  margin: 20px 0;
}
nav a {
  color: #007bff;
  text-decoration: none;
}
nav a:hover {
  text-decoration: underline;
}
</style>
