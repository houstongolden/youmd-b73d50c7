
-- Tighten profile_reports: allow anonymous but require reason
DROP POLICY "Anyone can create reports" ON public.profile_reports;
CREATE POLICY "Anyone can create reports with reason"
  ON public.profile_reports FOR INSERT
  WITH CHECK (reason IS NOT NULL AND reason != '');

-- Security logs insert is intentionally permissive for edge function usage
-- No change needed there - it's by design for service-level inserts
