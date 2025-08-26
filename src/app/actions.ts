'use server';

export async function submitOrderToServer(formData: FormData) {
  const scriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;

  if (!scriptUrl) {
    throw new Error("Apps Script URL is not configured.");
  }

  try {
    // The server-side fetch is not restricted by browser CORS rules.
    const response = await fetch(scriptUrl, {
      method: "POST",
      body: formData,
    });

    // We can't fully read the response from a script redirect,
    // but we can check if the request was successful.
    if (!response.ok || response.status !== 200) {
        // Attempt to get more info from the response if possible
        const errorText = await response.text();
        console.error("Google Apps Script Error Response:", errorText);
        throw new Error(`Google Apps Script responded with status ${response.status}. Check server logs.`);
    }

    // Google Apps Script often returns a 302 redirect on success which fetch handles.
    // Here we can't easily get the final JSON, but a successful 200 OK
    // from the fetch promise resolution is a good indicator of success.
    // The client will need to handle the success state optimistically.
    
    // For a more robust solution, the Apps Script could be modified to not redirect
    // and return JSON directly, but this proxy solves the immediate CORS issue.

    return { success: true };

  } catch (error) {
    console.error("Error in server action proxying to Apps Script:", error);
    // Re-throw the error so the client can catch it.
    if (error instanceof Error) {
        throw new Error(`Server-side submission failed: ${error.message}`);
    }
    throw new Error('An unknown server-side error occurred.');
  }
}
