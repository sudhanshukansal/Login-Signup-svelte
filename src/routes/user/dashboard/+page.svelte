<script context="module">
    import { redirect } from '@sveltejs/kit';
  
    export const load = async ({ locals }) => {
      if (!locals.user) {
        throw redirect(303, '/user/login'); // Redirect to login if not authenticated
      }
    };
  </script>
  
  <h1 class="text-center text-2xl font-bold">Welcome to your dashboard!</h1>
  