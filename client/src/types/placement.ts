export type PlacementStatus =
  | 'Application Sent'
  | 'Shortlisted'
  | 'Pre-Placement Talk'
  | 'Test'
  | 'Interview'
  | 'Offer';

export interface Placement {
  _id: string;
  user: string;
  company: string;
  status: PlacementStatus;
  salaryRange?: string; // e.g. '5-10 LPA'
  salary?: number;
  jobType?: string; // e.g. 'Intern', 'Full Time'
  jobRole?: string;
  applicationDate?: string; // ISO string
}
