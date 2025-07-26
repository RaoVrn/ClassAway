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
}
