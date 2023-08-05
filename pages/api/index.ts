import { NextRequest, NextResponse } from "next/server";
import withRateLimit from "../utils/withRateLimit";

async function handler(request: NextRequest, response: NextResponse) {
  response.status(200).send();
}

export default withRateLimit(handler)