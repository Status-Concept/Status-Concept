# Delivery photo workflow

This is the recommended next feature for the delivery team. It is intentionally documented before adding a public-facing upload flow, because delivery records contain customer and project information and need role-based access.

## MVP workflow

1. A team member creates or opens a delivery job.
2. The job records the project/customer reference, delivery date, assigned team, and installation status.
3. The team uploads before, during, and after photos from a phone.
4. The team adds notes, issues, and a completion confirmation.
5. An authorized admin reviews the record and can export or revisit it later.

## Supabase shape

- `delivery_jobs`: id, project_reference, customer_reference, scheduled_date, assigned_to, status, notes, completed_at, created_at
- `delivery_photos`: id, job_id, storage_path, stage, caption, captured_at, uploaded_by, created_at
- `delivery_job_members`: job_id, user_id, role
- Storage bucket: private `delivery-photos`
- Row-level security: delivery members can read and upload only to assigned jobs; admins can manage all delivery records

## Mobile requirements

- Use a camera-friendly file input with multiple photo selection.
- Compress images before upload while preserving enough detail for condition records.
- Show upload progress and retry states per photo.
- Support offline-friendly draft notes where practical.
- Never expose private delivery photos through public URLs.

The public website redesign does not expose this workflow yet. The next implementation step should be an authenticated internal delivery route backed by the schema above, followed by a Supabase RLS review.
