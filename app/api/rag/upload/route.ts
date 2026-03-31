import { handleRagUpload } from "@/backend/controllers/ragController";
import { fail, ok } from "@/backend/routes/apiResponse";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return fail("A PDF or TXT file is required.");
    }

    const data = await handleRagUpload(file);
    return ok(data);
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Unable to upload document.",
      500
    );
  }
}
