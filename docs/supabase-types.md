# Importing supabase types

```sh
npx supabase login

# Development
export PROJECT_ID="blnqgjxcgdyaeutdeomf"

npx supabase gen types typescript --project-id "$PROJECT_ID" --schema public > src/services/db/_schema_generated.ts
```

Replace `PROJECT_ID` with the Peruanistas project id.
