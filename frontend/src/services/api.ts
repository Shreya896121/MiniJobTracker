import type { Application, CreateApplicationInput, UpdateApplicationInput } from "../types";

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || "http://localhost:3001/graphql";

export interface PaginatedApplications {
  applications: Application[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Helper to make GraphQL requests
async function graphqlFetch<T>(query: string, variables?: Record<string, any>): Promise<T> {
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "No response body");
    throw new Error(`Server returned HTTP ${res.status}: ${text}`);
  }

  let responseBody;
  try {
    responseBody = await res.json();
  } catch (err) {
    throw new Error("Received an invalid non-JSON response from the server.");
  }

  if (responseBody.errors && responseBody.errors.length > 0) {
    throw new Error(responseBody.errors[0].message || "GraphQL request failed");
  }

  return responseBody.data;
}

export async function fetchApplications(params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedApplications> {
  const query = `
    query GetApplications($status: ApplicationStatus, $search: String, $page: Int, $limit: Int) {
      applications(status: $status, search: $search, page: $page, limit: $limit) {
        applications {
          id
          companyName
          jobTitle
          jobType
          status
          appliedDate
          notes
          createdAt
          updatedAt
        }
        pagination {
          total
          page
          limit
          totalPages
        }
      }
    }
  `;

  const data = await graphqlFetch<{ applications: PaginatedApplications }>(query, {
    status: params?.status === "ALL" ? undefined : params?.status,
    search: params?.search,
    page: params?.page,
    limit: params?.limit,
  });

  return data.applications;
}

export async function fetchApplicationById(id: string): Promise<Application> {
  const query = `
    query GetApplicationById($id: ID!) {
      application(id: $id) {
        id
        companyName
        jobTitle
        jobType
        status
        appliedDate
        notes
        createdAt
        updatedAt
      }
    }
  `;

  const data = await graphqlFetch<{ application: Application }>(query, { id });
  return data.application;
}

export async function createApplication(data: CreateApplicationInput): Promise<Application> {
  const mutation = `
    mutation CreateApplication(
      $companyName: String!
      $jobTitle: String!
      $jobType: JobType!
      $status: ApplicationStatus
      $appliedDate: String!
      $notes: String
    ) {
      createApplication(
        companyName: $companyName
        jobTitle: $jobTitle
        jobType: $jobType
        status: $status
        appliedDate: $appliedDate
        notes: $notes
      ) {
        id
        companyName
        jobTitle
        jobType
        status
        appliedDate
        notes
        createdAt
        updatedAt
      }
    }
  `;

  const response = await graphqlFetch<{ createApplication: Application }>(mutation, data);
  return response.createApplication;
}

export async function updateApplication(id: string, data: UpdateApplicationInput): Promise<Application> {
  const mutation = `
    mutation UpdateApplication(
      $id: ID!
      $companyName: String
      $jobTitle: String
      $jobType: JobType
      $status: ApplicationStatus
      $appliedDate: String
      $notes: String
    ) {
      updateApplication(
        id: $id
        companyName: $companyName
        jobTitle: $jobTitle
        jobType: $jobType
        status: $status
        appliedDate: $appliedDate
        notes: $notes
      ) {
        id
        companyName
        jobTitle
        jobType
        status
        appliedDate
        notes
        createdAt
        updatedAt
      }
    }
  `;

  const response = await graphqlFetch<{ updateApplication: Application }>(mutation, {
    id,
    ...data,
  });
  return response.updateApplication;
}

export async function deleteApplication(id: string): Promise<void> {
  const mutation = `
    mutation DeleteApplication($id: ID!) {
      deleteApplication(id: $id)
    }
  `;

  await graphqlFetch<{ deleteApplication: boolean }>(mutation, { id });
}
