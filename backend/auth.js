// auth.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const TOKEN_URL = "https://api.descope.com/oauth2/v1/apps/token";

/**
 * Get access token using Client Credentials flow from Descope.
 * scope: string (space-separated scopes), e.g. "deadlines.extract"
 */
export async function getAccessToken(scope = "full_access") {
  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.DESCOPE_CLIENT_ID,
    client_secret: process.env.DESCOPE_CLIENT_SECRET,
    scope,
  });

  const res = await axios.post(TOKEN_URL, params.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return res.data.access_token; // throw if no token?
}
