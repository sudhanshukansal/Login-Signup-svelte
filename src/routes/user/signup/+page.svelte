<!-- <script>
  let formData = {
    name: "",
    surname: "",
    businessname: "",
    gmail: "",
    contactnumber: "",
    password: "",
    confirmpassword: "",
  };

  async function handleRegister() {
    if (formData.password !== formData.confirmpassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Registration successful!");
      } else {
        alert(`Registration failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again.");
    }
  }
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
  <form
    on:submit|preventDefault={handleRegister}
    class="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
  >
    <h2 class="text-2xl font-bold mb-6 text-center">Register your Business</h2>

    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="name"
        >First Name</label
      >
      <input
        type="text"
        id="name"
        bind:value={formData.name}
        required
        class="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
      />
    </div>

    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="surname"
        >Surname</label
      >
      <input
        type="text"
        id="surname"
        bind:value={formData.surname}
        required
        class="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
      />
    </div>

    <div class="mb-4">
      <label
        class="block text-gray-700 text-sm font-bold mb-2"
        for="businessname">Business Name</label
      >
      <input
        type="text"
        id="businessname"
        bind:value={formData.businessname}
        required
        class="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
      />
    </div>

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
      <label
        class="block text-gray-700 text-sm font-bold mb-2"
        for="contactnumber">Contact Number</label
      >
      <input
        type="tel"
        id="contactnumber"
        bind:value={formData.contactnumber}
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

    <div class="mb-4">
      <label
        class="block text-gray-700 text-sm font-bold mb-2"
        for="confirmpassword">Confirm Password</label
      >
      <input
        type="password"
        id="confirmpassword"
        bind:value={formData.confirmpassword}
        required
        class="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
      />
    </div>


    <button
      type="submit"
      class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
    >
      Register
    </button>
  </form>
</div> -->
<script>
  import { goto } from "$app/navigation";
  let error= ""
  let formData = {
    /* form data fields */
  };
  let pendingVerifications = {};
  let otp = "";
  let otpSent = false;

  async function handleRegister() {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, //no use,
      body: JSON.stringify(formData),
    });
    const result = await response.json();
    pendingVerifications = result.pendingVerifications;
    if (response.ok) {
     
      // alert(result.message);
       if(result.success== true){
        otpSent = true; // Show OTP input field
        error = result.message;
       }else{
        error = result.message
       }

    } else {
      alert(`Registration failed: ${result.message}`);
    }
  }

  async function verifyOtp() {
    const response = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pendingVerifications, otp }),
    });

    const result = await response.json();
    if (response.ok) {
      alert("User registered successfully");
      otpSent = false;
      // Optionally, redirect the user to a login page or home page
    } else {
      alert(`Verification failed: ${result.message}`);
    }
  }
  async function resend() {
    const response = await fetch("/api/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pendingVerifications }),
    });

    const result = await response.json();
    pendingVerifications = result.pendingVerifications;
    if (response.ok) {
      alert(result.message);
      // otpSent = false;
      // Optionally, redirect the user to a login page or home page
    } else {
      alert(`otp failed: ${result.message}`);
    }
  }

  function goToLogin(){
    goto("/user/login");
  }

</script>

{#if otpSent}
<div class="flex flex-col items-center justify-center p-4 md:p-6 bg-white rounded-md shadow-md w-full max-w-md mx-auto">
  <label for="otp" class="text-lg font-semibold mb-2 text-gray-700">Enter OTP</label>
  
  <input
    type="text"
    id="otp"
    bind:value={otp}
    required
    class="w-full px-4 py-2 mb-4 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  
  <div class="flex gap-4 w-full">
    <button
      on:click={verifyOtp}
      class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Verify OTP
    </button>
    
    <button
      on:click={resend}
      class="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
    >
      Resend
    </button>
  </div>
</div>

{:else}
  <!-- Registration Form -->
  <form
    on:submit|preventDefault={handleRegister}
    class="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
  >
    <h2 class="text-2xl font-bold mb-6 text-center">Register your Business</h2>

    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="name"
        >First Name</label
      >
      <input
        type="text"
        id="name"
        bind:value={formData.name}
        required
        class="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
      />
    </div>

    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="surname"
        >Surname</label
      >
      <input
        type="text"
        id="surname"
        bind:value={formData.surname}
        required
        class="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
      />
    </div>

    <div class="mb-4">
      <label
        class="block text-gray-700 text-sm font-bold mb-2"
        for="businessname">Business Name</label
      >
      <input
        type="text"
        id="businessname"
        bind:value={formData.businessname}
        required
        class="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
      />
    </div>

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
      <p class="text-red-500 text-center">{error}</p>
    </div>

    <div class="mb-4">
      <label
        class="block text-gray-700 text-sm font-bold mb-2"
        for="contactnumber">Contact Number</label
      >
      <input
        type="tel"
        id="contactnumber"
        bind:value={formData.contactnumber}
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

    <div class="mb-4">
      <label
        class="block text-gray-700 text-sm font-bold mb-2"
        for="confirmpassword">Confirm Password</label
      >
      <input
        type="password"
        id="confirmpassword"
        bind:value={formData.confirmpassword}
        required
        class="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
      />
    </div>

    <button
      type="submit"
      class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
    >
      Register
    </button>
    <a on:click={goToLogin} class="text-blue-500 flex  justify-center  cursor-pointer">already a login ?</a>
  </form>
  
{/if}
