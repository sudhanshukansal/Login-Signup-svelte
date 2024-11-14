<script>
  import { goto } from "$app/navigation";

  let gmail = "";
  let otp = "";
  let password = "";
  let otpSent = false;

  let error = "";
  let updatedPassword = {};

  // Function to send OTP to user's email
  async function sendOtp() {
    error = "";
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gmail, password }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        otpSent = true;
        error = "OTP sent to your email.";

        updatedPassword = result.updatedPasword;
        console.log(updatedPassword, "after updaion");
      } else {
        error = result.message || "Failed to send OTP. Please try again.";
      }
    } catch (err) {
      error = "Failed to send OTP. Please try again.";
    }
  }

  // Function to verify OTP
  async function verifyOtp() {
    error = "";
    try {
      const response = await fetch("/api/updated-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updatedPassword , otp }),
      });

      const result = await response.json();
      if (response.ok ) {
        error = "OTP verified successfully. Please enter a new password.";
        goto("/user/dashboard");
      } else {
        error = result.message || "OTP verification failed. Please try again.";
      }
    } catch (err) {
      error = "OTP verification failed. Please try again.";
    }
  }

  // Function to update password
 
</script>

<div
  class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4"
>
  <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
    <h2 class="text-2xl font-bold mb-4 text-center">Forgot Password</h2>

    <!-- Email Input Section -->
    {#if !otpSent}
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
          >Enter your Email</label
        >
        <input
          type="email"
          id="email"
          bind:value={gmail}
          required
          class="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
        />
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="newPassword">Enter New Password</label
        >
        <input
          type="password"
          id="newPassword"
          bind:value={password}
          required
          class="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
        />

        {#if error}
          <p class="text-red-500 text-center mt-4">{error}</p>
        {/if}
      </div>
      <button
        on:click={sendOtp}
        class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
      >
        Send OTP
      </button>
    {/if}

    <!-- OTP Input Section -->
    {#if otpSent}
      <div class="mb-4 mt-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="otp"
          >Enter OTP</label
        >
        <input
          type="text"
          id="otp"
          bind:value={otp}
          required
          class="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
        />
      </div>
      {#if error}
        <p class="text-red-500 text-center mt-4">{error}</p>
      {/if}
      <button
        on:click={verifyOtp}
        class="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
      >
        Submit OTP
      </button>
    {/if}

    <!-- New Password Input Section -->
  </div>
</div>
