import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  // Get the project root directory
  const projectRoot = process.cwd();
  
  // Create the response JSON
  const jsonData = {
    workspace: {
      root: projectRoot,
      uuid: 'clothing-website-dev-environment',
    }
  };
  
  // Return the JSON response
  return NextResponse.json(jsonData);
}