
export const dynamic = 'force-dynamic'; // static by default, unless reading the request
 
export function GET(request: Request) {
    console.log(request.headers);
  return new Response(`Hello from batch job test`);
}