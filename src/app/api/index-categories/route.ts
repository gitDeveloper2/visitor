// app/api/runEvery6Hours/route.js

import { fetchAndSaveCategories } from "../../../lib/services/mongo/links";
import { ApiResponse } from "../../../types/apiResponse";

export async function GET(req: Request) {
  // Your function logic here
  await fetchAndSaveCategories()
  console.log('Cron job triggered at ' + new Date());
  
  // Respond with a success message
  const response:ApiResponse<any>={
    message:"indexed categories succesfully",
    success:true
  }
  return new Response(JSON.stringify(response), {
    status: 200,
  });
};
