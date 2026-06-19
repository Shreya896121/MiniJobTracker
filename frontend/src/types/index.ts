export type JobType = "INTERNSHIP" | "FULL_TIME" | "PART_TIME";

export type ApplicationStatus = "APPLIED" | "INTERVIEWING" | "OFFER" | "REJECTED";

export interface Application {
  id: string;
  companyName: string;
  jobTitle: string;
  jobType: JobType;
  status: ApplicationStatus;
  appliedDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationInput {
  companyName: string;
  jobTitle: string;
  jobType: JobType;
  status?: ApplicationStatus;
  appliedDate: string;
  notes?: string;
}

export interface UpdateApplicationInput extends Partial<CreateApplicationInput> { }
