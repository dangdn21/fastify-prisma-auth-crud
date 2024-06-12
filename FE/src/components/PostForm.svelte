<script>
  import Loading from '../components/Loading.svelte'
  import { createEventDispatcher } from 'svelte'

  export let editingPost

  const dispatch = createEventDispatcher()

  $: title = editingPost.title
  $: body = editingPost.body
  let loading = false
  const apiBaseUrl = 'https://ndb99xkpdk.execute-api.eu-west-2.amazonaws.com/dev'

  async function onSubmit(event){
    event.preventDefault()
    if(title.trim() === '' || body.trim() === '') {
      return
    }
    loading = true
    const newPost = {title, body}
    let url, method
    if(editingPost.id) {
      url = `${apiBaseUrl}/post/${editingPost.id}`
      method = 'PUT'
    } else {
      url = `${apiBaseUrl}/post`
      method = 'POST'
    }
    const res = await fetch(url, {
      method,
      body: JSON.stringify(newPost)
    })
    console.log('ld', loading)
    const post = await res.json()
    dispatch('postCreated', post)
    loading = false
  }
</script>

<div class="w-full">
  {#if !loading}
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" on:submit={onSubmit}>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
          Title
        </label>
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="title" type="text" bind:value={editingPost.title} placeholder="Title">
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="body">
          Body
        </label>
        <textarea class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" name="body" type="text" bind:value={editingPost.body} placeholder="Body"></textarea>
        <!--<p class="text-red-500 text-xs italic">Please choose a password.</p>-->
      </div>
      <div class="flex items-center justify-between">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          {editingPost.id ? 'Update' : 'Post'}
        </button>
      </div>
    </form>
  {:else}
    <Loading />
  {/if}
</div>