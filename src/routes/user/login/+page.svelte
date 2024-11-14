<script>
  import { goto } from "$app/navigation";
  let formData = { gmail: "", password: "" };
  let error = "";

  async function handleLogin() {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, //no use,
      body: JSON.stringify(formData),
    });
    const result = await response.json();
    console.log(result, "result login");
    if (response.ok) {
     error = result.message
      goto("/user/dashboard"); // Redirect to dashboard on success
    } else {
      error = result.message;
    }
  }
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
  <form
    on:submit|preventDefault={handleLogin}
    class="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
  >
    <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>

    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="gmail"
        >Email</label
      >
      <input
        type="email"
        id="gmail"
        bind:value={formData.gmail}
        required
        class="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
      />
    </div>

    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="password"
        >Password</label
      >
      <input
        type="password"
        id="password"
        bind:value={formData.password}
        required
        class="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
      />
    </div>

    {#if error}
      <p class="text-red-500 text-center">{error}</p>
    {/if}

    <button
      type="submit"
      class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
    >
      Login
    </button>

    <div class="flex justify-between items-center mt-4">
      <a href="/user/signup" class="text-blue-500 hover:underline"
        >New User? Register</a
      >
      <a href="/user/forgot-password" class="text-blue-500 hover:underline"
        >Forgot Password?</a
      >
    </div>
  </form>
</div>
