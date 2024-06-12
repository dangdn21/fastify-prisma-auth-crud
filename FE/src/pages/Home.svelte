 <script>
 import { onMount } from 'svelte'
 import PostForm from '../components/PostForm.svelte'
 import Loading from '../components/Loading.svelte'

 let postLimit

 const apiBaseUrl = 'https://ndb99xkpdk.execute-api.eu-west-2.amazonaws.com/dev'
 let posts = []
 let editingPost = {
   body: '',
   title: '',
   id: null
 }

 onMount(async () => {
   const res = await fetch(apiBaseUrl + '/posts')
   posts = await res.json()
 })
 function editPost(post) {
   console.log(post)
   editingPost = post
 }
 function deletePost(id) {
   console.log('Deleting post with id:', id)
   if(confirm('R u sure mofo? Post Id: ' + id)) {
     fetch(`${apiBaseUrl}/post/${id}`, {
        method: 'DELETE'
      }).then(res =>{
        return res.json()
      })
      .then(() => {
        posts = posts.filter(p => p.id !== id)
      })
   }
 }
 function addPost({ detail: post}) {
   if(posts.find(p => p.id === post.id)) {
     const index = posts.findIndex(p => p.id === post.id)
     let postsUpdated = posts
     postsUpdated.splice(index, 1, post)
     posts = postsUpdated
   } else {
     posts = [post, ...posts]
   }
   editingPost = {
      body: '',
      title: '',
      id: null
    }
 }

 function setLimit () {
   fetch (`${apiBaseUrl}/posts/${postLimit}`)
     .then(res => {
       return res.json()
     })
     .then(postsData => {
       posts = postsData
     })
 }
</script>

  <div class="container flex flex-col justify-between min-h-screen min-w-full bg-white text-gray-800 leading-normal">
  {#if posts.length === 0}
    <div class="w-full w-full container max-w-xl mx-auto p-6" >
      <Loading />
    </div>
  {:else}
    <main class="w-full w-full container max-w-xl mx-auto p-6">
    <PostForm on:postCreated={addPost} {editingPost}/>
    <div class="mb-4 py-4 px-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="postLimiter">
        Limit number of posts
      </label>
      <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="postLimiter" type="number" bind:value={postLimit} placeholder="Posts limit">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2" on:click={setLimit}>Set</button>
    </div>
    {#each posts as post}
      <div class="max-w-sm max-w-full lg:flex shadow-inner bg-gray-300 border border-gray-400 rounded-b">
        <div class="p-4 flex flex-col justify-between leading-normal">
          <div class="mb-3">
            <div class="font-bold text-xl mb-2">{post.title}</div>
            <p class="text-gray-700 text-base">{post.body}</p>
          </div>
          <div>
            <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">{post.createdAt}</span>
          </div>
          <div class="inline-flex mt-4">
            <button on:click="{() => editPost(post)}" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l">
              Edit
            </button>
            <button on:click="{() => deletePost(post.id)}" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r">
              Delete
            </button>
          </div>
        </div>
      </div>
      <br>
      {/each}
      <p class="text-center text-gray-500 text-xs">
        &copy;2019 Reboseitor Corp. All rights reserved.
      </p>
    </main>
  {/if}
  </div>

