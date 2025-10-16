export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // แก้ IP และ Port ตาม Backend ของคุณ
  const BACKEND_URL = import.meta.env.VITE_FRONTEND_URL;
  
  const backendPath = url.pathname.replace('/api', '');
  const backendUrl = BACKEND_URL + backendPath + url.search;
  
  console.log('Proxying to:', backendUrl);
  
  try {
    const response = await fetch(backendUrl, {
      method: context.request.method,
      headers: context.request.headers,
      body: context.request.method !== 'GET' && context.request.method !== 'HEAD' 
        ? context.request.body 
        : undefined,
    });

    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
    
    // เพิ่ม CORS headers
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return newResponse;
    
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({ 
      error: 'Backend connection failed',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}