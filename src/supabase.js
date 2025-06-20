import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://asugiopzsflijblhtcck.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzdWdpb3B6c2ZsaWpibGh0Y2NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzc1NDEsImV4cCI6MjA2NTk1MzU0MX0.jR095cOgBUVNLNydz3sSaCXJsISC_H5PdDUcadXbNUs'
export const supabase = createClient(supabaseUrl, supabaseKey)