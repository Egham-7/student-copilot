import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export async function signUpNewUser(
  email: string,
  password: string,
  redirect_url: string,
) {
  return await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: redirect_url,
    },
  });
}

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
}
