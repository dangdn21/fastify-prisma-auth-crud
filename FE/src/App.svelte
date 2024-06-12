<script>
import { Router, Route } from 'svelte-routing'
import Navbar from './layout/Navbar.svelte'
import Home from './pages/Home.svelte'
import About from './pages/About.svelte'
import Blog from './pages/Blog.svelte'
import Login from './pages/Login.svelte'
</script>

<style>
</style>

<Router>
  <Navbar/>
  <div class="container mx-auto">
    <Route path="/" component={Home} />
    <Route path="/about" component={About} />
    <Route path="/blog" component={Blog} />
    <Route path="/login" component={Login} />
  </div>
</Router>
