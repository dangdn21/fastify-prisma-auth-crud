<script>
  $: email = '';
  $: password = '';

  async function onSubmit(event) {
    event.preventDefault();
    if (email.trim() === '' || password.trim() === '') {
      return;
    }

    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    console.log(data);
  }
</script>

<div class="w-full">
  <form
    class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    on:submit={onSubmit}
  >
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
        Email
      </label>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        name="email"
        type="text"
        bind:value={email}
        placeholder="Please enter your email"
      />
    </div>
    <div class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
        Password
      </label>
      <input
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        name="password"
        type="password"
        bind:value={password}
        placeholder="Please enter your password"
      />
      <!--<p class="text-red-500 text-xs italic">Please choose a password.</p>-->
    </div>
    <div class="flex items-center justify-between">
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="submit"
      >
        Login
      </button>
    </div>
  </form>
</div>
