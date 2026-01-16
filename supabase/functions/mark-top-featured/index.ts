import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Expect an Authorization: Bearer <service_role_key>
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('[mark-top-featured] Unauthorized: No Authorization header provided.')
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      token,
    )

    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {}
    const limit = typeof body.limit === 'number' ? body.limit : 4

    const { data, error } = await supabase.rpc('mark_top_videos_as_featured', { p_limit: limit })

    if (error) {
      console.error('[mark-top-featured] RPC error:', error.message)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ message: 'Marked top videos as featured', updated: data }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[mark-top-featured] Handler error:', message)
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
