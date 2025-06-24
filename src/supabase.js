// src/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wzrlsvrypjcwoozeskpf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6cmxzdnJ5cGpjd29vemVza3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1OTA3OTksImV4cCI6MjA2NjE2Njc5OX0.-wbX9BIE26igXP-F1arVFphwm-uMgNQtPkz-z-wFIPM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
