import { isLoggedIn, json } from '../_lib/auth.js';

export async function onRequestGet({ request, env }) {
  return json({ loggedIn: isLoggedIn(request, env) });
}
