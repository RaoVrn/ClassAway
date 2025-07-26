export type ODType = 'Placement' | 'Self-Applied';
export type ODStatus = 'Applied' | 'In Process' | 'Approved' | 'Rejected';

export interface OD {
  _id: string;
  user: string;
  type: ODType;
  title: string;
  reason: string;
  date: string;
  status: ODStatus;
  attachment?: string;
}
