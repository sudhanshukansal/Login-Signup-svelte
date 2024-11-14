// src/hooks.server.js
import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
  const isAuthenticated = event.locals.user; // `user` would be set on login
   console.log(event.locals.user,"event")
  // Restrict access to "/dashboard" if not logged in
  if (event.url.pathname.startsWith('/user/dashboard') && !isAuthenticated) {
    throw redirect(303, '/user/login'); // Redirect to login if not authenticated
  }

  return resolve(event);
};
